import { BrandHeader } from '../components/AppHeader';
import { me, homeStats, upcomingRide } from '../mock/data';
import { CarGlyph, SearchGlyph, ShieldGlyph, ChevronRight } from '../icons';

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

        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-[15px]">Upcoming Ride</p>
            <button onClick={() => navigate('activity')} className="text-sm" style={{ color: '#2F7DD9' }}>
              View All
            </button>
          </div>
          <button
            onClick={() => navigate('live')}
            className="w-full border border-rule rounded-2xl p-4 flex items-center gap-3 text-left bg-paper-raised"
          >
            <div className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center shrink-0">📅</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink-soft">{upcomingRide.time}</p>
              <p className="font-medium text-[15px] mt-0.5 truncate">
                {upcomingRide.from} → {upcomingRide.to}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs px-2 py-0.5 rounded-full bg-transit-green-soft text-transit-green">
                  {upcomingRide.role}
                </span>
                <span className="text-xs text-ink-soft">
                  {upcomingRide.seatsFilled}/{upcomingRide.seatsTotal} seats
                </span>
              </div>
            </div>
            <ChevronRight color="var(--color-ink-soft)" />
          </button>
        </section>
      </div>
    </div>
  );
}
