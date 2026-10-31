import { BrandHeader } from '../components/AppHeader';
import { historyRides } from '../mock/data';
import { ClockGlyph, DistanceGlyph, PeopleGlyph, PersonGlyph, CircleCheck } from '../icons';

export default function History() {
  return (
    <div>
      <BrandHeader />
      <div className="px-5 py-5 space-y-5">
        <div>
          <h1 className="font-display text-2xl font-bold">Ride History</h1>
          <p className="text-ink-soft mt-0.5">Your recent rides and earnings</p>
        </div>

        <div className="space-y-4">
          {historyRides.map((h) => (
            <div key={h.id} className="border border-rule rounded-2xl bg-paper-raised p-4">
              <div className="flex items-start justify-between">
                <span
                  className="rounded-full px-3 py-1 text-sm font-semibold"
                  style={{ background: '#E7F1FC', color: '#2F7DD9' }}
                >
                  {h.role}
                </span>
                <span className="font-display font-bold text-xl text-transit-green">₹{h.amount}</span>
              </div>

              <div className="flex items-start justify-between mt-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-transit-green inline-block" />
                    <span className="font-medium text-[15px]">{h.from}</span>
                  </div>
                  <div className="w-px h-3 bg-rule ml-[5px]" />
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-transit-coral inline-block" />
                    <span className="font-medium text-[15px]">{h.to}</span>
                  </div>
                </div>
                <div className="text-right text-sm text-ink-soft shrink-0">
                  <p>{h.date}</p>
                  <p className="mt-1">{h.time}</p>
                </div>
              </div>

              <div className="border-t border-rule my-3" />

              <div className="grid grid-cols-3 text-center divide-x divide-rule">
                <Stat icon={<ClockGlyph size={15} color="var(--color-ink-soft)" />} label="Duration" value={h.duration} />
                <Stat icon={<DistanceGlyph size={15} color="var(--color-ink-soft)" />} label="Distance" value={`${h.distanceKm} km`} />
                <Stat icon={<PeopleGlyph size={15} color="var(--color-ink-soft)" />} label="Passengers" value={h.passengers} />
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-medium">
                  <PersonGlyph size={15} /> View Passengers
                </span>
                <span className="flex items-center gap-1.5 text-transit-green font-semibold text-sm">
                  <CircleCheck /> Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="px-1">
      <p className="flex items-center justify-center gap-1.5 text-xs text-ink-soft">
        {icon} {label}
      </p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}
