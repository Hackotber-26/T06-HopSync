import { useState } from 'react';
import { CarLogo, PersonGlyph, CakeGlyph, MailGlyph, LockGlyph, EyeGlyph, EyeOffGlyph, ShieldOutline, UploadGlyph } from '../icons';
import AuthField from '../components/AuthField';
import { sendOtp, verifyOtp } from '../lib/otp';
import { uploadVerification } from '../lib/adminApi';

export default function Signup({ navigate }) {
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStatus, setOtpStatus] = useState('');
  const [idFile, setIdFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(''); // '', 'uploading', 'done', 'error'
  const [error, setError] = useState('');

  function handlePickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdFile(file);
    setUploadStatus('');
  }

  async function handleSendOtp() {
    if (!email) return setError('Enter your email first.');
    setError('');
    setOtpStatus('sending');
    try {
      await sendOtp(email);
      setOtpStatus('sent');
    } catch {
      setOtpStatus('error');
    }
  }

  async function handleSubmit() {
    if (otp) {
      const err = verifyOtp(email, otp);
      if (err) return setError(err);
    }
    if (idFile) {
      setError('');
      setUploadStatus('uploading');
      try {
        await uploadVerification({ name, email, file: idFile });
        setUploadStatus('done');
      } catch {
        setUploadStatus('error');
        return setError("Couldn't upload your ID. Check the Apps Script setup, or try again.");
      }
    }
    navigate('home');
  }

  return (
    <div className="min-h-dvh bg-paper flex flex-col justify-center px-6 py-10">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-2xl bg-ink flex items-center justify-center mb-4">
          <CarLogo />
        </div>
        <h1 className="font-display text-4xl font-extrabold">Ridify</h1>
      </div>

      <div className="space-y-4">
        <AuthField
          icon={<PersonGlyph size={20} color="#9CA3AF" />}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AuthField icon={<CakeGlyph size={20} color="#9CA3AF" />} placeholder="Age" inputMode="numeric" />
        <AuthField
          icon={<MailGlyph size={20} color="#9CA3AF" />}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <AuthField
          icon={<ShieldOutline size={20} color="#9CA3AF" />}
          placeholder="OTP"
          inputMode="numeric"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          right={
            <button onClick={handleSendOtp} className="text-sm font-semibold text-ink-soft shrink-0" disabled={otpStatus === 'sending'}>
              {otpStatus === 'sending' ? 'Sending…' : otpStatus === 'sent' ? 'Resend OTP' : 'Send OTP'}
            </button>
          }
        />
        {otpStatus === 'sent' && <p className="text-sm text-transit-green -mt-2">OTP sent to {email}.</p>}
        {otpStatus === 'error' && <p className="text-sm text-transit-coral -mt-2">Couldn't send OTP. Check EmailJS setup.</p>}

        <label className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 cursor-pointer">
          <UploadGlyph size={20} color="#9CA3AF" />
          <span className="flex-1 text-[16px] text-gray-400 truncate">
            {idFile ? idFile.name : 'Upload ID for verification (optional)'}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handlePickFile} />
        </label>
        {uploadStatus === 'uploading' && <p className="text-sm text-ink-soft -mt-2">Uploading ID…</p>}
        {uploadStatus === 'done' && <p className="text-sm text-transit-green -mt-2">ID uploaded — pending admin review.</p>}

        {error && <p className="text-sm text-transit-coral -mt-2">{error}</p>}

        <button onClick={handleSubmit} className="w-full rounded-full bg-ink text-paper font-semibold text-lg py-4 mt-2">
          Create Account
        </button>

        <p className="text-center text-ink-soft mt-2">
          Already have an account?{' '}
          <button onClick={() => navigate('login')} className="font-bold text-ink">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
