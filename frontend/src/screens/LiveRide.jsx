import { NavHeader } from '../components/AppHeader';
import { liveRide, rideRequests } from '../mock/data';
import { LocateGlyph, CompassGlyph, ChatGlyph, CheckBadge } from '../icons';

// Same screen serves both sides of a ride: a rider booked from Available
// Rides sees the driver's card; a driver who started a trip from Ride
// Detail sees their accepted passenger's card instead.
export default function LiveRide({ navigate, role = 'rider' }) {
  const isDriver = role === 'driver';
  const counterpart = isDriver ? rideRequests[0].name : liveRide.driver;
  const status = isDriver ? 'Heading to pickup' : liveRide.status;

  return (
    <div className="flex flex-col h-full min-h-dvh">
      <NavHeader title="Live Ride Map" onBack={() => navigate('activity')} />

      <div className="relative flex-1 min-h-0">
        <MapBackdrop />

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <MapButton>
            <LocateGlyph />
          </MapButton>
          <MapButton>
            <CompassGlyph />
          </MapButton>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[85%]">
          <span className="bg-white rounded-lg px-2.5 py-1 text-xs font-semibold shadow whitespace-nowrap">
            {counterpart} {isDriver ? '(Passenger)' : '(Driver)'}
          </span>
        </div>
      </div>

      <div className="rounded-t-3xl bg-paper-raised px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.1rem)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="w-9 h-1 rounded-full bg-rule mx-auto mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-ink text-paper flex items-center justify-center font-semibold">
              {counterpart[0]}
            </div>
            <div>
              <p className="font-semibold flex items-center gap-1.5">
                {counterpart} <CheckBadge size={15} />
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm text-transit-green bg-transit-green-soft rounded-full px-2.5 py-0.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-transit-green inline-block" /> {status}
              </span>
            </div>
          </div>
          <button disabled className="rounded-full bg-black/5 text-ink-soft font-semibold px-5 py-2.5">
            Board
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => navigate('chat')}
            className="rounded-full border border-ink text-ink font-semibold py-3.5 flex items-center justify-center gap-2"
          >
            <ChatGlyph /> Chat
          </button>
          <button
            onClick={() => navigate(isDriver ? 'driverCompletion' : 'riderCompletion')}
            className="rounded-full bg-ink text-paper font-semibold py-3.5"
          >
            End Ride
          </button>
        </div>
      </div>
    </div>
  );
}

function MapButton({ children }) {
  return <button className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">{children}</button>;
}

// A stylized street grid stands in for a live map tile provider — no
// external map dependency for this hardcoded demo screen.
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
      <circle cx="200" cy="300" r="7" fill="var(--color-transit-green)" />
      <path d="M200 300 L200 420" stroke="var(--color-transit-green)" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
    </svg>
  );
}
