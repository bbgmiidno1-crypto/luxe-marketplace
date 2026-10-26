import { brand } from '../config/brand';

const priceFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: brand.currency,
  maximumFractionDigits: 0,
});

/** Formats a number as Indian Rupees, for example ₹2,499. */
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}

/** Returns the whole-number discount percentage, or 0 if it cannot be calculated. */
export function discountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= 0 || price >= originalPrice) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}
