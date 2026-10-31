import { nanoid } from 'nanoid';
import User from '../models/User.js';
import Group from '../models/Group.js';
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

export function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

export async function createUser({ name, phone, gender, upiId }) {
  const user = await User.create({ name, phone, gender, upiId: upiId || null });
  return user.toObject({ versionKey: false });
}

// Attaches the display fields the frontend needs (station name, fare
// split, member names/zones) to a raw Group document.
export async function groupView(group) {
  const station = findStation(group.stationId);
  const userIds = group.members.map((m) => m.userId);
  const users = await User.find({ _id: { $in: userIds } }).lean();
  const byId = Object.fromEntries(users.map((u) => [u._id, u]));

  const riders = group.members.map((m) => ({ userId: m.userId, distanceKm: findZone(station, m.zoneId).distanceKm }));
  const fare = splitFare(riders);

  return {
    id: group._id,
    stationId: group.stationId,
    stationName: station.name,
    meetingPoint: group.meetingPoint,
    womenOnly: group.womenOnly,
    status: group.status,
    seatsLeft: MAX_SEATS - group.members.length,
    expiresInMs: Math.max(0, new Date(group.expiresAt).getTime() - Date.now()),
    messages: group.messages,
    fare,
    members: group.members.map((m) => {
      const u = byId[m.userId];
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
  return g.status === 'open' && new Date(g.expiresAt).getTime() > Date.now() && g.members.length < MAX_SEATS;
}

export async function activeGroupFor(userId) {
  return Group.findOne({ status: { $in: ['open', 'full'] }, 'members.userId': userId });
}

// Score candidate groups: same zone beats same direction; fuller groups
// first so autos fill up and leave sooner.
async function findBestGroup({ stationId, zone, womenOnly, user }) {
  const station = findStation(stationId);
  const candidates = await Group.find({ stationId, status: 'open', womenOnly });
  let best = null;
  for (const g of candidates) {
    if (!isOpen(g)) continue;
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

export async function requestRide({ userId, stationId, zoneId, womenOnly = false, waitMs = WAIT_MS }) {
  const user = await User.findById(userId);
  if (!user) throw httpError(404, 'User not found');
  const station = findStation(stationId);
  const zone = findZone(station, zoneId);
  if (!station || !zone) throw httpError(400, 'Unknown station or destination');
  if (womenOnly && user.gender !== 'female') throw httpError(403, 'Women-only pools are for women riders');
  if (await activeGroupFor(userId)) throw httpError(409, 'You are already in a group');

  let group = await findBestGroup({ stationId, zone, womenOnly, user });
  if (!group) {
    group = new Group({
      stationId,
      meetingPoint: station.exits[0],
      womenOnly,
      status: 'open',
      expiresAt: new Date(Date.now() + waitMs),
      members: [],
      messages: [],
    });
  }
  group.members.push({ userId, zoneId, joinedAt: new Date(), paid: false });
  if (group.members.length >= MAX_SEATS) group.status = 'full';
  await group.save();
  return group;
}

export async function getGroup(id) {
  const g = await Group.findById(id);
  if (!g) throw httpError(404, 'Group not found');
  return g;
}

export async function leaveGroup(groupId, userId) {
  const g = await getGroup(groupId);
  g.members = g.members.filter((m) => m.userId !== userId);
  if (g.members.length === 0) g.status = 'cancelled';
  else if (g.status === 'full') g.status = 'open';
  await g.save();
  return g;
}

export async function depart(groupId, userId) {
  const g = await getGroup(groupId);
  if (!g.members.some((m) => m.userId === userId)) throw httpError(403, 'Not in this group');
  g.status = 'departed';
  await g.save();
  return g;
}

export async function markPaid(groupId, userId) {
  const g = await getGroup(groupId);
  const m = g.members.find((x) => x.userId === userId);
  if (!m) throw httpError(403, 'Not in this group');
  m.paid = true;
  await g.save();
  return g;
}

export async function postMessage(groupId, userId, text) {
  const g = await getGroup(groupId);
  if (!g.members.some((m) => m.userId === userId)) throw httpError(403, 'Not in this group');
  const user = await User.findById(userId);
  g.messages.push({ id: nanoid(8), userId, name: user?.name, text: String(text).slice(0, 300), at: new Date() });
  await g.save();
  return g;
}

// Groups that waited out the window with one rider are dissolved; groups
// of two or more are flagged ready so they can just leave.
export async function sweepExpired() {
  const expired = await Group.find({ status: 'open', expiresAt: { $lte: new Date() } });
  const changed = [];
  for (const g of expired) {
    g.status = g.members.length >= 2 ? 'full' : 'expired';
    await g.save();
    changed.push(g);
  }
  return changed;
}

export async function stationPool(stationId) {
  const groups = await Group.find({ stationId, status: 'open' });
  const open = groups.filter(isOpen);
  return Promise.all(open.map(groupView));
}
