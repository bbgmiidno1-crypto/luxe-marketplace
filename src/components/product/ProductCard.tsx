import { Image as ImageIcon } from 'lucide-react';
import type { CatalogueProduct } from '../../lib/catalogue';
import { discountPercent, formatPrice } from '../../lib/format';
import Button from '../common/Button';
import Rating from '../common/Rating';

interface ProductCardProps {
  product: CatalogueProduct;
}

/**
 * Luxury black-and-gold product card.
 * Displays the real image URL supplied by the Supabase catalogue.
 * Buy Now remains visual only; checkout is not activated here.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.originalPrice !== null
      ? discountPercent(product.price, product.originalPrice)
      : product.discountPercent;

  const imageUrl = product.imageUrl;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gold-400/20 bg-onyx-900 shadow-card transition duration-300 hover:border-gold-400/50">
      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-onyx-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              const fallback =
                event.currentTarget.parentElement?.querySelector(
                  '[data-image-fallback]',
                );
              if (fallback instanceof HTMLElement) {
                fallback.style.display = 'flex';
              }
            }}
          />
        ) : null}

        <div
          data-image-fallback
          className="absolute inset-0 items-center justify-center bg-onyx-800"
          style={{ display: imageUrl ? 'none' : 'flex' }}
          aria-hidden="true"
        >
          <ImageIcon className="h-10 w-10 text-gold-400/40" />
        </div>

        {product.isDemo && (
          <span className="absolute bottom-2 left-2 rounded border border-gold-400/40 bg-onyx-950/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-300">
            Demo
          </span>
        )}

        {product.badge && (
          <span className="absolute left-2 top-2 rounded bg-gold-400 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-onyx-950">
            {product.badge}
          </span>
        )}

        {discount > 0 && (
          <span className="absolute right-2 top-2 rounded border border-gold-400/40 bg-onyx-950/90 px-2 py-1 text-[10px] font-semibold text-gold-300">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        {product.categoryName && (
          <p className="text-[11px] uppercase tracking-wider text-ivory-400">
            {product.categoryName}
          </p>
        )}

        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-ivory-100 md:text-base">
          {product.name}
        </h3>

        <Rating value={product.rating} count={product.reviewCount} />

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-semibold text-gold-300">
            {formatPrice(product.price)}
          </span>

          {product.originalPrice !== null &&
            product.originalPrice > product.price && (
              <span className="text-xs text-ivory-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
        </div>

        {product.stock !== null && (
          <p className="text-xs text-ivory-400">
            {product.stock > 0
              ? `${product.stock} in stock`
              : 'Currently out of stock'}
          </p>
        )}

        <Button
          variant="primary"
          size="sm"
          fullWidth
          className="mt-auto"
        >
          Buy Now
        </Button>
      </div>
    </article>
  );
}
