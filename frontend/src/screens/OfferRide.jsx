import { useState } from 'react';
import { NavHeader } from '../components/AppHeader';
import ScheduleField from '../components/ScheduleField';
import { PinGreen, FlagRed, MapGlyph, SwapGlyph, BikeGlyph, CarGlyph, SuvGlyph } from '../icons';

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

export default function OfferRide({ navigate }) {
  const [flex, setFlex] = useState('nonstop');
  const [vehicle, setVehicle] = useState('Sedan');
  const [seats, setSeats] = useState(1);
  const [price, setPrice] = useState('');

  return (
    <div>
      <NavHeader title="Offer a Ride" onBack={() => navigate('home')} />
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

function LocationRow({ icon, placeholder }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      {icon}
      <input className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink-soft" placeholder={placeholder} />
      <MapGlyph color="var(--color-ink-soft)" />
    </div>
  );
}
