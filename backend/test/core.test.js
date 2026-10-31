import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { meterFare, splitFare } from '../src/services/fare.js';
import * as store from '../src/services/matching.js';

test('meter fare', () => {
  assert.equal(meterFare(1.5), 36);
  assert.equal(meterFare(4), 72);
});

test('split: equal destinations split equally', () => {
  const { total, shares } = splitFare([{ userId: 'a', distanceKm: 4 }, { userId: 'b', distanceKm: 4 }]);
  assert.equal(total, 72);
  assert.deepEqual(shares.map((s) => s.amount), [36, 36]);
});

test('split: early drop pays less, everyone beats solo', () => {
  const { total, shares } = splitFare([{ userId: 'a', distanceKm: 2 }, { userId: 'b', distanceKm: 6 }]);
  assert.equal(shares.reduce((s, x) => s + x.amount, 0), total);
  assert.ok(shares[0].amount < shares[1].amount);
  shares.forEach((s) => assert.ok(s.amount < s.solo));
});

// Matching tests run against an in-process MongoDB (no real server needed).
let mongod;

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test('matching pools same-direction riders and caps at 3', async () => {
  const u = await Promise.all([1, 2, 3, 4].map((i) => store.createUser({ name: `u${i}`, phone: '9000000000', gender: 'male' })));
  const waitMs = 50;
  const g1 = await store.requestRide({ userId: u[0]._id, stationId: 'baiyappanahalli', zoneId: 'bagmane-tech', waitMs });
  const g2 = await store.requestRide({ userId: u[1]._id, stationId: 'baiyappanahalli', zoneId: 'cv-raman-nagar', waitMs });
  assert.equal(String(g1._id), String(g2._id));
  // Opposite direction gets its own group.
  const g3 = await store.requestRide({ userId: u[2]._id, stationId: 'baiyappanahalli', zoneId: 'indiranagar-100ft', waitMs });
  assert.notEqual(String(g3._id), String(g1._id));

  await new Promise((resolve) => setTimeout(resolve, waitMs + 20));
  await store.sweepExpired();
  assert.equal((await store.getGroup(g1._id)).status, 'full');
  assert.equal((await store.getGroup(g3._id)).status, 'expired');

  const g4 = await store.requestRide({ userId: u[3]._id, stationId: 'baiyappanahalli', zoneId: 'bagmane-tech', waitMs });
  assert.notEqual(String(g4._id), String(g1._id));
});

test('women-only pools exclude men', async () => {
  const m = await store.createUser({ name: 'm', phone: '9000000000', gender: 'male' });
  await assert.rejects(
    store.requestRide({ userId: m._id, stationId: 'mg-road', zoneId: 'ub-city', womenOnly: true }),
    /Women-only/,
  );
});
