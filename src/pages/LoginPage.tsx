import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { user, loading, signInWithPassword, signUpWithPassword, signOut } =
    useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setBusy(true);

    try {
      const result =
        mode === 'login'
          ? await signInWithPassword(email, password)
          : await signUpWithPassword(email, password);

      setMessage(
        result.error ??
          (mode === 'signup'
            ? 'Account request submitted. Check your email if confirmation is required.'
            : 'Login successful.'),
      );
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    const result = await signOut();
    setMessage(result.error ?? 'You have signed out.');
  }

  return (
    <section className="mx-auto w-full max-w-md flex-1 px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-gold-500/30 bg-onyx-900 p-6 shadow-xl sm:p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
          Luxe Marketplace
        </p>

        <h1 className="mt-4 text-center font-display text-3xl text-gold-400">
          {user ? 'My Account' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>

        {loading ? (
          <p className="mt-6 text-center text-ivory-400">Checking your account...</p>
        ) : user ? (
          <div className="mt-6 space-y-4 text-center">
            <p className="break-all text-ivory-300">
              Signed in as {user.email ?? user.phone ?? 'Customer'}
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-lg border border-gold-500 px-4 py-3 font-semibold text-gold-400 transition hover:bg-gold-500 hover:text-onyx-950"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <p className="mt-3 text-center text-sm text-ivory-400">
              {mode === 'login'
                ? 'Sign in to continue shopping.'
                : 'Create your customer account.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <label className="block text-sm text-ivory-300">
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-lg border border-gold-500/30 bg-onyx-950 px-4 py-3 text-ivory-100 outline-none focus:border-gold-400"
                />
              </label>

              <label className="block text-sm text-ivory-300">
                Password
                <input
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={6}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  className="mt-2 w-full rounded-lg border border-gold-500/30 bg-onyx-950 px-4 py-3 text-ivory-100 outline-none focus:border-gold-400"
                />
              </label>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-gold-400 px-4 py-3 font-bold text-onyx-950 transition hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'Login'
                    : 'Create Account'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-ivory-400">
              {mode === 'login' ? 'New customer?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setMessage('');
                }}
                className="font-semibold text-gold-400 underline underline-offset-4"
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </>
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
