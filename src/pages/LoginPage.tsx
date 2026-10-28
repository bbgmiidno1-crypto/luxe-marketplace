import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const REQUEST_TIMEOUT_MS = 20_000;

function withTimeout<T>(request: Promise<T>): Promise<T> {
return new Promise<T>((resolve, reject) => {
const timer = window.setTimeout(() => {
reject(
new Error(
'Request timed out. Please try again. If this continues, check the SMS provider settings.',
),
);
}, REQUEST_TIMEOUT_MS);

request.then(resolve, reject).finally(() => {
  window.clearTimeout(timer);
});

});
}

function getErrorMessage(error: unknown): string {
if (error instanceof Error) {
if (/timed out/i.test(error.message)) return error.message;
if (/429|rate limit|too many requests/i.test(error.message)) {
return 'Too many attempts. Please wait a few minutes before trying again.';
}
if (/invalid.*phone|phone.*invalid/i.test(error.message)) {
return 'Please check your mobile number and try again.';
}
}

return 'The request failed. Please try again. If the problem continues, check Supabase Auth Logs.';
}

export default function LoginPage() {
const [phone, setPhone] = useState('');
const [otp, setOtp] = useState('');
const [otpSent, setOtpSent] = useState(false);
const [busy, setBusy] = useState(false);
const [message, setMessage] = useState('');
const [cooldown, setCooldown] = useState(0);
const requestInProgress = useRef(false);

useEffect(() => {
if (cooldown <= 0) return;

const timer = window.setTimeout(() => {
  setCooldown((current) => Math.max(0, current - 1));
}, 1000);

return () => window.clearTimeout(timer);

}, [cooldown]);

async function sendOtp() {
if (requestInProgress.current || busy) return;

setMessage('');

if (!supabase) {
  setMessage('Authentication is not configured. Please try again later.');
  return;
}

const digits = phone.replace(/\D/g, '').replace(/^91/, '');

if (!/^[6-9]\d{9}$/.test(digits)) {
  setMessage('Please enter a valid 10-digit Indian mobile number.');
  return;
}

const formattedPhone = `+91${digits}`;
requestInProgress.current = true;
setBusy(true);

try {
  const { error } = await withTimeout(
    supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: { shouldCreateUser: true },
    }),
  );

  if (error) throw error;

  setPhone(formattedPhone);
  setOtp('');
  setOtpSent(true);
  setCooldown(30);
  setMessage('OTP request submitted. Check your SMS messages.');
} catch (error) {
  setMessage(getErrorMessage(error));
} finally {
  requestInProgress.current = false;
  setBusy(false);
}

}

async function verifyOtp() {
if (requestInProgress.current || busy) return;

setMessage('');

if (!supabase) {
  setMessage('Authentication is not configured. Please try again later.');
  return;
}

if (!/^\d{6}$/.test(otp)) {
  setMessage('Enter the 6-digit OTP received by SMS.');
  return;
}

requestInProgress.current = true;
setBusy(true);

try {
  const { error } = await withTimeout(
    supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    }),
  );

  if (error) throw error;

  setMessage('Mobile number verified. You are now logged in.');
} catch (error) {
  setMessage(getErrorMessage(error));
} finally {
  requestInProgress.current = false;
  setBusy(false);
}

}

return (
<section className="mx-auto w-full max-w-md flex-1 px-4 py-12 sm:py-16">
<div className="rounded-2xl border border-gold-500/30 bg-onyx-900 p-6 shadow-xl sm:p-8">
<p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
Luxe Marketplace
</p>

    <h1 className="mt-4 text-center font-display text-3xl text-gold-400">
      {otpSent ? 'Verify OTP' : 'Login / Sign Up'}
    </h1>

    <p className="mt-3 text-center text-sm text-ivory-400">
      {otpSent
        ? `Enter the verification code sent to ${phone}.`
        : 'Continue securely with your Indian mobile number.'}
    </p>

    <form
      className="mt-7 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (otpSent) {
          void verifyOtp();
        } else {
          void sendOtp();
        }
      }}
    >
      {!otpSent ? (
        <label className="block text-sm text-ivory-300">
          Mobile Number
          <div className="mt-2 flex rounded-lg border border-gold-500/30 bg-onyx-950 focus-within:border-gold-400">
            <span className="flex items-center border-r border-gold-500/20 px-3 text-gold-400">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              required
              value={phone.replace(/^\+91/, '')}
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, '').slice(-10))
              }
              placeholder="10-digit mobile number"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-ivory-100 outline-none"
            />
          </div>
        </label>
      ) : (
        <label className="block text-sm text-ivory-300">
          6-digit OTP
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder="Enter OTP"
            className="mt-2 w-full rounded-lg border border-gold-500/30 bg-onyx-950 px-4 py-3 text-ivory-100 outline-none focus:border-gold-400"
          />
        </label>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-gold-400 px-4 py-3 font-bold text-onyx-950 transition hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy
          ? 'Please wait...'
          : otpSent
            ? 'Verify & Login'
            : 'Send OTP'}
      </button>
    </form>

    {otpSent && (
      <div className="mt-4 space-y-3 text-center text-sm">
        <button
          type="button"
          disabled={busy || cooldown > 0}
          onClick={() => void sendOtp()}
          className="font-semibold text-gold-400 underline underline-offset-4 disabled:opacity-50"
        >
          {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (requestInProgress.current) return;
            setOtpSent(false);
            setOtp('');
            setMessage('');
          }}
          className="block w-full text-ivory-400 hover:text-gold-400 disabled:opacity-50"
        >
          Change mobile number
        </button>
      </div>
    )}

    {message && (
      <p
        role="status"
        aria-live="polite"
        className="mt-5 break-words text-sm text-gold-300"
      >
        {message}
      </p>
    )}

    <Link
      to="/"
      className="mt-7 block text-center text-sm text-ivory-400 transition hover:text-gold-400"
    >
      ← Back to Home
    </Link>
  </div>
</section>

);
}
