import { useState } from 'react';
import { NavHeader } from '../components/AppHeader';
import ScheduleField from '../components/ScheduleField';
import LocationFields from '../components/LocationFields';
import { BikeGlyph, CarGlyph, SuvGlyph } from '../icons';

const FLEX = [
  { id: 'nonstop', label: 'Nonstop', hint: 'Exact pickup and drop only' },
  { id: 'shared', label: 'Shared Start', hint: 'Same pickup, flexible drop' },
  { id: 'flexible', label: 'Flexible', hint: 'Pickup & drop anywhere' },
];
const VEHICLES = [
  { id: 'Bike', label: 'Bike', icon: BikeGlyph },
  { id: 'Sedan', label: 'Sedan', icon: CarGlyph },
  { id: 'SUV', label: 'SUV', icon: SuvGlyph },
];
const SEAT_OPTIONS = [1, 2, 3, 4];

export default function OfferRide({ navigate, locations, onPickLocation, onSwapLocations }) {
  const [flex, setFlex] = useState('nonstop');
  const [vehicle, setVehicle] = useState('Sedan');
  const [seats, setSeats] = useState(1);
  const [price, setPrice] = useState('');

  return (
    <div>
      <NavHeader title="Offer a Ride" onBack={() => navigate('home')} />
      <div className="px-5 py-5 space-y-6">
        <LocationFields
          pickup={locations.pickup}
          destination={locations.destination}
          onPick={(field) => onPickLocation(field, 'offerRide')}
          onSwap={onSwapLocations}
        />

        <section>
          <p className="font-semibold">Route Flexibility</p>
          <p className="text-sm text-ink-soft mb-3">Choose how flexible you want your route to be</p>
          <div className="grid grid-cols-3 gap-2">
            {FLEX.map((f) => (
              <button
                key={f.id}
                onClick={() => setFlex(f.id)}
                className={`rounded-xl p-3 text-center ${flex === f.id ? 'bg-ink text-paper' : 'bg-paper-raised border border-rule'}`}
              >
                <p className="font-semibold text-sm">{f.label}</p>
                <p className={`text-xs mt-1 leading-snug ${flex === f.id ? 'text-paper/60' : 'text-ink-soft'}`}>{f.hint}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="font-semibold mb-3">Vehicle Type</p>
          <div className="grid grid-cols-3 gap-2">
            {VEHICLES.map((v) => (
              <button
                key={v.id}
                onClick={() => setVehicle(v.id)}
                className={`rounded-xl py-4 flex flex-col items-center gap-2 ${
                  vehicle === v.id ? 'bg-ink text-paper' : 'bg-paper-raised border border-rule'
                }`}
              >
                <v.icon color={vehicle === v.id ? '#fff' : 'currentColor'} />
                <span className="font-semibold text-sm">{v.label}</span>
              </button>
            ))}
          </div>
        </section>

        <ScheduleField />

        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Seats Available</p>
            <span className="text-sm text-ink-soft">Max: 4</span>
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

        <section>
          <p className="font-semibold mb-3">Price</p>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            placeholder="Enter base price"
            className="field"
          />
        </section>

        <button onClick={() => navigate('activity')} className="w-full rounded-full bg-ink text-paper font-semibold py-4">
          Offer Ride
        </button>
      </div>
    </div>
  );
}
