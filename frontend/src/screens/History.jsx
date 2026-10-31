import { useState } from 'react';
import { BrandHeader } from '../components/AppHeader';
import { historyRides } from '../mock/data';
import { ClockGlyph, DistanceGlyph, PeopleGlyph, PersonGlyph, CircleCheck, CloseX, CheckBadge, SeatGlyph } from '../icons';

export default function History() {
  const [selectedRide, setSelectedRide] = useState(null);

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
                <button
                  type="button"
                  onClick={() => setSelectedRide(h)}
                  className="flex items-center gap-2 rounded-full bg-black/5 hover:bg-black/10 active:scale-95 transition-all px-4 py-2 text-sm font-medium cursor-pointer"
                >
                  <PersonGlyph size={15} /> View Passengers
                </button>
                <span className="flex items-center gap-1.5 text-transit-green font-semibold text-sm">
                  <CircleCheck /> Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Passengers Modal / Bottom Sheet */}
      {selectedRide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 transition-opacity animate-in fade-in duration-200"
          onClick={() => setSelectedRide(null)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] flex flex-col bg-paper rounded-t-3xl sm:rounded-3xl border border-rule shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-rule flex items-center justify-between bg-paper-raised">
              <div>
                <h3 className="font-display font-bold text-lg text-ink">Passengers</h3>
                <p className="text-xs text-ink-soft">
                  {selectedRide.date} · {selectedRide.from} → {selectedRide.to}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRide(null)}
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                aria-label="Close modal"
              >
                <CloseX size={18} color="var(--color-ink-soft)" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {(!selectedRide.passengersList || selectedRide.passengersList.length === 0) ? (
                <div className="py-8 text-center text-ink-soft">
                  <PeopleGlyph size={32} color="var(--color-ink-soft)" />
                  <p className="mt-2 text-sm">No passenger details available for this ride.</p>
                </div>
              ) : (
                selectedRide.passengersList.map((p) => (
                  <div
                    key={p.id}
                    className="border border-rule rounded-2xl bg-paper-raised p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-ink text-paper flex items-center justify-center font-bold text-base">
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-[15px] flex items-center gap-1.5 text-ink">
                            {p.name}
                            {p.verified && <CheckBadge size={15} />}
                          </p>
                          <p className="text-xs text-ink-soft">{p.email}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-ink-soft">
                            <span className="flex items-center gap-1">
                              <SeatGlyph size={14} color="var(--color-ink-soft)" /> {p.seats} seat{p.seats > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className="rounded-full px-3 py-1 font-semibold text-sm"
                        style={{ background: 'var(--color-transit-green-soft)', color: 'var(--color-transit-green)' }}
                      >
                        ₹{p.fare}
                      </span>
                    </div>

                    <div className="border border-rule rounded-xl p-3 space-y-1.5 bg-paper">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-transit-green shrink-0" />
                        <span className="text-xs font-medium text-ink truncate">
                          {p.pickup}
                        </span>
                      </div>
                      <div className="w-px h-2.5 bg-rule ml-[3px]" />
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-transit-coral shrink-0" />
                        <span className="text-xs font-medium text-ink truncate">
                          {p.drop}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-rule bg-paper-raised">
              <button
                type="button"
                onClick={() => setSelectedRide(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-ink text-paper font-semibold text-sm hover:opacity-90 active:scale-98 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
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
