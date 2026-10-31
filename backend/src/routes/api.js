import { Router } from 'express';
import { STATIONS } from '../config/stations.js';
import { FARE } from '../services/fare.js';
import { httpError } from '../services/matching.js';

export function apiRouter(store, notify) {
  const r = Router();
  const wrap = (fn) => (req, res, next) => {
    try {
      res.json(fn(req));
    } catch (e) {
      next(e);
    }
  };
  const changed = (g) => {
    notify(g);
    return store.groupView(g);
  };

  r.get('/health', wrap(() => ({ ok: true })));
  r.get('/stations', wrap(() => ({ stations: STATIONS, fare: FARE })));

  r.post('/users', wrap((req) => {
    const { name, phone, gender, upiId } = req.body ?? {};
    if (!name?.trim() || !/^[6-9]\d{9}$/.test(phone ?? '')) throw httpError(400, 'Name and a valid 10-digit mobile number are required');
    return store.createUser({ name: name.trim(), phone, gender, upiId });
  }));

  r.get('/users/:id/active-group', wrap((req) => {
    const g = store.activeGroupFor(req.params.id);
    return { group: g ? store.groupView(g) : null };
  }));

  r.get('/stations/:id/pool', wrap((req) => ({ groups: store.stationPool(req.params.id) })));

  r.post('/rides', wrap((req) => changed(store.requestRide(req.body ?? {}))));

  r.get('/groups/:id', wrap((req) => store.groupView(store.getGroup(req.params.id))));
  r.post('/groups/:id/leave', wrap((req) => changed(store.leaveGroup(req.params.id, req.body.userId))));
  r.post('/groups/:id/depart', wrap((req) => changed(store.depart(req.params.id, req.body.userId))));
  r.post('/groups/:id/paid', wrap((req) => changed(store.markPaid(req.params.id, req.body.userId))));
  r.post('/groups/:id/messages', wrap((req) => changed(store.postMessage(req.params.id, req.body.userId, req.body.text))));

  return r;
}
