export interface DemoProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  badge?: string;
}

/**
 * DEMO DATA ONLY. These are not real inventory, not connected to a
 * database, and purchasing them does nothing yet.
 */
export const demoProducts: DemoProduct[] = [
  {
    id: 'demo-1',
    name: 'Obsidian Leather Tote',
    category: 'Bags & Wallets',
    price: 2499,
    originalPrice: 4999,
    rating: 4.6,
    reviewCount: 1280,
    badge: 'Bestseller',
  },
  {
    id: 'demo-2',
    name: 'Gilded Chronograph Watch',
    category: 'Watches',
    price: 3199,
    originalPrice: 6499,
    rating: 4.4,
    reviewCount: 642,
  },
  {
    id: 'demo-3',
    name: 'Noir Silk Evening Dress',
    category: 'Women',
    price: 1799,
    originalPrice: 3299,
    rating: 4.7,
    reviewCount: 905,
    badge: 'New',
  },
  {
    id: 'demo-4',
    name: 'Champagne Gold Hoop Earrings',
    category: 'Jewellery',
    price: 899,
    originalPrice: 1899,
    rating: 4.3,
    reviewCount: 2103,
  },
  {
    id: 'demo-5',
    name: 'Tailored Black Blazer',
    category: 'Men',
    price: 2299,
    originalPrice: 4199,
    rating: 4.5,
    reviewCount: 418,
  },
  {
    id: 'demo-6',
    name: 'Atelier Velvet Cushion Set',
    category: 'Home & Living',
    price: 1199,
    originalPrice: 2399,
    rating: 4.2,
    reviewCount: 367,
    badge: 'Limited',
  },
  {
    id: 'demo-7',
    name: 'Onyx Wireless Headphones',
    category: 'Electronics',
    price: 3499,
    originalPrice: 5999,
    rating: 4.6,
    reviewCount: 1534,
  },
  {
    id: 'demo-8',
    name: 'Rose Gold Eau de Parfum',
    category: 'Beauty',
    price: 1399,
    originalPrice: 2599,
    rating: 4.5,
    reviewCount: 779,
    badge: 'Bestseller',
  },
];
