import { env } from './env';

/**
 * Central brand settings. Change the name and tagline here
 * when the final brand is decided.
 */
export const brand = {
  name: env.appName,
  shortMark: 'L',
  tagline: 'Curated luxury, delivered to your door',
  supportEmail: 'support@example.com',
  supportPhone: '+91 00000 00000',
  supportHours: 'Mon–Sat, 10:00 AM – 7:00 PM IST',
  currency: 'INR',
  currencySymbol: '₹',
} as const;
