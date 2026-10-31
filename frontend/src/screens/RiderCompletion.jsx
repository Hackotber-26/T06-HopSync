import { useState } from 'react';
import { StarGlyph, ClockGlyph, DistanceGlyph, CheckBadge } from '../icons';
import { liveRide, availableRides } from '../mock/data';

const ride = availableRides[0];

export default function RiderCompletion({ navigate }) {
  const [rating, setRating] = useState(0);

  return (
    <div className="px-5 pt-[calc(env(safe-area-inset-top)+2.5rem)] pb-8 space-y-6">
      <div className="flex flex-col items-center text-center">
        <span className="w-16 h-16 rounded-full bg-transit-green-soft flex items-center justify-center mb-4">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="m5 12.5 4.5 4.5L19 7" stroke="var(--color-transit-green)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="font-display text-2xl font-bold">You've arrived</h1>
        <p className="text-ink-soft mt-1">
          {ride.from} → {ride.to}
        </p>
      </div>

      <div className="rounded-2xl bg-transit-coral-soft p-5 text-center">
        <p className="text-sm text-ink-soft">Your share</p>
        <p className="font-display text-3xl font-bold text-transit-coral mt-1">₹{ride.price}</p>
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
          <p className="font-semibold mt-1">{ride.distanceKm} km</p>
        </div>
      </div>

      <section className="border border-rule rounded-2xl bg-paper-raised p-4">
        <p className="font-semibold mb-3">Rate {liveRide.driver}</p>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center font-semibold">
            {liveRide.driver[0]}
          </div>
          <p className="font-medium flex items-center gap-1.5">
            {liveRide.driver} <CheckBadge size={15} />
          </p>
        </div>
        <div className="flex justify-center gap-1.5 mt-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} aria-label={`Rate ${n} star`}>
              <StarGlyph size={30} color={rating >= n ? 'var(--color-signal)' : 'var(--color-rule)'} filled={rating >= n} />
            </button>
          ))}
        </div>
      </section>

      <button onClick={() => navigate('home')} className="w-full rounded-full bg-ink text-paper font-semibold py-4">
        Done
      </button>
    </div>
  );
}
