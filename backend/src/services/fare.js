// Bengaluru auto meter: minimum fare covers the first 2 km, then per-km.
export const FARE = { baseFare: 36, baseKm: 2, perKm: 18 };

export function meterFare(km) {
  if (km <= FARE.baseKm) return FARE.baseFare;
  return Math.round(FARE.baseFare + (km - FARE.baseKm) * FARE.perKm);
}

// Segment-based split: the auto drops riders in order of distance. Each
// stretch of road is shared equally by whoever is still on board, so a
// rider who gets off early never pays for the kilometres after their stop.
export function splitFare(riders) {
  if (riders.length === 0) return { total: 0, shares: [], soloTotal: 0 };

  const sorted = [...riders].sort((a, b) => a.distanceKm - b.distanceKm);
  const totalKm = sorted.at(-1).distanceKm;
  const total = meterFare(totalKm);

  const owed = new Map(sorted.map((r) => [r.userId, 0]));
  let prevKm = 0;
  sorted.forEach((r, i) => {
    const segmentKm = r.distanceKm - prevKm;
    const onBoard = sorted.slice(i);
    const segmentCost = (segmentKm / totalKm) * total;
    onBoard.forEach((o) => owed.set(o.userId, owed.get(o.userId) + segmentCost / onBoard.length));
    prevKm = r.distanceKm;
  });

  // Round to whole rupees, giving any rounding difference to the last rider.
  const shares = sorted.map((r) => ({
    userId: r.userId,
    amount: Math.round(owed.get(r.userId)),
    solo: meterFare(r.distanceKm),
  }));
  const diff = total - shares.reduce((s, x) => s + x.amount, 0);
  shares[shares.length - 1].amount += diff;

  return { total, shares, soloTotal: shares.reduce((s, x) => s + x.solo, 0) };
}
