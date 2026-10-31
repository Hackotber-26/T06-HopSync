import { CarLogo, MailGlyph, LockGlyph } from '../icons';
import AuthField from '../components/AuthField';

// No real auth here (same dummy pattern as Login/Signup) — it just gates
// entry into the admin area for the demo.
export default function AdminLogin({ navigate }) {
  return (
    <div className="min-h-dvh bg-paper flex flex-col justify-center px-6 py-10">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-2xl bg-ink flex items-center justify-center mb-4">
          <CarLogo />
        </div>
        <h1 className="font-display text-4xl font-extrabold">Ridify</h1>
        <p className="text-ink-soft mt-1">Admin console</p>
      </div>

      <div className="space-y-4">
        <AuthField icon={<MailGlyph size={20} color="#9CA3AF" />} placeholder="Admin email" type="email" />
        <AuthField icon={<LockGlyph size={20} color="#9CA3AF" />} placeholder="Password" type="password" />

        <button
          onClick={() => navigate('adminVerify')}
          className="w-full rounded-full bg-ink text-paper font-semibold text-lg py-4 mt-2"
        >
          Log In
        </button>

        <p className="text-center text-ink-soft mt-2">
          <button onClick={() => navigate('login')} className="font-bold text-ink">
            Back to app
          </button>
        </p>
      </div>
    </div>
  );
}
