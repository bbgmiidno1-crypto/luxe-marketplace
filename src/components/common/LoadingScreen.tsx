import BrandLogo from './BrandLogo';

/**
 * Premium intro loader.
 * - pointer-events-none means it never blocks clicks or navigation.
 * - It is purely visual. Later parts can mount it while real data loads.
 */
export default function LoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center bg-onyx-950"
    >
      <div className="relative flex h-32 w-32 items-center justify-center md:h-40 md:w-40">
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-spin-slow rounded-full border border-gold-400/25 border-t-gold-400"
        />
        <span
          aria-hidden="true"
          className="absolute inset-3 rounded-full border border-gold-400/10"
        />
        <BrandLogo variant="mark" size="lg" />
      </div>
      <p
        className="mt-8 animate-fade-up text-[11px] uppercase tracking-[0.35em] text-ivory-400"
        style={{ animationDelay: '300ms' }}
      >
        Loading
      </p>
    </div>
  );
}
