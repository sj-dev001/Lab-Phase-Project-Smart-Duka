// FILE: seed/transformers/deduplicateProducts.ts
import { SeedProduct } from '../types/product';

export function deduplicateProducts(products: SeedProduct[]): SeedProduct[] {
  const seen = new Map<string, SeedProduct>();
  for (const p of products) {
    const key = p.slug || p.name.toLowerCase().replace(/\s+/g, '-');
    if (!seen.has(key)) seen.set(key, p);
    else {
      // merge images and tags if duplicate
      const existing = seen.get(key)!;
      existing.images = Array.from(new Set([...existing.images, ...p.images]));
      existing.tags = Array.from(new Set([...existing.tags, ...p.tags]));
      existing.stock = Math.max(existing.stock, p.stock);
      existing.price = Math.min(existing.price, p.price);
      existing.numReviews = Math.max(existing.numReviews, p.numReviews);
      existing.rating = Math.max(existing.rating, p.rating);
    }
  }
  return Array.from(seen.values());
}
