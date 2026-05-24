// FILE: seed/utils/random.ts
import { faker } from '@faker-js/faker';
import { slugify } from './slugify';

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateSKU(name: string): string {
  const base = slugify(name).slice(0, 8).toUpperCase();
  return `${base}-${faker.string.alphanumeric(6).toUpperCase()}`;
}

export function generateTags(name: string): string[] {
  const words = name.split(/\s+/).map((w) => w.toLowerCase());
  const extras = ["sale", "new", "popular", "eco", "local", "imported"];
  const tags = Array.from(new Set([...words.slice(0, 3), pick(extras)]));
  return tags;
}

export function generateRating(category: string) {
  // electronics slightly broader spread
  if (category === 'electronics') return +(3.5 + Math.random() * 1.5).toFixed(2);
  if (category === 'books-stationery') return +(3.8 + Math.random() * 1.2).toFixed(2);
  return +(3.6 + Math.random() * 1.4).toFixed(2);
}
