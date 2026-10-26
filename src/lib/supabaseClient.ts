import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '../config/env';

/**
 * Supabase client PLACEHOLDER.
 *
 * - Uses only the public ANON key (safe for the browser).
 * - Returns null until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
 * - Nothing in the app calls this yet. It will be used in later parts.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
