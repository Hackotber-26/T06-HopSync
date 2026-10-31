const path = require('node:path');
const dotenv = require('dotenv');
const assert = require('node:assert/strict');
const { after, before, beforeEach, describe, it } = require('node:test');

// Load the current backend .env, then isolate secrets, database, and external
// integrations before loading the server. No live database or provider is used.
dotenv.config({ path: path.join(__dirname, '..', '.env'), quiet: true });
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.JWT_SECRET = 'ridify-api-test-access-secret-9f34c1b7';
process.env.JWT_REFRESH_SECRET = 'ridify-api-test-refresh-secret-a610e94c';
process.env.ADMIN_SECRET = 'ridify-api-test-admin-secret-34d810f2';
process.env.BCRYPT_ROUNDS = '4';
process.env.ADMIN_EMAILS = 'admin@ridify.test';
process.env.ALLOWED_EMAIL_DOMAIN = '';
process.env.ALLOWED_ORIGIN = 'http://client.ridify.test';
process.env.GOOGLE_APPS_SCRIPT_URL = '';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { io: socketIo } = require('socket.io-client');
const emailModule = require('../utils/emailjs');
const actualSendOtpEmail = emailModule.sendOtpEmail;
const sentEmails = [];
emailModule.sendOtpEmail = async (email, otp) => {
  sentEmails.push({ email, otp });
  return true;
};

let mongo;
let appServer;
let app;
let OtpVerification;

const auth = token => ({ Authorization: `Bearer ${token}` });

async function registerUser(email, name = 'Test User', password = 'secret123') {
  const normalizedEmail = email.toLowerCase();
  await request(appServer)
    .post('/api/auth/signup-otp-request')
    .send({ email: normalizedEmail })
    .expect(200);

  const otpRecord = await OtpVerification.findOne({ email: normalizedEmail });
  if (!otpRecord) throw new Error(`No signup OTP stored for ${normalizedEmail}`);

  const response = await request(appServer)
    .post('/api/auth/register')
    .send({ name, email: normalizedEmail, password, otp: otpRecord.otp })
    .expect(201);

  return {
    ...response.body,
    email: normalizedEmail,
    password,
  };
}

before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri('ridify_api_tests');

  ({ app, server: appServer } = require('../server'));
  OtpVerification = require('../models/OtpVerification');
  await mongoose.connection.asPromise();
  await new Promise(resolve => appServer.listen(0, '127.0.0.1', resolve));
});

beforeEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map(collection => collection.deleteMany({}))
  );
  sentEmails.length = 0;
});

after(async () => {
  if (appServer?.listening) {
    await new Promise(resolve => appServer.close(resolve));
  }
  await mongoose.disconnect();
  await mongo?.stop();
});

