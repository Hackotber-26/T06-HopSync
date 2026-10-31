import { BackArrow, CarLogo } from '../icons';

// Root-tab screens (Home, Rides, History, Account) get the brand mark.
export function BrandHeader() {
  return (
    <header className="bg-ink text-paper px-5 pt-[calc(env(safe-area-inset-top)+1.1rem)] pb-4 flex items-center gap-2">
      <span className="font-display text-2xl font-extrabold tracking-tight">Ridify</span>
      <CarLogo />
    </header>
  );
}

// Pushed screens (Find a Ride, Offer a Ride, Live Ride Map…) get a back
// arrow and title instead.
export function NavHeader({ title, onBack, right }) {
  return (
    <header className="bg-ink text-paper px-5 pt-[calc(env(safe-area-inset-top)+1.1rem)] pb-4 flex items-center gap-4">
      <button onClick={onBack} aria-label="Back" className="shrink-0">
        <BackArrow color="#fff" />
      </button>
      <h1 className="font-display text-xl font-semibold tracking-tight flex-1 truncate">{title}</h1>
      {right}
    </header>
  );
}
