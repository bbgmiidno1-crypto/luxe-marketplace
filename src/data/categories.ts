export interface Category {
  id: string;
  label: string;
  emoji: string;
}

/**
 * Demo categories only. Later parts will load these from Supabase.
 * Emojis are used as lightweight placeholders instead of brand icons.
 */
export const categories: Category[] = [
  { id: 'women', label: 'Women', emoji: '👗' },
  { id: 'men', label: 'Men', emoji: '👔' },
  { id: 'jewellery', label: 'Jewellery', emoji: '💍' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'home', label: 'Home & Living', emoji: '🏡' },
  { id: 'electronics', label: 'Electronics', emoji: '🎧' },
  { id: 'bags', label: 'Bags & Wallets', emoji: '👜' },
  { id: 'footwear', label: 'Footwear', emoji: '👠' },
  { id: 'kids', label: 'Kids', emoji: '🧸' },
  { id: 'watches', label: 'Watches', emoji: '⌚' },
];
