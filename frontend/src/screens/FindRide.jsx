import { useState } from 'react';
import { NavHeader } from '../components/AppHeader';
import ScheduleField from '../components/ScheduleField';
import { PinGreen, FlagRed, MapGlyph, SwapGlyph } from '../icons';

const SEAT_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function FindRide({ navigate }) {
  const [radius, setRadius] = useState(1.0);
  const [seats, setSeats] = useState(1);

  return (
    <div>
      <NavHeader title="Find a Ride" onBack={() => navigate('home')} />
      <div className="px-5 py-5 space-y-6">
        <div className="relative border border-rule rounded-2xl bg-paper-raised">
          <LocationRow icon={<PinGreen />} placeholder="Your Pickup Location" />
          <div className="border-t border-rule" />
          <LocationRow icon={<FlagRed />} placeholder="Your Destination" />
          <button
            aria-label="Swap locations"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper-raised border border-rule rounded-full w-9 h-9 flex items-center justify-center"
          >
            <SwapGlyph />
          </button>
        </div>

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

function LocationRow({ icon, placeholder }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      {icon}
      <input className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink-soft" placeholder={placeholder} />
      <MapGlyph color="var(--color-ink-soft)" />
    </div>
  );
}
