import { useState } from 'react';
import { BackArrow, SearchGlyph, PinGreen, FlagRed, LocateGlyph } from '../icons';

const SUGGESTIONS = {
  pickup: ['Baiyappanahalli Metro · Gate A', 'MG Road Metro · Gate 1', 'Whitefield Metro · Gate A', 'Silk Board Metro · Gate 1'],
  destination: ['Bagmane Tech Park', 'ITPL Main Gate', 'HSR Layout Sector 1', 'Koramangala 5th Block'],
};

// A single pin-drop picker shared by the pickup and destination map icons —
// `field` says which one opened it, so the title and suggestions match.
export default function MapPicker({ field, onBack, onConfirm }) {
  const [query, setQuery] = useState('');
  const isPickup = field === 'pickup';

  return (
    <div className="flex flex-col h-full min-h-dvh">
      <header className="bg-ink text-paper px-5 pt-[calc(env(safe-area-inset-top)+1.1rem)] pb-4 flex items-center gap-4">
        <button onClick={onBack} aria-label="Back" className="shrink-0">
          <BackArrow color="#fff" />
        </button>
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Set {isPickup ? 'pickup' : 'destination'}
        </h1>
      </header>

      <div className="px-5 py-3 border-b border-rule bg-paper-raised">
        <div className="field flex items-center gap-2">
          <SearchGlyph size={18} color="var(--color-ink-soft)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isPickup ? 'Search pickup location' : 'Search destination'}
            className="flex-1 bg-transparent outline-none text-[15px]"
          />
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <MapBackdrop />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
          {isPickup ? <PinGreen size={34} /> : <FlagRed size={34} />}
        </div>
        <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
          <LocateGlyph />
        </button>
      </div>

      <div className="bg-paper-raised border-t border-rule px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.1rem)]">
        <p className="text-xs text-ink-soft mb-2">Suggested</p>
        <div className="space-y-1 mb-4">
          {SUGGESTIONS[field].map((label) => (
            <button
              key={label}
              onClick={() => onConfirm(label)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-paper"
            >
              {isPickup ? <PinGreen size={16} /> : <FlagRed size={16} />}
              <span className="text-[15px]">{label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => onConfirm(query.trim() || SUGGESTIONS[field][0])}
          className="w-full rounded-full bg-ink text-paper font-semibold py-3.5"
        >
          Confirm {isPickup ? 'pickup' : 'destination'}
        </button>
      </div>
    </div>
  );
}

function MapBackdrop() {
  return (
    <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="600" fill="#EDEAE0" />
      <rect x="40" y="0" width="90" height="600" fill="#E1DCCB" />
      <rect x="260" y="0" width="110" height="600" fill="#E1DCCB" />
      <rect x="0" y="120" width="400" height="60" fill="#E1DCCB" />
      <rect x="0" y="400" width="400" height="50" fill="#E1DCCB" />
      {[20, 150, 230, 380].map((x) => (
        <rect key={x} x={x} y="0" width="7" height="600" fill="#D8D3C4" />
      ))}
      {[60, 240, 470].map((y) => (
        <rect key={y} x="0" y={y} width="400" height="7" fill="#D8D3C4" />
      ))}
      <rect x="150" y="60" width="80" height="60" rx="4" fill="#DCEFE3" />
      <rect x="150" y="310" width="80" height="90" rx="4" fill="#DCEFE3" />
    </svg>
  );
}
