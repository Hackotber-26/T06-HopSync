import { BrandHeader } from '../components/AppHeader';
import { me, homeStats } from '../mock/data';
import { CarGlyph, SearchGlyph, ShieldGlyph } from '../icons';

export default function Home({ navigate }) {
  return (
    <div>
      <BrandHeader />
      <div className="px-5 py-5 space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold">Hello, {me.name}! 👋</h1>
          <p className="text-ink-soft mt-0.5">Let's make your commute better together.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('offerRide')}
            className="bg-ink text-paper rounded-2xl p-4 text-left flex flex-col gap-6"
          >
            <CarGlyph size={24} />
            <span>
              <span className="block font-semibold text-[15px]">Offer a Ride</span>
              <span className="block text-paper/60 text-sm mt-0.5">Share your journey</span>
            </span>
          </button>
          <button
            onClick={() => navigate('findRide')}
            className="bg-paper-raised border border-rule rounded-2xl p-4 text-left flex flex-col gap-6"
          >
            <SearchGlyph size={24} />
            <span>
              <span className="block font-semibold text-[15px]">Find a Ride</span>
              <span className="block text-ink-soft text-sm mt-0.5">Get where you're headed</span>
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4" style={{ background: 'var(--color-transit-green-soft)' }}>
            <span className="inline-flex w-8 h-8 rounded-full items-center justify-center bg-white/70 text-transit-green mb-3">
              ↓
            </span>
            <p className="text-transit-green font-semibold text-sm">Total Earnings</p>
            <p className="font-display text-xl font-bold mt-0.5">₹{homeStats.totalEarnings}</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: 'var(--color-transit-coral-soft)' }}>
            <span className="inline-flex w-8 h-8 rounded-full items-center justify-center bg-white/70 text-transit-coral mb-3">
              ↑
            </span>
            <p className="text-transit-coral font-semibold text-sm">Total Spending</p>
            <p className="font-display text-xl font-bold mt-0.5">₹{homeStats.totalSpending}</p>
          </div>
        </div>

        <div className="rounded-2xl p-4 flex gap-3" style={{ background: '#E7F1FC' }}>
          <ShieldGlyph />
          <div>
            <p className="font-semibold" style={{ color: '#2F7DD9' }}>
              Safety First
            </p>
            <p className="text-sm text-ink mt-0.5 leading-snug">
              Always verify your co-passenger's details and share your ride details with your family or friends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
