// FILE: seed/utils/imageFor.ts
import { slugify } from './slugify';

export function imageFor(name: string, idx = 0): string {
  // Prefer to generate a human-friendly placeholder with text
  const s = slugify(name).replace(/-/g, ' ');
  const text = encodeURIComponent(s.substring(0, 30));
  // return placeholder sized image; index used for variety
  return `https://placehold.co/900x700?text=${text}&font=roboto&fbclid=seed${idx}`;
}
