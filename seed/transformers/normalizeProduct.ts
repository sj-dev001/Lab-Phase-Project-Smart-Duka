// FILE: seed/transformers/normalizeProduct.ts
import { SeedProduct } from '../types/product';
import { slugify } from '../utils/slugify';
import { imageFor } from '../utils/imageFor';
import { generateSKU, generateTags, generateRating, randInt } from '../utils/random';
import { normalizeCategory } from './normalizeCategory';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function normalizeFromDummyJSON(raw: any): SeedProduct {
  const name = raw.title || raw.name || raw.product || 'Product';
  const categorySlug = normalizeCategory(raw.category || raw.brand || raw.category?.name);
  const price = Number(raw.price) || Number(raw.priceU || raw.unitPrice) || 10;
  const discountPercentage = raw.discountPercentage ? Number(raw.discountPercentage) : Math.floor(Math.random() * 25);
  const discountPrice = +(price * (1 - discountPercentage / 100)).toFixed(2);
  const images = (raw.images && raw.images.length) ? raw.images : (raw.thumbnail ? [raw.thumbnail] : [imageFor(name)]);

  return {
    name,
    slug: slugify(name),
    description: raw.description || raw.descriptionText || name,
    shortDescription: (raw.description || name).slice(0, 160),
    price: clamp(price, 0.01, 100000),
    discountPercentage: clamp(discountPercentage, 0, 80),
    discountPrice,
    stock: Number(raw.stock ?? raw.quantity ?? randInt(0, 200)),
    brand: raw.brand || raw.category || 'Generic',
    sku: generateSKU(name),
    tags: generateTags(name),
    images: images.map((i: any, idx: number) => i || imageFor(name, idx)),
    categorySlug,
    vendorEmail: '',
    rating: generateRating(categorySlug),
    numReviews: randInt(0, 500),
    featured: Math.random() < 0.05,
    isActive: true,
  };
}

export function normalizeFromPlatzi(raw: any): SeedProduct {
  const name = raw.title || raw.name || 'Product';
  const price = Number(raw.price) || randInt(5, 500);
  const images = raw.images && raw.images.length ? raw.images : [imageFor(name)];
  const categorySlug = normalizeCategory(raw.category?.name || raw.category || raw.categoryId);

  const discountPercentage = Math.floor(Math.random() * 30);
  const discountPrice = +(price * (1 - discountPercentage / 100)).toFixed(2);

  return {
    name,
    slug: slugify(name),
    description: raw.description || raw.descriptionText || name,
    shortDescription: (raw.description || name).slice(0, 160),
    price,
    discountPercentage,
    discountPrice,
    stock: Number(raw.stock ?? randInt(0, 200)),
    brand: raw.brand?.name || raw.category?.name || 'Generic',
    sku: generateSKU(name),
    tags: generateTags(name),
    images: images.map((i: any, idx: number) => i || imageFor(name, idx)),
    categorySlug,
    vendorEmail: '',
    rating: generateRating(categorySlug),
    numReviews: randInt(0, 400),
    featured: Math.random() < 0.06,
    isActive: true,
  };
}

export function normalizeFromFakeStore(raw: any): SeedProduct {
  const name = raw.title || raw.name || 'Product';
  const price = Number(raw.price) || 10;
  const images = raw.image ? [raw.image] : (raw.images || [imageFor(name)]);
  const categorySlug = normalizeCategory(raw.category || raw.category?.name);
  const discountPercentage = Math.floor(Math.random() * 20);
  const discountPrice = +(price * (1 - discountPercentage / 100)).toFixed(2);

  return {
    name,
    slug: slugify(name),
    description: raw.description || name,
    shortDescription: (raw.description || name).slice(0, 160),
    price,
    discountPercentage,
    discountPrice,
    stock: Number(raw.rating?.count ?? raw.stock ?? randInt(0, 200)),
    brand: raw.category || 'Generic',
    sku: generateSKU(name),
    tags: generateTags(name),
    images: images.map((i: any, idx: number) => i || imageFor(name, idx)),
    categorySlug,
    vendorEmail: '',
    rating: raw.rating?.rate ? Number(raw.rating.rate) : generateRating(categorySlug),
    numReviews: randInt(0, 400),
    featured: Math.random() < 0.04,
    isActive: true,
  };
}
