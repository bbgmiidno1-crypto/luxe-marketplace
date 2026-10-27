import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Image as ImageIcon, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import Button, { buttonClasses } from '../components/common/Button';
import RevealOnScroll from '../components/common/RevealOnScroll';
import ProductCard from '../components/product/ProductCard';
import { filterProducts } from '../lib/catalogue';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import type { CatalogueState } from '../hooks/useCatalogue';

const trustItems = [
  {
    icon: Truck,
    title: 'Doorstep delivery',
    text: 'Delivery charges and dates will be configured in a later part.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure shopping',
    text: 'Sign-in with mobile OTP arrives in Part 3.',
  },
  {
    icon: RotateCcw,
    title: 'Easy returns',
    text: 'Return policy text is a placeholder for now.',
  },
];

interface HomePageProps {
  catalogue: CatalogueState;
  searchQuery: string;
  categorySlug: string | null;
  onClearFilters: () => void;
}

interface StateMessageProps {
  title: string;
  text: string;
  action?: ReactNode;
}

function StateMessage({ title, text, action }: StateMessageProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-gold-400/30 bg-onyx-900 px-6 py-12 text-center"
    >
      <p className="font-display text-2xl text-gold-300">{title}</p>
      <p className="max-w-md text-sm leading-relaxed text-ivory-400">{text}</p>
      {action}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-lg border border-gold-400/10 bg-onyx-900"
        >
          <div className="aspect-[3/4] bg-onyx-800" />
          <div className="space-y-3 p-3 md:p-4">
            <div className="h-2 w-1/3 rounded bg-onyx-700" />
            <div className="h-3 w-4/5 rounded bg-onyx-700" />
            <div className="h-3 w-1/2 rounded bg-onyx-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage({
  catalogue,
  searchQuery,
  categorySlug,
  onClearFilters,
}: HomePageProps) {
  const reducedMotion = usePrefersReducedMotion();
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const { status, data, notConfigured, reload } = catalogue;

  const visibleProducts = useMemo(
    () => filterProducts(data.products, { query: searchQuery, categorySlug }),
    [data.products, searchQuery, categorySlug],
  );

  const hasDemo = data.products.some((product) => product.isDemo);
  const filtersActive = searchQuery.trim() !== '' || categorySlug !== null;

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!parallaxRef.current) return;
        const offset = Math.min(window.scrollY, 800) * 0.25;
        parallaxRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const renderCatalogue = () => {
    if (status === 'loading') return <LoadingGrid />;

    if (status === 'error') {
      return (
        <StateMessage
          title="We couldn't load products"
          text="Please check your connection and try again."
          action={
            <Button variant="outline" size="md" onClick={reload}>
              Try again
            </Button>
          }
        />
      );
    }

    if (notConfigured) {
      return (
        <StateMessage
          title="Catalogue is being set up"
          text={
            import.meta.env.DEV
              ? 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart npm run dev.'
              : 'New products will appear here soon.'
          }
        />
      );
    }

    if (data.products.length === 0) {
      return (
        <StateMessage
          title="No products yet"
          text="New arrivals will appear here as soon as they are added."
        />
      );
    }

    if (visibleProducts.length === 0) {
      return (
        <StateMessage
          title="No matching products"
          text="Try a different search or category."
          action={
            filtersActive ? (
              <Button variant="outline" size="md" onClick={onClearFilters}>
                Clear filters
              </Button>
            ) : null
          }
        />
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {visibleProducts.map((product, index) => (
          <RevealOnScroll key={product.id} delay={Math.min(index, 4) * 60}>
            <ProductCard product={product} />
          </RevealOnScroll>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gold-400/15">
        <div
          ref={parallaxRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-16 h-[calc(100%+8rem)] bg-gradient-to-b from-onyx-900 via-onyx-950 to-onyx-950 will-change-transform"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-20">
          <div className="space-y-6">
            <p className="animate-fade-up text-xs uppercase tracking-[0.3em] text-gold-400">
              Curated for every category
            </p>
            <h1 className="animate-fade-up font-display text-4xl font-semibold leading-tight text-gold-metallic md:text-6xl">
              One standard of luxury, across everything you love.
            </h1>
            <p className="animate-fade-up max-w-lg text-base leading-relaxed text-ivory-300 [animation-delay:120ms]">
              Discover fashion, jewellery, beauty, home, electronics and more, presented with
              care.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#featured" className={buttonClasses({ variant: 'primary', size: 'lg' })}>
                Explore Collection
              </a>
              <a href="#categories" className={buttonClasses({ variant: 'outline', size: 'lg' })}>
                Browse Categories
              </a>
            </div>
          </div>

          <div className="animate-fade-up relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-dashed border-gold-400/40 bg-onyx-900 md:aspect-[4/3]">
            <div
              aria-hidden="true"
              className="shimmer-sweep animate-shimmer absolute inset-0 opacity-20"
            />
            <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <ImageIcon className="h-12 w-12 text-gold-400/50" aria-hidden="true" />
              <p className="font-display text-2xl text-gold-300">Hero banner placeholder</p>
              <p className="max-w-xs text-xs text-ivory-400">
                Banners will be managed from the admin dashboard in Part 5.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-gold-400/10 bg-onyx-900">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-3 md:px-6">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-4">
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-gold-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-ivory-100">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ivory-400">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="featured" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <RevealOnScroll>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold-400">Handpicked</p>
              <h2 className="font-display text-3xl text-ivory-100 md:text-4xl">Shop the Collection</h2>
            </div>
            {status === 'ready' && visibleProducts.length > 0 && (
              <p className="text-xs text-ivory-400">
                {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {hasDemo && (
          <div className="mb-6 rounded-md border border-gold-400/40 bg-onyx-900 px-4 py-3 text-xs uppercase tracking-[0.15em] text-gold-300">
            Demo mode: sample products for preview only. They are not real inventory and cannot be
            bought.
          </div>
        )}

        {renderCatalogue()}
      </section>
    </div>
  );
}
