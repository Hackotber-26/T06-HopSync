import { BrandHeader } from '../components/AppHeader';
import { postedRide, ongoingRide } from '../mock/data';
import { CarGlyph, SuvGlyph, ChevronRight } from '../icons';

export default function Activity({ navigate }) {
  return (
    <div>
      <BrandHeader />
      <div className="px-5 py-5 space-y-6">
        <h1 className="font-display text-2xl font-bold">Activity</h1>

        <section>
          <p className="font-semibold mb-3">Your Posted Rides</p>
          <button
            onClick={() => navigate('rideDetail')}
            className="w-full border border-rule rounded-2xl bg-paper-raised p-4 text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <SuvGlyph />
                <div>
                  <p className="font-semibold">{postedRide.seatsTotal} Seats</p>
                  <p className="text-sm text-ink-soft">
                    {postedRide.date} · {postedRide.time}
                  </p>
                  <p className="text-sm text-ink-soft">{postedRide.mode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-transit-green-soft text-transit-green text-sm font-semibold flex items-center justify-center">
                  {postedRide.requestCount}
                </span>
                <ChevronRight color="var(--color-ink-soft)" />
              </div>
            </div>
            <Route from={postedRide.from} to={postedRide.to} />
          </button>
        </section>

        <section>
          <p className="font-semibold mb-3">Ongoing Rides</p>
          <button
            onClick={() => navigate('live')}
            className="w-full border border-rule rounded-2xl bg-paper-raised p-4 text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <CarGlyph />
                <div>
                  <p className="font-semibold">{ongoingRide.seatsTotal} Seat</p>
                  <p className="text-sm text-ink-soft">
                    {ongoingRide.date} · {ongoingRide.time}
                  </p>
                  <p className="text-sm text-ink-soft">{ongoingRide.mode}</p>
                </div>
              </div>
              <ChevronRight color="var(--color-ink-soft)" />
            </div>
            <Route from={ongoingRide.from} to={ongoingRide.to} />
          </button>
        </section>
      </div>
    </div>
  );
}

function Route({ from, to }) {
  return (
    <div className="mt-4 ml-1 space-y-1.5">
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-transit-green inline-block" />
        <span className="font-medium text-[15px]">{from}</span>
      </div>
      <div className="w-px h-3 bg-rule ml-[5px]" />
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-transit-coral inline-block" />
        <span className="font-medium text-[15px]">{to}</span>
      </div>
    </div>
  );
}
