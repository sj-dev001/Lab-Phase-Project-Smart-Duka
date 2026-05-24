// FILE: seed/data/vendors.ts
export const VENDORS = [
  'john@example.com',
  'amina@example.com',
  'grace@example.com',
  'brian@example.com',
  'lucy@example.com',
  'mary@example.com',
];

// Matches server/src/seed.ts vendor-to-category assignments
export const VENDOR_CATEGORY_MAP: Record<string, string> = {
  electronics: 'john@example.com',
  fashion: 'amina@example.com',
  'home-garden': 'grace@example.com',
  'food-beverages': 'grace@example.com',
  'health-beauty': 'amina@example.com',
  'sports-outdoors': 'brian@example.com',
  'books-stationery': 'lucy@example.com',
  'baby-kids': 'mary@example.com',
};
