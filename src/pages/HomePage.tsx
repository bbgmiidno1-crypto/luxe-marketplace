import { useEffect, useRef } from 'react';
import { Image as ImageIcon, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { buttonClasses } from '../components/common/Button';
import RevealOnScroll from '../components/common/RevealOnScroll';
import ProductCard from '../components/product/ProductCard';
import { demoProducts } from '../data/demoProducts';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

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

export default function HomePage() {
  const reducedMotion = usePrefersReducedMotion();
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  // Lightweight parallax demo: one background layer moves slightly on scroll.
  // It updates the transform directly (no React re-renders) and is disabled
  // when the user prefers reduced motion.
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
              care. Layout preview only: the catalogue will be connected in a later part.
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

      {/* FEATURED PRODUCTS */}
      <section id="featured" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <RevealOnScroll>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold-400">Handpicked</p>
              <h2 className="font-display text-3xl text-ivory-100 md:text-4xl">Featured Picks</h2>
            </div>
            <p className="hidden text-xs text-ivory-400 md:block">
              Demo products for layout preview only
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {demoProducts.map((product, index) => (
            <RevealOnScroll key={product.id} delay={Math.min(index, 4) * 60}>
              <ProductCard product={product} />
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </div>
  );
}
