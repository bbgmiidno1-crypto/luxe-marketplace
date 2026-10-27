import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { CatalogueProduct } from '../../lib/catalogue';
import { formatPrice } from '../../lib/format';
import Button from '../common/Button';
import Rating from '../common/Rating';

interface ProductCardProps {
  product: CatalogueProduct;
}

function stockStatus(stock: number | null): { text: string; className: string } | null {
  if (stock === null) return null;
  if (stock <= 0) return { text: 'Out of stock', className: 'text-ivory-400' };
  if (stock <= 5) return { text: `Only ${stock} left`, className: 'text-gold-300' };
  return { text: 'In stock', className: 'text-ivory-300' };
}

/**
 * Product card for real and demo products.
 * Buy Now is DISABLED in this part. No cart, checkout or order is created.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(product.imageUrl) && !imageFailed;
  const stock = stockStatus(product.stock);
  const hasStrikePrice = product.originalPrice !== null && product.originalPrice > product.price;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gold-400/20 bg-onyx-900 shadow-card transition duration-300 hover:border-gold-400/50">
      <div className="relative aspect-[3/4] overflow-hidden bg-onyx-800">
        {showImage ? (
          <img
            src={product.imageUrl ?? undefined}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-gold-400/40" aria-hidden="true" />
            <span className="sr-only">No product image available</span>
          </div>
        )}

        {product.isDemo ? (
          <span className="absolute left-2 top-2 rounded border border-gold-400/60 bg-onyx-950/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-300">
            DEMO
          </span>
        ) : (
          product.badge && (
            <span className="absolute left-2 top-2 rounded bg-gold-400 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-onyx-950">
              {product.badge}
            </span>
          )
        )}

        {product.discountPercent > 0 && (
          <span className="absolute right-2 top-2 rounded border border-gold-400/40 bg-onyx-950/80 px-2 py-1 text-[10px] font-semibold text-gold-300">
            {product.discountPercent}% OFF
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

        {product.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-ivory-400">
            {product.description}
          </p>
        )}

        {product.reviewCount > 0 ? (
          <Rating value={product.rating} count={product.reviewCount} />
        ) : (
          <p className="text-xs text-ivory-400">No reviews yet</p>
        )}

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-semibold text-gold-300">
            {formatPrice(product.price)}
          </span>
          {hasStrikePrice && product.originalPrice !== null && (
            <span className="text-xs text-ivory-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {stock && <p className={`text-xs font-medium ${stock.className}`}>{stock.text}</p>}

        <Button variant="primary" size="sm" fullWidth disabled className="mt-auto">
          Buy Now
        </Button>
        <p className="text-center text-[10px] text-ivory-400">Checkout coming in a later part</p>
      </div>
    </article>
  );
}