describe('public API and security middleware', () => {
  it('serves health, runtime config, the status page, and static assets', async () => {
    const health = await request(appServer).get('/health').expect(200);
    assert.deepEqual(health.body, { status: 'ok' });
    assert.equal(health.headers['x-content-type-options'], 'nosniff');

    const config = await request(appServer).get('/api/config').expect(200);
    assert.ok(config.body.kMaxFieldLength > 0);
    assert.ok(config.body.kMaxRoutePoints > 0);
    assert.match(config.headers['cache-control'], /no-store/);

    const statusPage = await request(appServer).get('/').expect(200);
    assert.match(statusPage.text, /Ridify/);

    await request(appServer).get('/static/logo.png').expect(200).expect('Content-Type', /image\/png/);
  });

  it('allows the configured browser origin and rejects unauthenticated protected APIs', async () => {
    const corsResponse = await request(appServer)
      .get('/api/config')
      .set('Origin', 'http://client.ridify.test')
      .expect(200);
    assert.equal(corsResponse.headers['access-control-allow-origin'], 'http://client.ridify.test');

    await request(appServer).get('/api/rides').expect(401);
    await request(appServer).get('/api/rides/search').expect(401);
    await request(appServer).get('/api/admin/stats').expect(401);
    await request(appServer).delete('/api/rides').expect(401);
    await request(appServer).post('/api/auth/logout').send({}).expect(401);
  });

  it('requires authentication on every protected HTTP route', async () => {
    const routes = [
      ['delete', '/api/auth/user/target%40ridify.test'],
      ['delete', '/api/auth/users'],
      ['post', '/api/auth/logout'],
      ['patch', '/api/auth/change-password'],
      ['patch', '/api/auth/user/target%40ridify.test'],
      ['post', '/api/auth/user/target%40ridify.test/upload-id'],
      ['get', '/api/auth/user/target%40ridify.test/profile'],
      ['get', '/api/rides/stats/driver'],
      ['get', '/api/rides'],
      ['get', '/api/rides/not-an-id'],
      ['post', '/api/rides'],
      ['patch', '/api/rides/cancel/not-an-id'],
      ['delete', '/api/rides'],
      ['patch', '/api/rides/request/not-an-id'],
      ['patch', '/api/rides/accept/not-an-id/target%40ridify.test'],
      ['patch', '/api/rides/decline/not-an-id/target%40ridify.test'],
      ['patch', '/api/rides/kick/not-an-id/target%40ridify.test'],
      ['patch', '/api/rides/arrive/not-an-id/target%40ridify.test'],
      ['patch', '/api/rides/board/not-an-id/target%40ridify.test'],
      ['patch', '/api/rides/dropoff/not-an-id/target%40ridify.test'],
      ['patch', '/api/rides/pay/not-an-id/target%40ridify.test'],
      ['patch', '/api/rides/start/not-an-id'],
      ['patch', '/api/rides/end/not-an-id'],
      ['post', '/api/rides/not-an-id/chat'],
      ['get', '/api/admin/users'],
      ['get', '/api/admin/users/not-an-id'],
      ['post', '/api/admin/users/create'],
      ['patch', '/api/admin/users/not-an-id'],
      ['delete', '/api/admin/users/not-an-id'],
      ['post', '/api/admin/users/bulk-delete'],
      ['post', '/api/admin/users/not-an-id/ban'],
      ['post', '/api/admin/users/not-an-id/unban'],
      ['patch', '/api/admin/users/not-an-id/verify'],
      ['patch', '/api/admin/users/not-an-id/reject-verification'],
      ['get', '/api/admin/verifications/pending'],
      ['get', '/api/admin/rides'],
      ['get', '/api/admin/rides/not-an-id'],
      ['delete', '/api/admin/rides/not-an-id'],
      ['delete', '/api/admin/rides'],
      ['patch', '/api/admin/rides/not-an-id/cancel'],
      ['get', '/api/admin/stats'],
    ];

    for (const [method, url] of routes) {
      let call = request(appServer)[method](url);
      if (['post', 'patch'].includes(method)) call = call.send({});
      await call.expect(401);
    }
  });

  it('authenticates Socket.IO handshakes and rejects missing or invalid JWTs', async () => {
    const endpoint = `http://127.0.0.1:${appServer.address().port}`;
    const invalid = socketIo(endpoint, { auth: { token: 'invalid-token' }, reconnection: false });
    const invalidError = await new Promise(resolve => invalid.once('connect_error', resolve));
    assert.match(invalidError.message, /invalid or expired/i);
    invalid.close();

    const noToken = socketIo(endpoint, { reconnection: false });
    const missingError = await new Promise(resolve => noToken.once('connect_error', resolve));
    assert.match(missingError.message, /authentication required/i);
    noToken.close();

    const user = await registerUser('socket@ridify.test', 'Socket User');
    const authenticated = socketIo(endpoint, {
      auth: { token: user.accessToken },
      reconnection: false,
    });
    await new Promise((resolve, reject) => {
      authenticated.once('connect', resolve);
      authenticated.once('connect_error', reject);
    });
    assert.equal(authenticated.connected, true);
    authenticated.disconnect();
  });
});

