import { env } from '../config/env';
import { demoProducts } from '../data/demoProducts';
import { discountPercent } from './format';
import { supabase } from './supabaseClient';

export const PRODUCT_IMAGE_BUCKET = 'product-images';

export interface CatalogueCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogueProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  discountPercent: number;
  imageUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  /** null means "unknown" (demo data). 0 means out of stock. */
  stock: number | null;
  rating: number;
  reviewCount: number;
  badge: string | null;
  isFeatured: boolean;
  /** true only for sample data. Always shown with a DEMO label. */
  isDemo: boolean;
}

export interface CatalogueData {
  categories: CatalogueCategory[];
  products: CatalogueProduct[];
}

export interface CatalogueFilter {
  query: string;
  categorySlug: string | null;
}

/** Row shape returned by PostgREST. Numeric columns may arrive as number or string. */
interface CategoryRow {
  id: string;
  name: string;
  slug: string;
}

interface RelatedCategory {
  name: string;
  slug: string;
}

interface ProductRow {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  original_price: number | string | null;
  image_paths: string[] | null;
  stock: number | string;
  rating: number | string;
  review_count: number | string;
  badge: string | null;
  is_featured: boolean;
  is_demo: boolean;
  categories: RelatedCategory | RelatedCategory[] | null;
}

const PRODUCT_SELECT =
  'id, category_id, name, slug, description, price, original_price, image_paths, stock, rating, review_count, badge, is_featured, is_demo, categories ( name, slug )';

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return (value[0] as T | undefined) ?? null;
  return value as T;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Returns a public image URL for a stored path in the product-images bucket.
 * Full http(s) URLs are returned unchanged. Returns null if there is no image.
 */
export function getProductImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (!supabase) return null;
  const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl || null;
}

function toProduct(row: ProductRow): CatalogueProduct {
  const price = toNumber(row.price);
  const originalPrice =
    row.original_price === null || row.original_price === undefined
      ? null
      : toNumber(row.original_price);
  const category = firstRelation(row.categories);

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price,
    originalPrice,
    discountPercent: originalPrice ? discountPercent(price, originalPrice) : 0,
    imageUrl: getProductImageUrl(row.image_paths?.[0] ?? null),
    categoryId: row.category_id,
    categoryName: category?.name ?? null,
    categorySlug: category?.slug ?? null,
    stock: toNumber(row.stock),
    rating: toNumber(row.rating),
    reviewCount: toNumber(row.review_count),
    badge: row.badge,
    isFeatured: row.is_featured,
    isDemo: row.is_demo,
  };
}

/**
 * Loads ACTIVE categories and ACTIVE products from Supabase.
 * RLS already enforces this on the server. The filters below are an extra safeguard.
 * Throws an Error if the query fails, so the caller can show an error state.
 */
export async function fetchDatabaseCatalogue(): Promise<CatalogueData> {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
    supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false }),
  ]);

  if (categoriesResult.error) throw new Error(categoriesResult.error.message);
  if (productsResult.error) throw new Error(productsResult.error.message);

  // Keep demo rows out unless the demo flag is on.
  const productRows = ((productsResult.data ?? []) as ProductRow[]).filter(
    (row) => env.showDemoProducts || !row.is_demo,
  );
  const products = productRows.map(toProduct);

  // Show only categories that have at least one visible product.
  const usedSlugs = new Set(
    products.map((product) => product.categorySlug).filter((slug): slug is string => Boolean(slug)),
  );
  const categoryRows = (categoriesResult.data ?? []) as CategoryRow[];
  const categories: CatalogueCategory[] = categoryRows
    .filter((category) => usedSlugs.has(category.slug))
    .map((category) => ({ id: category.id, name: category.name, slug: category.slug }));

  return { categories, products };
}

/** Static sample data. Used ONLY when VITE_SHOW_DEMO_PRODUCTS=true. Every item is marked as demo. */
export function getDemoCatalogue(): CatalogueData {
  const categoryMap = new Map<string, CatalogueCategory>();

  const products: CatalogueProduct[] = demoProducts.map((item) => {
    const slug = slugify(item.category);
    const categoryId = `demo-cat-${slug}`;
    if (!categoryMap.has(slug)) {
      categoryMap.set(slug, { id: categoryId, name: item.category, slug });
    }

    return {
      id: item.id,
      name: item.name,
      slug: item.id,
      description: null,
      price: item.price,
      originalPrice: item.originalPrice,
      discountPercent: discountPercent(item.price, item.originalPrice),
      imageUrl: null,
      categoryId,
      categoryName: item.category,
      categorySlug: slug,
      stock: null,
      rating: item.rating,
      reviewCount: item.reviewCount,
      badge: item.badge ?? null,
      isFeatured: true,
      isDemo: true,
    };
  });

  return { categories: [...categoryMap.values()], products };
}

/** Filters by category slug and by a search term (name, description, category name). */
export function filterProducts(
  products: CatalogueProduct[],
  { query, categorySlug }: CatalogueFilter,
): CatalogueProduct[] {
  const term = query.trim().toLowerCase();

  return products.filter((product) => {
    if (categorySlug && product.categorySlug !== categorySlug) return false;
    if (!term) return true;

    return [product.name, product.description ?? '', product.categoryName ?? ''].some((field) =>
      field.toLowerCase().includes(term),
    );
  });
    }
