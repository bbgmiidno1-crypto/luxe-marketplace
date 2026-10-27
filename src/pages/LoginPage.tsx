import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  async function sendOtp() {
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
    setBusy(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: { shouldCreateUser: true },
      });

      if (error) throw error;

      setPhone(formattedPhone);
      setOtpSent(true);
      setCooldown(30);
      setMessage('OTP request submitted. Check your SMS messages.');
      let remaining = 30;
      const timer = window.setInterval(() => {
        remaining -= 1;
        setCooldown(remaining);
        if (remaining <= 0) window.clearInterval(timer);
      }, 1000);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not send OTP. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    setMessage('');

    if (!supabase) {
      setMessage('Authentication is not configured. Please try again later.');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage('Enter the 6-digit OTP received by SMS.');
      return;
    }

    setBusy(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;
      setMessage('Mobile number verified. You are now logged in.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'OTP verification failed. Please try again.',
      );
    } finally {
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
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setMessage('');
              }}
              className="block w-full text-ivory-400 hover:text-gold-400"
            >
              Change mobile number
            </button>
          </div>
        )}

        {message && (
          <p role="status" aria-live="polite" className="mt-5 break-words text-sm text-gold-300">
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
