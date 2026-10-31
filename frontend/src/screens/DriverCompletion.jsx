import { useState } from 'react';
import { StarGlyph, ClockGlyph, DistanceGlyph } from '../icons';
import { postedRide, rideRequests } from '../mock/data';

const passengers = rideRequests.map((r) => ({ id: r.id, name: r.name, fare: r.fare }));
const total = passengers.reduce((s, p) => s + p.fare, 0);

export default function DriverCompletion({ navigate }) {
  const [ratings, setRatings] = useState({});

  return (
    <div className="px-5 pt-[calc(env(safe-area-inset-top)+2.5rem)] pb-8 space-y-6">
      <div className="flex flex-col items-center text-center">
        <span className="w-16 h-16 rounded-full bg-transit-green-soft flex items-center justify-center mb-4">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="m5 12.5 4.5 4.5L19 7" stroke="var(--color-transit-green)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="font-display text-2xl font-bold">Ride completed</h1>
        <p className="text-ink-soft mt-1">
          {postedRide.from} → {postedRide.to}
        </p>
      </div>

      <div className="rounded-2xl bg-transit-green-soft p-5 text-center">
        <p className="text-sm text-ink-soft">You earned</p>
        <p className="font-display text-3xl font-bold text-transit-green mt-1">₹{total}</p>
      </div>

      <div className="grid grid-cols-2 text-center divide-x divide-rule border border-rule rounded-2xl bg-paper-raised py-4">
        <div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-ink-soft">
            <ClockGlyph size={15} color="var(--color-ink-soft)" /> Duration
          </p>
          <p className="font-semibold mt-1">12 mins</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-ink-soft">
            <DistanceGlyph size={15} color="var(--color-ink-soft)" /> Distance
          </p>
          <p className="font-semibold mt-1">3.2 km</p>
        </div>
      </div>

      <section>
        <p className="font-semibold mb-3">Rate your passengers</p>
        <div className="space-y-3">
          {passengers.map((p) => (
            <div key={p.id} className="border border-rule rounded-2xl bg-paper-raised p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center font-semibold">
                  {p.name[0]}
                </div>
                <div>
                  <p className="font-medium text-[15px]">{p.name}</p>
                  <p className="text-xs text-ink-soft">₹{p.fare} paid</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRatings((r) => ({ ...r, [p.id]: n }))} aria-label={`Rate ${n} star`}>
                    <StarGlyph
                      size={20}
                      color={(ratings[p.id] ?? 0) >= n ? 'var(--color-signal)' : 'var(--color-rule)'}
                      filled={(ratings[p.id] ?? 0) >= n}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <button onClick={() => navigate('activity')} className="w-full rounded-full bg-ink text-paper font-semibold py-4">
        Done
      </button>
    </div>
  );
}
