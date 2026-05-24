// FILE: seed/transformers/assignVendor.ts
import { VENDOR_CATEGORY_MAP, VENDORS } from '../data/vendors';

export function assignVendor(categorySlug: string): string {
  return VENDOR_CATEGORY_MAP[categorySlug] || VENDORS[Math.floor(Math.random() * VENDORS.length)];
}
