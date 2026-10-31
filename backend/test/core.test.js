import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meterFare, splitFare } from '../src/services/fare.js';
import { createStore, WAIT_MS } from '../src/services/matching.js';

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

test('matching pools same-direction riders and caps at 3', () => {
  let t = 0;
  const s = createStore(() => t);
  const u = [1, 2, 3, 4].map((i) => s.createUser({ name: `u${i}`, phone: '9000000000', gender: 'male' }));
  const g1 = s.requestRide({ userId: u[0].id, stationId: 'baiyappanahalli', zoneId: 'bagmane-tech' });
  const g2 = s.requestRide({ userId: u[1].id, stationId: 'baiyappanahalli', zoneId: 'cv-raman-nagar' });
  assert.equal(g1.id, g2.id);
  // Opposite direction gets its own group.
  const g3 = s.requestRide({ userId: u[2].id, stationId: 'baiyappanahalli', zoneId: 'indiranagar-100ft' });
  assert.notEqual(g3.id, g1.id);
  t += WAIT_MS + 1;
  s.sweepExpired();
  assert.equal(s.getGroup(g1.id).status, 'full');
  assert.equal(s.getGroup(g3.id).status, 'expired');
  const g4 = s.requestRide({ userId: u[3].id, stationId: 'baiyappanahalli', zoneId: 'bagmane-tech' });
  assert.notEqual(g4.id, g1.id);
});

test('women-only pools exclude men', () => {
  const s = createStore();
  const m = s.createUser({ name: 'm', phone: '9000000000', gender: 'male' });
  assert.throws(() => s.requestRide({ userId: m.id, stationId: 'mg-road', zoneId: 'ub-city', womenOnly: true }), /Women-only/);
});