describe('environment validation and external-service safeguards', () => {
  const { validateEnv } = require('../scripts/validate-env');

  function validEnv(overrides = {}) {
    return {
      JWT_SECRET: 'access-secret-value-'.repeat(3),
      JWT_REFRESH_SECRET: 'refresh-secret-value-'.repeat(3),
      MONGO_URI: 'mongodb://127.0.0.1:27017/ridify_test',
      ADMIN_SECRET: 'admin-secret-value-'.repeat(3),
      ADMIN_EMAILS: 'admin@ridify.test',
      PORT: '5001',
      NODE_ENV: 'development',
      ALLOWED_ORIGIN: 'http://localhost:3000',
      ...overrides,
    };
  }

  it('accepts valid development settings and rejects weak or malformed values', () => {
    assert.deepEqual(validateEnv(validEnv()), []);
    const errors = validateEnv(validEnv({
      JWT_REFRESH_SECRET: 'access-secret-value-'.repeat(3),
      MONGO_URI: 'mongodb+srv://<username>:<password>@cluster.mongodb.net/ridify',
      ADMIN_EMAILS: 'not-an-email',
      PORT: '70000',
    }));
    assert.ok(errors.some(error => /must be different/i.test(error)));
    assert.ok(errors.some(error => /placeholder/i.test(error)));
    assert.ok(errors.some(error => /valid email/i.test(error)));
    assert.ok(errors.some(error => /PORT/i.test(error)));
  });

  it('requires secure origins and configured integrations in production', () => {
    const errors = validateEnv(validEnv({ NODE_ENV: 'production', ALLOWED_ORIGIN: '*' }));
    assert.ok(errors.some(error => /wildcard/i.test(error)));
    assert.ok(errors.some(error => /EMAILJS/i.test(error)));
    assert.ok(errors.some(error => /GOOGLE_APPS_SCRIPT_URL/i.test(error)));
    assert.ok(validateEnv(validEnv({
      NODE_ENV: 'production',
      ALLOWED_ORIGIN: 'https://app.ridify.test',
      EMAILJS_SERVICE_ID: 'service_test_123',
      EMAILJS_TEMPLATE_ID: 'template_test_123',
      EMAILJS_PUBLIC_KEY: 'public_test_key_123',
      EMAILJS_PRIVATE_KEY: 'private_test_key_123',
      GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/test123/exec',
      GOOGLE_APPS_SCRIPT_SECRET: 'test_shared_secret_that_is_at_least_32_chars',
    })).length === 0);
  });

  it('fails OTP delivery when EmailJS settings are missing and builds requests without network access', async () => {
    const keys = ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_PUBLIC_KEY', 'EMAILJS_PRIVATE_KEY'];
    const oldValues = Object.fromEntries(keys.map(key => [key, process.env[key]]));
    const oldFetch = global.fetch;
    try {
      for (const key of keys) delete process.env[key];
      await assert.rejects(actualSendOtpEmail('test@ridify.test', '123456'), /EmailJS environment variables are missing/);

      for (const key of keys) process.env[key] = `test_${key.toLowerCase()}`;
      let captured;
      global.fetch = async (url, options) => {
        captured = { url, options, payload: JSON.parse(options.body) };
        return { ok: true, status: 200 };
      };
      assert.equal(await actualSendOtpEmail('test@ridify.test', '123456'), true);
      assert.match(captured.url, /emailjs\.com/);
      assert.equal(captured.payload.template_params.to_email, 'test@ridify.test');
      assert.equal(captured.payload.template_params.otp_code, '123456');
    } finally {
      global.fetch = oldFetch;
      for (const key of keys) {
        if (oldValues[key] === undefined) delete process.env[key];
        else process.env[key] = oldValues[key];
      }
    }
  });
});

