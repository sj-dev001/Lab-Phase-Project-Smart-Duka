// FILE: seed/transformers/normalizeCategory.ts
import { slugify } from '../utils/slugify';

const CATEGORY_MAP: Record<string, string> = {
  // electronics
  smartphone: 'electronics',
  smartphones: 'electronics',
  mobile: 'electronics',
  laptop: 'electronics',
  laptops: 'electronics',
  computer: 'electronics',
  // fashion
  'men clothing': 'fashion',
  'women clothing': 'fashion',
  shirts: 'fashion',
  dresses: 'fashion',
  'mens-shirts': 'fashion',
  'womens-dresses': 'fashion',
  // home
  furniture: 'home-garden',
  'home decor': 'home-garden',
  'home-garden': 'home-garden',
  // food
  groceries: 'food-beverages',
  'food': 'food-beverages',
  'beverages': 'food-beverages',
  // health
  skincare: 'health-beauty',
  beauty: 'health-beauty',
  'health': 'health-beauty',
  // sports
  sports: 'sports-outdoors',
  outdoors: 'sports-outdoors',
  // books-stationery
  books: 'books-stationery',
  stationery: 'books-stationery',
  // baby
  baby: 'baby-kids',
  kids: 'baby-kids',
};

export function normalizeCategory(raw: string | number | undefined): string {
  if (!raw) return 'generic';
  const key = slugify(String(raw)).toLowerCase();
  if (CATEGORY_MAP[key]) return CATEGORY_MAP[key];
  // fallbacks: try to match parts
  for (const part of key.split('-')) {
    if (CATEGORY_MAP[part]) return CATEGORY_MAP[part];
  }
  // default mapping by heuristics
  if (/phone|mobile|laptop|computer|camera/.test(key)) return 'electronics';
  if (/shirt|dress|jeans|clothing|apparel|shoe/.test(key)) return 'fashion';
  if (/book|stationery|notebook|pen/.test(key)) return 'books-stationery';
  if (/baby|kid|stroller|diaper/.test(key)) return 'baby-kids';
  if (/food|grocery|beverage|drink/.test(key)) return 'food-beverages';
  if (/sport|outdoor|fitness|bike/.test(key)) return 'sports-outdoors';
  if (/skin|beauty|cosmetic|health|care/.test(key)) return 'health-beauty';
  return 'home-garden';
}
