import { useState } from 'react';
import { CalendarGlyph, ClockGlyph } from '../icons';

// "Now" skips date/time entirely — most last-mile rides are walk-up, not
// booked ahead. "Later" reveals the pickers for anyone scheduling a return.
export default function ScheduleField() {
  const [when, setWhen] = useState('now');

  return (
    <section>
      <p className="font-semibold mb-3">Schedule</p>
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-paper-raised border border-rule mb-3">
        {['now', 'later'].map((id) => (
          <button
            key={id}
            onClick={() => setWhen(id)}
            className={`rounded-lg py-2.5 text-sm font-semibold capitalize ${
              when === id ? 'bg-ink text-paper' : 'text-ink-soft'
            }`}
          >
            {id}
          </button>
        ))}
      </div>

      {when === 'now' ? (
        <p className="text-sm text-ink-soft">Leaving right away — we'll match you with riders here now.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="field flex items-center gap-2 text-ink-soft">
            <CalendarGlyph color="var(--color-ink-soft)" />
            dd/mm/yyyy
          </div>
          <div className="field flex items-center gap-2 text-ink-soft">
            <ClockGlyph color="var(--color-ink-soft)" />
            --:--
          </div>
        </div>
      )}
    </section>
  );
}
