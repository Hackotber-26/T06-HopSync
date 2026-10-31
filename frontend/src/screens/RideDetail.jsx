import { useState } from 'react';
import { BackArrow, CloseX, SuvGlyph, SeatGlyph, DistanceGlyph, CheckBadge } from '../icons';
import { postedRide, rideRequests } from '../mock/data';

export default function RideDetail({ navigate }) {
  const [decided, setDecided] = useState({});

  return (
    <div>
      <header className="px-5 pt-[calc(env(safe-area-inset-top)+1.1rem)] pb-4 flex items-center gap-4 bg-paper">
        <button
          onClick={() => navigate('activity')}
          className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center"
        >
          <BackArrow size={18} />
        </button>
        <h1 className="font-display text-2xl font-bold">Ride Detail</h1>
      </header>

      <div className="px-5 pb-5 space-y-6">
        <div className="border border-rule rounded-2xl bg-paper-raised p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <SuvGlyph />
              <div>
                <p className="font-semibold">{postedRide.seatsTotal} Seats</p>
                <p className="text-sm text-ink-soft">
                  {postedRide.date} · {postedRide.time}
                </p>
                <p className="text-sm text-ink-soft">{postedRide.mode}</p>
              </div>
            </div>
            <button onClick={() => navigate('activity')} aria-label="Close">
              <CloseX color="var(--color-ink-soft)" />
            </button>
          </div>
          <div className="mt-4 ml-1 space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-transit-green inline-block" />
              <span className="font-medium text-[15px]">{postedRide.from}</span>
            </div>
            <div className="w-px h-3 bg-rule ml-[5px]" />
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-transit-coral inline-block" />
              <span className="font-medium text-[15px]">{postedRide.to}</span>
            </div>
          </div>
        </div>

        <section>
          <p className="font-semibold mb-3">Requests</p>
          <div className="space-y-4">
            {rideRequests.map((r) => (
              <RequestCard key={r.id} r={r} decision={decided[r.id]} onDecide={(d) => setDecided({ ...decided, [r.id]: d })} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function RequestCard({ r, decision, onDecide }) {
  return (
    <div className="border border-rule rounded-2xl bg-paper-raised p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center font-semibold">
            {r.name[0]}
          </div>
          <div>
            <p className="font-semibold flex items-center gap-1.5">
              {r.name} <CheckBadge size={15} />
            </p>
            <p className="text-sm text-ink-soft">{r.email}</p>
            <div className="flex items-center gap-3 mt-1 text-sm text-ink-soft">
              <span className="flex items-center gap-1">
                <SeatGlyph color="var(--color-ink-soft)" /> {r.seats}
              </span>
              <span className="flex items-center gap-1">
                <DistanceGlyph color="var(--color-ink-soft)" /> {r.distanceKm} km
              </span>
            </div>
          </div>
        </div>
        <span className="rounded-full px-3 py-1 font-semibold" style={{ background: 'var(--color-transit-green-soft)', color: 'var(--color-transit-green)' }}>
          ₹{r.fare}
        </span>
      </div>

      <div className="mt-3 border border-rule rounded-xl p-3 space-y-1.5 bg-paper">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-transit-green inline-block" />
          <span className="text-sm">{r.from}</span>
        </div>
        <div className="w-px h-2.5 bg-rule ml-[3px]" />
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-transit-coral inline-block" />
          <span className="text-sm">{r.to}</span>
        </div>
      </div>

      {decision ? (
        <p
          className={`mt-3 text-center font-semibold py-2.5 rounded-full ${
            decision === 'accepted' ? 'text-transit-green bg-transit-green-soft' : 'text-transit-coral bg-transit-coral-soft'
          }`}
        >
          {decision === 'accepted' ? 'Accepted' : 'Declined'}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={() => onDecide('declined')}
            className="rounded-full border border-transit-coral text-transit-coral font-semibold py-2.5"
          >
            Decline
          </button>
          <button onClick={() => onDecide('accepted')} className="rounded-full bg-ink text-paper font-semibold py-2.5">
            Accept
          </button>
        </div>
      )}
    </div>
  );
}
