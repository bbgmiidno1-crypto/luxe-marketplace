/**
 * Reads public (non-secret) environment values.
 * Only VITE_* variables are exposed to the browser by Vite.
 * NEVER place service-role keys, passwords or admin secrets here.
 */
export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'Luxe Marketplace',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
} as const;

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
