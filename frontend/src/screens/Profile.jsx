import { useState } from 'react';
import { BrandHeader } from '../components/AppHeader';
import { me } from '../mock/data';
import { MoonGlyph, CheckBadge, PersonGlyph, CakeGlyph, MailGlyph, LockGlyph, PencilGlyph, LogoutGlyph } from '../icons';

export default function Profile({ onLogout }) {
  const [dark, setDark] = useState(false);
  const [fields, setFields] = useState({ name: me.name, age: String(me.age), email: me.email, password: '••••••••' });
  const [editing, setEditing] = useState(null);

  function save(key, value) {
    setFields({ ...fields, [key]: value });
    setEditing(null);
  }

  return (
    <div>
      <div className="relative">
        <BrandHeader />
        <button
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle dark mode"
          className="absolute right-5 top-1/2 -translate-y-1/2"
        >
          <MoonGlyph color={dark ? 'var(--color-signal)' : '#fff'} />
        </button>
      </div>

      <div className="px-5 py-6 space-y-7">
        <h1 className="font-display text-2xl font-bold">My Profile</h1>

        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-ink text-paper flex items-center justify-center text-3xl font-bold">
              {me.initial}
            </div>
            {me.verified && (
              <span className="absolute bottom-0 right-0">
                <CheckBadge size={24} />
              </span>
            )}
          </div>
          <p className="font-display text-xl font-bold mt-3">{fields.name}</p>
          {me.verified && <p className="text-transit-green font-medium mt-0.5">Verified</p>}
        </div>

        <div className="space-y-5">
          <ProfileField
            icon={<PersonGlyph color="var(--color-ink-soft)" />}
            label="Name"
            value={fields.name}
            editing={editing === 'name'}
            onEdit={() => setEditing('name')}
            onSave={(v) => save('name', v)}
          />
          <ProfileField
            icon={<CakeGlyph color="var(--color-ink-soft)" />}
            label="Age"
            value={fields.age}
            editing={editing === 'age'}
            onEdit={() => setEditing('age')}
            onSave={(v) => save('age', v)}
            inputMode="numeric"
          />
          <ProfileField
            icon={<MailGlyph color="var(--color-ink-soft)" />}
            label="Email"
            value={fields.email}
            editing={editing === 'email'}
            onEdit={() => setEditing('email')}
            onSave={(v) => save('email', v)}
          />
          <ProfileField
            icon={<LockGlyph color="var(--color-ink-soft)" />}
            label="Password"
            value={fields.password}
            editing={editing === 'password'}
            onEdit={() => setEditing('password')}
            onSave={(v) => save('password', v)}
            mask
          />
        </div>

        <button
          onClick={onLogout}
          className="w-full rounded-full border border-transit-coral text-transit-coral font-semibold py-3.5 flex items-center justify-center gap-2"
        >
          <LogoutGlyph /> Logout
        </button>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value, editing, onEdit, onSave, inputMode, mask }) {
  const [draft, setDraft] = useState(value);
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink-soft">{label}</p>
        {editing ? (
          <input
            autoFocus
            value={draft}
            inputMode={inputMode}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => onSave(draft)}
            onKeyDown={(e) => e.key === 'Enter' && onSave(draft)}
            className="font-semibold text-[15px] bg-transparent border-b border-ink outline-none w-full"
          />
        ) : (
          <p className="font-semibold text-[15px] truncate">{mask ? '••••••••' : value}</p>
        )}
      </div>
      <button onClick={() => (editing ? onSave(draft) : onEdit())} aria-label={`Edit ${label}`}>
        <PencilGlyph color="var(--color-ink-soft)" />
      </button>
    </div>
  );
}
