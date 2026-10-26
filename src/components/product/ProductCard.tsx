import { Image as ImageIcon } from 'lucide-react';
import type { DemoProduct } from '../../data/demoProducts';
import { discountPercent, formatPrice } from '../../lib/format';
import Button from '../common/Button';
import Rating from '../common/Rating';

interface ProductCardProps {
  product: DemoProduct;
}

/**
 * Reusable product card.
 * The Buy Now button is VISUAL ONLY in Part 1. It has no click handler and
 * does not connect to any cart, checkout or database.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gold-400/20 bg-onyx-900 shadow-card transition duration-300 hover:border-gold-400/50">
      <div className="relative flex aspect-[3/4] items-center justify-center bg-onyx-800">
        <ImageIcon className="h-10 w-10 text-gold-400/40" aria-hidden="true" />
        <span className="sr-only">Product image placeholder</span>

        {product.badge && (
          <span className="absolute left-2 top-2 rounded bg-gold-400 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-onyx-950">
            {product.badge}
          </span>
        )}

        {discount > 0 && (
          <span className="absolute right-2 top-2 rounded border border-gold-400/40 bg-onyx-950/80 px-2 py-1 text-[10px] font-semibold text-gold-300">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <p className="text-[11px] uppercase tracking-wider text-ivory-400">{product.category}</p>
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-ivory-100 md:text-base">
          {product.name}
        </h3>

        <Rating value={product.rating} count={product.reviewCount} />

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-semibold text-gold-300">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-ivory-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>

        <Button variant="primary" size="sm" fullWidth className="mt-auto">
          Buy Now
        </Button>
      </div>
    </article>
  );
}
