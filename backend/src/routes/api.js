import { Router } from 'express';
import { STATIONS } from '../config/stations.js';
import { FARE } from '../services/fare.js';
import * as store from '../services/matching.js';

export function apiRouter(notify) {
  const r = Router();
  const wrap = (fn) => (req, res, next) => {
    Promise.resolve(fn(req)).then((data) => res.json(data)).catch(next);
  };
  const changed = async (g) => {
    const view = await store.groupView(g);
    notify(view);
    return view;
  };

  r.get('/health', wrap(() => ({ ok: true })));
  r.get('/stations', wrap(() => ({ stations: STATIONS, fare: FARE })));

  r.post(
    '/users',
    wrap((req) => {
      const { name, phone, gender, upiId } = req.body ?? {};
      if (!name?.trim() || !/^[6-9]\d{9}$/.test(phone ?? '')) throw store.httpError(400, 'Name and a valid 10-digit mobile number are required');
      return store.createUser({ name: name.trim(), phone, gender, upiId });
    }),
  );

  r.get(
    '/users/:id/active-group',
    wrap(async (req) => {
      const g = await store.activeGroupFor(req.params.id);
      return { group: g ? await store.groupView(g) : null };
    }),
  );

  r.get('/stations/:id/pool', wrap(async (req) => ({ groups: await store.stationPool(req.params.id) })));

  r.post('/rides', wrap(async (req) => changed(await store.requestRide(req.body ?? {}))));

  r.get('/groups/:id', wrap(async (req) => store.groupView(await store.getGroup(req.params.id))));
  r.post('/groups/:id/leave', wrap(async (req) => changed(await store.leaveGroup(req.params.id, req.body.userId))));
  r.post('/groups/:id/depart', wrap(async (req) => changed(await store.depart(req.params.id, req.body.userId))));
  r.post('/groups/:id/paid', wrap(async (req) => changed(await store.markPaid(req.params.id, req.body.userId))));
  r.post('/groups/:id/messages', wrap(async (req) => changed(await store.postMessage(req.params.id, req.body.userId, req.body.text))));

  return r;
}
