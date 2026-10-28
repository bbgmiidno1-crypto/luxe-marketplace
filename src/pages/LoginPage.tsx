import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
const navigate = useNavigate();
const [mode, setMode] = useState<'login' | 'signup'>('login');
const [phone, setPhone] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');
const [busy, setBusy] = useState(false);

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault();
setMessage('');

if (!supabase) {
  setMessage('Supabase connection is not configured yet.');
  return;
}

const digits = phone.replace(/\D/g, '');
if (!/^[6-9]\d{9}$/.test(digits)) {
  setMessage('Enter a valid 10-digit Indian mobile number.');
  return;
}

if (password.length < 8) {
  setMessage('Password must be at least 8 characters.');
  return;
}

setBusy(true);
const formattedPhone = `+91${digits}`;

try {
  if (mode === 'signup') {
    const { data, error } = await supabase.auth.signUp({
      phone: formattedPhone,
      password,
      options: {
        data: { phone_number: formattedPhone },
      },
    });

    if (error) throw error;

    if (!data.session) {
      setMessage('Supabase still requires phone confirmation. Phone confirmation must be disabled in Supabase settings for signup without OTP.');
      return;
    }

    setMessage('Account created successfully.');
    navigate('/');
  } else {
    const { error } = await supabase.auth.signInWithPassword({
      phone: formattedPhone,
      password,
    });

    if (error) throw error;

    navigate('/');
  }
} catch (error) {
  setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
} finally {
  setBusy(false);
}

}

return (
<section className="mx-auto w-full max-w-md flex-1 px-4 py-12">
<div className="rounded-2xl border border-gold-500/30 bg-onyx-900 p-6 sm:p-8">
<p className="text-center text-xs uppercase tracking-[0.3em] text-gold-400">
Luxe Marketplace
</p>
<h1 className="mt-4 text-center text-3xl text-gold-400">
{mode === 'login' ? 'Login' : 'Create Account'}
</h1>
<p className="mt-3 text-center text-sm text-ivory-400">
Mobile number and password. No OTP on this page.
</p>

    <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm text-ivory-300">
        Mobile Number
        <div className="mt-2 flex rounded-lg border border-gold-500/30 bg-onyx-950">
          <span className="border-r border-gold-500/20 px-3 py-3 text-gold-400">+91</span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(-10))}
            placeholder="10-digit mobile number"
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-ivory-100 outline-none"
          />
        </div>
      </label>

      <label className="block text-sm text-ivory-300">
        Password
        <input
          type="password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          className="mt-2 w-full rounded-lg border border-gold-500/30 bg-onyx-950 px-4 py-3 text-ivory-100 outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-gold-400 px-4 py-3 font-bold text-onyx-950 disabled:opacity-60"
      >
        {busy ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>

    <p className="mt-5 text-center text-sm text-ivory-400">
      {mode === 'login' ? "Don't have an account?" : 'Already registered?'}{' '}
      <button
        type="button"
        onClick={() => {
          setMode(mode === 'login' ? 'signup' : 'login');
          setMessage('');
        }}
        className="font-semibold text-gold-400 underline"
      >
        {mode === 'login' ? 'Sign Up' : 'Login'}
      </button>
    </p>

    {message && (
      <p role="status" className="mt-4 break-words text-sm text-gold-300">
        {message}
      </p>
    )}

    <p className="mt-4 text-xs text-ivory-500">
      Without OTP, the mobile number is not verified as belonging to you. Keep your password private.
    </p>

    <Link to="/" className="mt-6 block text-center text-sm text-ivory-400 hover:text-gold-400">
      ← Back to Home
    </Link>
  </div>
</section>

);
}