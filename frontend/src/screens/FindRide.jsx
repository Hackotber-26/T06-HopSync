import { useState } from 'react';
import { NavHeader } from '../components/AppHeader';
import ScheduleField from '../components/ScheduleField';
import LocationFields from '../components/LocationFields';

const SEAT_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function FindRide({ navigate, locations, onPickLocation, onSwapLocations }) {
  const [radius, setRadius] = useState(1.0);
  const [seats, setSeats] = useState(1);

  return (
    <div>
      <NavHeader title="Find a Ride" onBack={() => navigate('home')} />
      <div className="px-5 py-5 space-y-6">
        <LocationFields
          pickup={locations.pickup}
          destination={locations.destination}
          onPick={(field) => onPickLocation(field, 'findRide')}
          onSwap={onSwapLocations}
        />

        <section>
          <p className="font-semibold mb-3">Search Radius</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-soft">100m</span>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="flex-1 accent-ink"
            />
            <span className="text-sm text-ink-soft">2km</span>
          </div>
          <p className="text-sm text-ink-soft mt-2">Searching within {radius.toFixed(1)} km of your radius</p>
        </section>

        <ScheduleField />

        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Seats Needed</p>
            <span className="text-sm text-ink-soft">Max: 6</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SEAT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setSeats(n)}
                className={`rounded-xl py-3.5 font-semibold text-lg ${
                  seats === n ? 'bg-ink text-paper' : 'bg-paper-raised border border-rule'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={() => navigate('availableRides')}
          className="w-full rounded-full bg-ink text-paper font-semibold py-4"
        >
          Search Rides
        </button>
      </div>
    </div>
  );
}
