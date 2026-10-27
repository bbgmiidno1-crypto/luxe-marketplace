import { useCallback, useEffect, useState } from 'react';
import { env, isSupabaseConfigured } from '../config/env';
import {
  fetchDatabaseCatalogue,
  getDemoCatalogue,
  type CatalogueData,
} from '../lib/catalogue';

export type CatalogueStatus = 'loading' | 'ready' | 'error';

export interface CatalogueState {
  status: CatalogueStatus;
  data: CatalogueData;
  /** True when VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. */
  notConfigured: boolean;
  reload: () => void;
}

const EMPTY_CATALOGUE: CatalogueData = { categories: [], products: [] };

/**
 * Loads the storefront catalogue from Supabase.
 * - Real products are shown by default.
 * - Demo products are used only if VITE_SHOW_DEMO_PRODUCTS=true, and only as a fallback
 *   when the database is empty or the request fails.
 */
export function useCatalogue(): CatalogueState {
  const [status, setStatus] = useState<CatalogueStatus>('loading');
  const [data, setData] = useState<CatalogueData>(EMPTY_CATALOGUE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('loading');

      if (!isSupabaseConfigured) {
        setData(env.showDemoProducts ? getDemoCatalogue() : EMPTY_CATALOGUE);
        setStatus('ready');
        return;
      }

      try {
        const result = await fetchDatabaseCatalogue();
        if (cancelled) return;

        if (result.products.length === 0 && env.showDemoProducts) {
          setData(getDemoCatalogue());
        } else {
          setData(result);
        }
        setStatus('ready');
      } catch (error) {
        if (cancelled) return;
        console.error('Catalogue failed to load:', error);

        if (env.showDemoProducts) {
          setData(getDemoCatalogue());
          setStatus('ready');
        } else {
          setData(EMPTY_CATALOGUE);
          setStatus('error');
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((count) => count + 1), []);

  return { status, data, notConfigured: !isSupabaseConfigured, reload };
            }