describe('authentication and account lifecycle', () => {
  it('validates signup input, enforces OTP, normalizes email, and issues usable tokens', async () => {
    await request(appServer).post('/api/auth/signup-otp-request').send({}).expect(400);
    await request(appServer)
      .post('/api/auth/signup-otp-request')
      .send({ email: 'not-an-email' })
      .expect(400);
    assert.equal(sentEmails.length, 0);

    await request(appServer)
      .post('/api/auth/register')
      .send({ name: 'Missing OTP', email: 'new@ridify.test', password: 'secret123' })
      .expect(400);

    const email = 'driver@ridify.test';
    await request(appServer)
      .post('/api/auth/signup-otp-request')
      .send({ email: ' DRIVER@RIDIFY.TEST ' })
      .expect(200);
    assert.equal(sentEmails.length, 1);
    assert.equal(sentEmails[0].email, email);

    await request(appServer)
      .post('/api/auth/signup-otp-request')
      .send({ email })
      .expect(429);

    const otpRecord = await OtpVerification.findOne({ email });
    await request(appServer)
      .post('/api/auth/register')
      .send({ name: 'Driver', email, password: 'secret123', otp: '000000' })
      .expect(401);

    const registration = await request(appServer)
      .post('/api/auth/register')
      .send({ name: 'Driver', email: ' DRIVER@RIDIFY.TEST ', password: 'secret123', otp: otpRecord.otp })
      .expect(201);

    assert.equal(registration.body.user.email, email);
    assert.equal(registration.body.user.isAdmin, false);
    assert.equal(Object.hasOwn(registration.body.user, 'password'), false);
    assert.equal(typeof registration.body.accessToken, 'string');
    assert.equal(typeof registration.body.refreshToken, 'string');

    await request(appServer)
      .post('/api/auth/register')
      .send({ name: 'Driver', email, password: 'secret123', otp: otpRecord.otp })
      .expect(409);
    await request(appServer)
      .get(`/api/auth/user/${encodeURIComponent(email)}/profile`)
      .set(auth(registration.body.accessToken))
      .expect(200)
      .expect(({ body }) => assert.equal(body.name, 'Driver'));
  });

  it('supports password login, login OTP, refresh revocation, password changes, and logout', async () => {
    const user = await registerUser('member@ridify.test', 'Member');

    await request(appServer)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'wrong-password' })
      .expect(401);

    const login = await request(appServer)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    const refreshed = await request(appServer)
      .post('/api/auth/refresh')
      .send({ refreshToken: login.body.refreshToken })
      .expect(200);
    assert.equal(typeof refreshed.body.accessToken, 'string');

    await request(appServer)
      .post('/api/auth/login-otp-request')
      .send({ email: user.email })
      .expect(200);
    const loginOtp = sentEmails.at(-1).otp;
    await request(appServer)
      .post('/api/auth/login-otp-request')
      .send({ email: user.email })
      .expect(429);
    const otpLogin = await request(appServer)
      .post('/api/auth/login')
      .send({ email: user.email, otp: loginOtp })
      .expect(200);

    await request(appServer)
      .patch('/api/auth/change-password')
      .set(auth(otpLogin.body.accessToken))
      .send({ currentPassword: user.password, newPassword: user.password })
      .expect(400);
    await request(appServer)
      .patch('/api/auth/change-password')
      .set(auth(otpLogin.body.accessToken))
      .send({ currentPassword: user.password, newPassword: 'new-secret123' })
      .expect(200);

    await request(appServer)
      .post('/api/auth/refresh')
      .send({ refreshToken: otpLogin.body.refreshToken })
      .expect(401);

    const newLogin = await request(appServer)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'new-secret123' })
      .expect(200);
    await request(appServer)
      .post('/api/auth/logout')
      .set(auth(newLogin.body.accessToken))
      .send({ refreshToken: newLogin.body.refreshToken })
      .expect(200);
    await request(appServer)
      .post('/api/auth/refresh')
      .send({ refreshToken: newLogin.body.refreshToken })
      .expect(401);
  });

  it('rejects malformed and tampered bearer tokens', async () => {
    await request(appServer)
      .get('/api/rides')
      .set('Authorization', 'not-a-bearer-token')
      .expect(401);
    await request(appServer)
      .get('/api/rides')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('enforces profile ownership and does not contact the ID upload service in tests', async () => {
    const first = await registerUser('first@ridify.test', 'First');
    const second = await registerUser('second@ridify.test', 'Second');

    await request(appServer)
      .get(`/api/auth/user/${encodeURIComponent(second.email)}/profile`)
      .set(auth(first.accessToken))
      .expect(403);
    await request(appServer)
      .patch(`/api/auth/user/${encodeURIComponent(second.email)}`)
      .set(auth(first.accessToken))
      .send({ name: 'Changed' })
      .expect(403);

    await request(appServer)
      .post(`/api/auth/user/${encodeURIComponent(first.email)}/upload-id`)
      .set(auth(first.accessToken))
      .send({ base64: 'dGVzdA==', filename: 'id.png' })
      .expect(500)
      .expect(({ body }) => assert.match(body.error, /not set/i));
  });
});

