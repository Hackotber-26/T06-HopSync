import { PinGreen, FlagRed, MapGlyph, SwapGlyph } from '../icons';

// Shared pickup/destination block for Find a Ride and Offer a Ride. Tapping
// a row (or its map icon) opens the map picker for that field.
export default function LocationFields({ pickup, destination, onPick, onSwap }) {
  return (
    <div className="relative border border-rule rounded-2xl bg-paper-raised">
      <Row icon={<PinGreen />} placeholder="Your Pickup Location" value={pickup} onClick={() => onPick('pickup')} />
      <div className="border-t border-rule" />
      <Row icon={<FlagRed />} placeholder="Your Destination" value={destination} onClick={() => onPick('destination')} />
      <button
        aria-label="Swap locations"
        onClick={onSwap}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-paper-raised border border-rule rounded-full w-9 h-9 flex items-center justify-center"
      >
        <SwapGlyph />
      </button>
    </div>
  );
}

function Row({ icon, placeholder, value, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
      {icon}
      <span className={`flex-1 text-[15px] truncate ${value ? 'text-ink' : 'text-ink-soft'}`}>{value || placeholder}</span>
      <MapGlyph color="var(--color-ink-soft)" />
    </button>
  );
}
