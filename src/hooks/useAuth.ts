
import { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    if (!supabase) {
      setAuth({ user: null, session: null, loading: false });
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (error) {
        console.error('Unable to load session:', error.message);
      }

      setAuth({
        user: data.session?.user ?? null,
        session: data.session ?? null,
        loading: false,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return { error: 'Supabase is not configured.' };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error: error?.message ?? null };
    },
    [],
  );

  const signUpWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return { error: 'Supabase is not configured.' };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      return { error: error?.message ?? null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (!supabase) {
      return { error: 'Supabase is not configured.' };
    }

    const { error } = await supabase.auth.signOut();
    return { error: error?.message ?? null };
  }, []);

  return {
    ...auth,
    signInWithPassword,
    signUpWithPassword,
    signOut,
  };
    }
