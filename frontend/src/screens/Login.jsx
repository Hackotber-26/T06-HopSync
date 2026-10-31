import { useState } from 'react';
import { CarLogo, MailGlyph, LockGlyph, EyeGlyph, EyeOffGlyph, ShieldOutline } from '../icons';
import AuthField from '../components/AuthField';

export default function Login({ navigate }) {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-dvh bg-paper flex flex-col justify-center px-6 py-10">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-2xl bg-ink flex items-center justify-center mb-4">
          <CarLogo />
        </div>
        <h1 className="font-display text-4xl font-extrabold">Ridify</h1>
      </div>

      <div className="space-y-4">
        <AuthField icon={<MailGlyph size={20} color="#9CA3AF" />} placeholder="Email" type="email" />
        <AuthField
          icon={<LockGlyph size={20} color="#9CA3AF" />}
          placeholder="Password"
          type={showPw ? 'text' : 'password'}
          right={
            <button onClick={() => setShowPw((s) => !s)} aria-label="Toggle password visibility">
              {showPw ? <EyeGlyph size={20} color="#9CA3AF" /> : <EyeOffGlyph size={20} color="#9CA3AF" />}
            </button>
          }
        />

        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-rule" />
          <span className="text-sm font-semibold text-ink-soft">OR</span>
          <div className="flex-1 h-px bg-rule" />
        </div>

        <AuthField
          icon={<ShieldOutline size={20} color="#9CA3AF" />}
          placeholder="OTP"
          inputMode="numeric"
          right={
            <button className="text-sm font-semibold text-ink-soft shrink-0">Send OTP</button>
          }
        />

        <button
          onClick={() => navigate('home')}
          className="w-full rounded-full bg-ink text-paper font-semibold text-lg py-4 mt-2"
        >
          Log In
        </button>

        <p className="text-center text-ink-soft mt-2">
          Don't have an account?{' '}
          <button onClick={() => navigate('signup')} className="font-bold text-ink">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
