import { nanoid } from 'nanoid';
import { findStation, findZone } from '../config/stations.js';
import { splitFare } from './fare.js';

export const MAX_SEATS = 3;
export const WAIT_MS = 8 * 60 * 1000;
// Riders whose destinations are within this many degrees share a route.
export const BEARING_TOLERANCE = 35;

export function bearingGap(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

// In-memory store. Fine for a hackathon MVP; swap for a DB later.
export function createStore(now = () => Date.now()) {
  const users = new Map();
  const groups = new Map();

  function createUser({ name, phone, gender, upiId }) {
    const user = { id: nanoid(10), name, phone, gender, upiId: upiId || null, createdAt: now() };
    users.set(user.id, user);
    return user;
  }

  function groupView(g) {
    const station = findStation(g.stationId);
    const riders = g.members.map((m) => {
      const zone = findZone(station, m.zoneId);
      return { userId: m.userId, distanceKm: zone.distanceKm };
    });
    const fare = splitFare(riders);
    return {
      ...g,
      stationName: station.name,
      seatsLeft: MAX_SEATS - g.members.length,
      expiresInMs: Math.max(0, g.expiresAt - now()),
      fare,
      members: g.members.map((m) => {
        const u = users.get(m.userId);
        return {
          ...m,
          name: u?.name,
          upiId: u?.upiId,
          zoneName: findZone(station, m.zoneId).name,
          share: fare.shares.find((s) => s.userId === m.userId),
        };
      }),
    };
  }

  function isOpen(g) {
    return g.status === 'open' && g.expiresAt > now() && g.members.length < MAX_SEATS;
  }

  function activeGroupFor(userId) {
    for (const g of groups.values()) {
      if (['open', 'full'].includes(g.status) && g.members.some((m) => m.userId === userId)) return g;
    }
    return null;
  }

  // Score candidate groups: same zone beats same direction; fuller groups first
  // so autos fill up and leave sooner.
  function findBestGroup({ stationId, zone, womenOnly, user }) {
    const station = findStation(stationId);
    let best = null;
    for (const g of groups.values()) {
      if (g.stationId !== stationId || !isOpen(g)) continue;
      if (g.womenOnly !== womenOnly) continue;
      if (g.womenOnly && user.gender !== 'female') continue;
      const gaps = g.members.map((m) => bearingGap(findZone(station, m.zoneId).bearing, zone.bearing));
      const maxGap = Math.max(...gaps);
      if (maxGap > BEARING_TOLERANCE) continue;
      const sameZone = g.members.some((m) => m.zoneId === zone.id);
      const score = (sameZone ? 100 : 0) + g.members.length * 10 - maxGap;
      if (!best || score > best.score) best = { g, score };
    }
    return best?.g ?? null;
  }

  function requestRide({ userId, stationId, zoneId, womenOnly = false }) {
    const user = users.get(userId);
    if (!user) throw httpError(404, 'User not found');
    const station = findStation(stationId);
    const zone = findZone(station, zoneId);
    if (!station || !zone) throw httpError(400, 'Unknown station or destination');
    if (womenOnly && user.gender !== 'female') throw httpError(403, 'Women-only pools are for women riders');
    if (activeGroupFor(userId)) throw httpError(409, 'You are already in a group');

    let group = findBestGroup({ stationId, zone, womenOnly, user });
    if (!group) {
      group = {
        id: nanoid(8),
        stationId,
        meetingPoint: station.exits[0],
        womenOnly,
        status: 'open',
        createdAt: now(),
        expiresAt: now() + WAIT_MS,
        members: [],
        messages: [],
      };
      groups.set(group.id, group);
    }
    group.members.push({ userId, zoneId, joinedAt: now(), paid: false });
    if (group.members.length >= MAX_SEATS) group.status = 'full';
    return group;
  }

  function leaveGroup(groupId, userId) {
    const g = mustGroup(groupId);
    g.members = g.members.filter((m) => m.userId !== userId);
    if (g.members.length === 0) g.status = 'cancelled';
    else if (g.status === 'full') g.status = 'open';
    return g;
  }

  function depart(groupId, userId) {
    const g = mustGroup(groupId);
    if (!g.members.some((m) => m.userId === userId)) throw httpError(403, 'Not in this group');
    g.status = 'departed';
    g.departedAt = now();
    return g;
  }

  function markPaid(groupId, userId) {
    const g = mustGroup(groupId);
    const m = g.members.find((x) => x.userId === userId);
    if (!m) throw httpError(403, 'Not in this group');
    m.paid = true;
    return g;
  }

  function postMessage(groupId, userId, text) {
    const g = mustGroup(groupId);
    if (!g.members.some((m) => m.userId === userId)) throw httpError(403, 'Not in this group');
    const msg = { id: nanoid(8), userId, name: users.get(userId)?.name, text: String(text).slice(0, 300), at: now() };
    g.messages.push(msg);
    return g;
  }

  // Groups that waited out the window with one rider are dissolved;
  // groups of two or more are flagged ready so they can just leave.
  function sweepExpired() {
    const changed = [];
    for (const g of groups.values()) {
      if (g.status !== 'open' || g.expiresAt > now()) continue;
      g.status = g.members.length >= 2 ? 'full' : 'expired';
      changed.push(g);
    }
    return changed;
  }

  function stationPool(stationId) {
    return [...groups.values()].filter((g) => g.stationId === stationId && isOpen(g)).map(groupView);
  }

  function mustGroup(id) {
    const g = groups.get(id);
    if (!g) throw httpError(404, 'Group not found');
    return g;
  }

  return {
    users,
    groups,
    createUser,
    requestRide,
    leaveGroup,
    depart,
    markPaid,
    postMessage,
    sweepExpired,
    stationPool,
    groupView,
    activeGroupFor,
    getGroup: mustGroup,
  };
}

export function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}
