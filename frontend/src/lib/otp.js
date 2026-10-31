import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const VALID_MS = 15 * 60 * 1000;

// Demo-only: the code lives in memory on the client. A real deployment
// would generate and check this on the backend instead.
let pending = null;

export async function sendOtp(email) {
  const passcode = String(Math.floor(100000 + Math.random() * 900000));
  const time = new Date(Date.now() + VALID_MS).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, { email, passcode, time }, { publicKey: PUBLIC_KEY });
  pending = { email, passcode, expiresAt: Date.now() + VALID_MS };
}

export function verifyOtp(email, code) {
  if (!pending) return 'Request an OTP first.';
  if (pending.email !== email) return 'Send a new OTP for this email.';
  if (Date.now() > pending.expiresAt) return 'OTP expired — send a new one.';
  return pending.passcode === code ? undefined : 'Incorrect OTP.';
}