describe('rides and administration', () => {
  it('creates, searches, requests, accepts, chats, and cancels a ride with ownership checks', async () => {
    const driver = await registerUser('driver@ridify.test', 'Driver');
    const passenger = await registerUser('passenger@ridify.test', 'Passenger');
    const routePath = [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7849, lng: -122.4094 },
      { lat: 37.7949, lng: -122.3994 },
    ];
    const rideInput = {
      riderEmail: 'spoof@ridify.test',
      riderName: 'Spoofed Name',
      pickupLocation: 'Start',
      pickupLat: routePath[0].lat,
      pickupLng: routePath[0].lng,
      destination: 'Finish',
      destLat: routePath[2].lat,
      destLng: routePath[2].lng,
      fare: 200,
      vehicleType: 'Sedan',
      totalSeats: 2,
      availableSeats: 2,
      routePath,
      totalDistance: 5,
      routePreference: 'flexible',
    };

    await request(appServer)
      .post('/api/rides')
      .set(auth(driver.accessToken))
      .send({ ...rideInput, routePath: [{ lat: 1, lng: 2 }] })
      .expect(400);

    const created = await request(appServer)
      .post('/api/rides')
      .set(auth(driver.accessToken))
      .send(rideInput)
      .expect(201);
    const rideId = created.body.ride._id;
    assert.equal(created.body.ride.riderEmail, driver.email);
    assert.equal(created.body.ride.riderName, 'Driver');

    await request(appServer)
      .get('/api/rides/not-an-id')
      .set(auth(driver.accessToken))
      .expect(400);

    const search = await request(appServer)
      .get('/api/rides/search')
      .query({
        lat: routePath[0].lat,
        lng: routePath[0].lng,
        destLat: routePath[2].lat,
        destLng: routePath[2].lng,
        radius: 5000,
        seats: 1,
      })
      .set(auth(passenger.accessToken))
      .expect(200);
    assert.ok(search.body.some(ride => ride._id === rideId));

    await request(appServer)
      .patch(`/api/rides/request/${rideId}`)
      .set(auth(driver.accessToken))
      .send({ seats: 1, startIndex: 0, endIndex: 2 })
      .expect(400);

    const rideRequest = await request(appServer)
      .patch(`/api/rides/request/${rideId}`)
      .set(auth(passenger.accessToken))
      .send({
        seats: 1,
        computedFare: 1,
        computedDistance: 1,
        startIndex: 0,
        endIndex: 2,
        pickupLat: routePath[0].lat,
        pickupLng: routePath[0].lng,
        destLat: routePath[2].lat,
        destLng: routePath[2].lng,
        pickupLocation: 'Start',
        destination: 'Finish',
      })
      .expect(200);
    assert.equal(rideRequest.body.success, true);
    const storedRequest = await request(appServer)
      .get(`/api/rides/${rideId}`)
      .set(auth(driver.accessToken))
      .expect(200);
    assert.ok(storedRequest.body.requests.includes(passenger.email));
    assert.ok(storedRequest.body.riderDetails[passenger.email].fare > 1);

    await request(appServer)
      .patch(`/api/rides/accept/${rideId}/${encodeURIComponent(passenger.email)}`)
      .set(auth(passenger.accessToken))
      .send({})
      .expect(403);
    await request(appServer)
      .patch(`/api/rides/accept/${rideId}/${encodeURIComponent(passenger.email)}`)
      .set(auth(driver.accessToken))
      .send({})
      .expect(200);

    const chat = await request(appServer)
      .post(`/api/rides/${rideId}/chat`)
      .set(auth(passenger.accessToken))
      .send({ text: '<script>alert(1)</script>Hello' })
      .expect(200);
    assert.equal(chat.body.message.text, 'Hello');

    await request(appServer)
      .patch(`/api/rides/cancel/${rideId}`)
      .set(auth(passenger.accessToken))
      .send({})
      .expect(403);
    await request(appServer)
      .patch(`/api/rides/cancel/${rideId}`)
      .set(auth(driver.accessToken))
      .send({})
      .expect(200);
    await request(appServer)
      .patch(`/api/rides/cancel/${rideId}`)
      .set(auth(driver.accessToken))
      .send({})
      .expect(400);

    const cancelled = await request(appServer)
      .get(`/api/rides/${rideId}`)
      .set(auth(driver.accessToken))
      .expect(200);
    assert.equal(cancelled.body.status, 'cancelled');
  });

  it('runs an accepted ride through arrival, boarding, drop-off, payment, and completion', async () => {
    const driver = await registerUser('lifecycle-driver@ridify.test', 'Lifecycle Driver');
    const passenger = await registerUser('lifecycle-passenger@ridify.test', 'Lifecycle Passenger');
    const routePath = [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7849, lng: -122.4094 },
      { lat: 37.7949, lng: -122.3994 },
    ];
    const ride = await request(appServer)
      .post('/api/rides')
      .set(auth(driver.accessToken))
      .send({
        pickupLocation: 'Lifecycle start',
        pickupLat: routePath[0].lat,
        pickupLng: routePath[0].lng,
        destination: 'Lifecycle end',
        destLat: routePath[2].lat,
        destLng: routePath[2].lng,
        fare: 200,
        vehicleType: 'Sedan',
        totalSeats: 2,
        routePath,
        totalDistance: 5,
        routePreference: 'flexible',
      })
      .expect(201);
    const rideId = ride.body.ride._id;
    const passengerPath = encodeURIComponent(passenger.email);

    await request(appServer)
      .patch(`/api/rides/request/${rideId}`)
      .set(auth(passenger.accessToken))
      .send({
        seats: 1,
        computedFare: 100,
        computedDistance: 2,
        startIndex: 0,
        endIndex: 2,
        pickupLat: routePath[0].lat,
        pickupLng: routePath[0].lng,
        destLat: routePath[2].lat,
        destLng: routePath[2].lng,
        pickupLocation: 'Lifecycle start',
        destination: 'Lifecycle end',
      })
      .expect(200);
    await request(appServer)
      .patch(`/api/rides/accept/${rideId}/${passengerPath}`)
      .set(auth(driver.accessToken))
      .send({})
      .expect(200);
    await request(appServer)
      .patch(`/api/rides/start/${rideId}`)
      .set(auth(driver.accessToken))
      .send({})
      .expect(200);
    await request(appServer)
      .patch(`/api/rides/arrive/${rideId}/${passengerPath}`)
      .set(auth(driver.accessToken))
      .send({})
      .expect(200);
    await request(appServer)
      .patch(`/api/rides/board/${rideId}/${passengerPath}`)
      .set(auth(driver.accessToken))
      .send({})
      .expect(200);
    await request(appServer)
      .patch(`/api/rides/dropoff/${rideId}/${passengerPath}`)
      .set(auth(driver.accessToken))
      .send({})
      .expect(200);
    await request(appServer)
      .patch(`/api/rides/pay/${rideId}/${passengerPath}`)
      .set(auth(passenger.accessToken))
      .send({})
      .expect(200);
    const completed = await request(appServer)
      .patch(`/api/rides/end/${rideId}`)
      .set(auth(driver.accessToken))
      .send({})
      .expect(200);

    assert.equal(completed.body.status, 'completed');
    assert.ok(completed.body.paidPassengers.includes(passenger.email));
    const stats = await request(appServer)
      .get('/api/rides/stats/driver')
      .set(auth(driver.accessToken))
      .expect(200);
    assert.ok(stats.body.totalRides >= 1);
  });

  it('restricts admin APIs and protects account data in admin listings', async () => {
    const regular = await registerUser('regular@ridify.test', 'Regular');
    const admin = await registerUser('admin@ridify.test', 'Admin');
    assert.equal(admin.user.isAdmin, true);

    await request(appServer)
      .get('/api/admin/users')
      .set(auth(regular.accessToken))
      .expect(403);

    const listing = await request(appServer)
      .get('/api/admin/users')
      .set(auth(admin.accessToken))
      .expect(200);
    assert.equal(listing.body.users.length, 2);
    assert.ok(listing.body.users.every(user => !Object.hasOwn(user, 'password')));

    const regularRecord = listing.body.users.find(user => user.email === regular.email);
    assert.ok(regularRecord);
    await request(appServer)
      .post(`/api/admin/users/${regularRecord._id}/ban`)
      .set(auth(admin.accessToken))
      .send({})
      .expect(200);
    await request(appServer)
      .get('/api/rides')
      .set(auth(regular.accessToken))
      .expect(403);
    await request(appServer)
      .post(`/api/admin/users/${regularRecord._id}/unban`)
      .set(auth(admin.accessToken))
      .send({})
      .expect(200);
    await request(appServer)
      .get('/api/rides')
      .set(auth(regular.accessToken))
      .expect(200);

    await request(appServer)
      .post('/api/admin/users/create')
      .set(auth(admin.accessToken))
      .send({ name: 'Admin Created', email: 'created@ridify.test', password: 'secret123' })
      .expect(201);

    const createdUser = await request(appServer)
      .get('/api/admin/users')
      .set(auth(admin.accessToken))
      .expect(200)
      .then(({ body }) => body.users.find(user => user.email === 'created@ridify.test'));
    assert.ok(createdUser);

    await request(appServer)
      .get('/api/admin/users/not-an-id')
      .set(auth(admin.accessToken))
      .expect(400);

    await request(appServer)
      .delete(`/api/admin/users/${createdUser._id}`)
      .set(auth(admin.accessToken))
      .expect(200);
    await request(appServer)
      .get('/api/admin/stats')
      .set(auth(admin.accessToken))
      .expect(200);
  });

  it('runs administrator-wide deletes only against the isolated test database', async () => {
    const admin = await registerUser('admin@ridify.test', 'Admin');
    const member = await registerUser('cleanup@ridify.test', 'Cleanup Member');
    await request(appServer)
      .delete('/api/auth/users')
      .set(auth(member.accessToken))
      .send({})
      .expect(403);
    const deleted = await request(appServer)
      .delete('/api/auth/users')
      .set(auth(admin.accessToken))
      .send({})
      .expect(200);
    assert.match(deleted.body.message, /deleted/i);
    const remaining = await request(appServer)
      .get('/api/admin/users')
      .set(auth(admin.accessToken))
      .expect(200);
    assert.deepEqual(remaining.body.users.map(user => user.email), [admin.email]);
    await request(appServer)
      .delete('/api/rides')
      .set(auth(admin.accessToken))
      .expect(200);
  });
});
