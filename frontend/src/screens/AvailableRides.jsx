import { useState } from 'react';
import { NavHeader } from '../components/AppHeader';
import { availableRides } from '../mock/data';
import { PinGreen, FlagRed, GridGlyph, CarGlyph, BikeGlyph, FilterGlyph, ClockGlyph, SeatGlyph, DistanceGlyph, CheckBadge } from '../icons';

const FILTERS = [
  { id: 'any', label: 'Any', icon: GridGlyph },
  { id: 'Sedan', label: 'Sedan', icon: CarGlyph },
  { id: 'Bike', label: 'Bike', icon: BikeGlyph },
];

export default function AvailableRides({ navigate }) {
  const [filter, setFilter] = useState('any');
  const rides = availableRides.filter((r) => filter === 'any' || r.vehicle === filter);

  return (
    <div>
      <NavHeader title="Find a Ride" onBack={() => navigate('findRide')} />
      <div className="px-5 py-5 space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold">Available Rides</h1>
          <p className="text-ink-soft mt-0.5">Choose a ride that fits your journey</p>
        </div>

        <div className="border border-rule rounded-2xl bg-paper-raised px-4 py-3.5 space-y-2">
          <div className="flex items-center gap-3">
            <PinGreen />
            <span className="text-[15px]">Baiyappanahalli Metro</span>
          </div>
          <div className="w-px h-3 bg-rule ml-[9px]" />
          <div className="flex items-center gap-3">
            <FlagRed />
            <span className="text-[15px]">Nearby tech parks</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium ${
                filter === f.id ? 'bg-ink text-paper' : 'bg-paper-raised border border-rule'
              }`}
            >
              <f.icon size={16} color={filter === f.id ? '#fff' : 'currentColor'} />
              {f.label}
            </button>
          ))}
          <button className="shrink-0 rounded-full border border-rule px-3.5 py-2.5">
            <FilterGlyph />
          </button>
        </div>

        <div className="space-y-4">
          {rides.map((r) => (
            <RideCard key={r.id} ride={r} onBook={() => navigate('live', { role: 'rider' })} />
          ))}
          {rides.length === 0 && <p className="text-center text-ink-soft py-8">No {filter} rides nearby right now.</p>}
        </div>
      </div>
    </div>
  );
}

function RideCard({ ride, onBook }) {
  return (
    <div className="border border-rule rounded-2xl bg-paper-raised p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center font-semibold">
            {ride.driver[0]}
          </div>
          <div>
            <p className="font-semibold flex items-center gap-1.5">
              {ride.driver} <CheckBadge size={15} />
            </p>
            <p className="text-sm text-ink-soft">
              {ride.vehicle} · {ride.mode}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display font-bold text-xl">₹{ride.price}</p>
          <p className="text-xs text-ink-soft">Per Seat</p>
        </div>
      </div>

      <div className="border-t border-rule my-3" />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-sm text-ink-soft flex items-center gap-1.5">
            <ClockGlyph size={15} color="var(--color-ink-soft)" /> Departs at {ride.departs}
          </p>
          <p className="text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-transit-green inline-block" /> {ride.from}
          </p>
          <p className="text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-transit-coral inline-block" /> {ride.to}
          </p>
        </div>
        <div className="text-right shrink-0 space-y-2">
          <p className="text-sm text-ink-soft flex items-center gap-1.5 justify-end">
            <SeatGlyph color="var(--color-ink-soft)" /> {ride.seatsLeft} seats left
          </p>
          <p className="text-sm text-ink-soft flex items-center gap-1.5 justify-end">
            <DistanceGlyph color="var(--color-ink-soft)" /> {ride.distanceKm} km
          </p>
          <button onClick={onBook} className="rounded-full bg-ink text-paper font-semibold px-6 py-2.5">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
