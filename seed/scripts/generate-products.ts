// FILE: seed/scripts/generate-products.ts
import fs from 'fs-extra';
import path from 'path';
import { fetchDummyJSON } from '../sources/dummyjson';
import { fetchPlatzi } from '../sources/platzi';
import { fetchFakeStore } from '../sources/fakestore';
import { generateLocalFakeProducts } from '../sources/faker';
import { normalizeFromDummyJSON, normalizeFromPlatzi, normalizeFromFakeStore } from '../transformers/normalizeProduct';
import { deduplicateProducts } from '../transformers/deduplicateProducts';
import { assignVendor } from '../transformers/assignVendor';
import { INTERNAL_CATEGORIES } from '../data/categories';
import { VENDORS } from '../data/vendors';
import { SeedProduct } from '../types/product';
import { slugify } from '../utils/slugify';
import { info, error } from '../utils/logger';

async function main() {
  info('Starting product generation pipeline');
  try {
    const [d1, d2, d3] = await Promise.allSettled([fetchDummyJSON(), fetchPlatzi(), fetchFakeStore()]);

    const rawDummy = d1.status === 'fulfilled' ? d1.value : [];
    const rawPlatzi = d2.status === 'fulfilled' ? d2.value : [];
    const rawFake = d3.status === 'fulfilled' ? d3.value : [];

    info(`Fetched: dummy=${rawDummy.length}, platzi=${rawPlatzi.length}, fakestore=${rawFake.length}`);

    const products: SeedProduct[] = [];

    for (const r of rawDummy) products.push(normalizeFromDummyJSON(r));
    for (const r of rawPlatzi) products.push(normalizeFromPlatzi(r));
    for (const r of rawFake) products.push(normalizeFromFakeStore(r));

    // Add local faker products to ensure category coverage and reach target count
    const local = generateLocalFakeProducts(80);
    products.push(...local);

    // Assign vendor emails
    for (const p of products) {
      p.vendorEmail = assignVendor(p.categorySlug);
    }

    // Deduplicate
    let deduped = deduplicateProducts(products);

    // Ensure every category has products; if missing, generate a few
    const categorySet = new Set(deduped.map((p) => p.categorySlug));
    for (const c of INTERNAL_CATEGORIES) {
      if (!categorySet.has(c.slug)) {
        info(`Category ${c.slug} missing; generating filler products`);
        const fillers = generateLocalFakeProducts(6).map((f) => ({ ...f, categorySlug: c.slug, vendorEmail: assignVendor(c.slug) }));
        deduped.push(...fillers);
      }
    }

    // Post-process: ensure images, slugs, price rules by category
    for (const p of deduped) {
      if (!p.images || p.images.length === 0) p.images = [imagePlaceholder(p.name)];
      if (!p.slug) p.slug = slugify(p.name);
      // Pricing heuristics
      if (p.categorySlug === 'electronics') {
        if (p.price < 50) p.price = Math.round((p.price + 200) * 100) / 100;
      }
      if (p.categorySlug === 'books-stationery') {
        if (p.price > 80) p.price = Math.round((p.price / 5) * 100) / 100;
      }
      // recalc discountPrice
      p.discountPrice = +(p.price * (1 - p.discountPercentage / 100)).toFixed(2);
    }

    // Deduplicate again after fillers
    deduped = deduplicateProducts(deduped);

    // limit to 200- generate target
    const target = Math.max(150, Math.min(250, deduped.length));
    let final = deduped.slice(0, target);

    // Ensure tags and SKU present
    for (const p of final) {
      if (!p.sku) p.sku = `SKU-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      if (!p.tags || p.tags.length === 0) p.tags = [p.categorySlug];
    }

    const outDir = path.resolve(__dirname, '..', 'data');
    await fs.ensureDir(outDir);
    const outFile = path.join(outDir, 'products.generated.json');
    await fs.writeJson(outFile, final, { spaces: 2 });

    // export categories and vendors files (simple TS/JSON files already exist but ensure copy)
    info(`Saved ${final.length} products to ${outFile}`);
  } catch (err: any) {
    error(err.message || String(err));
    process.exit(1);
  }
}

function imagePlaceholder(name: string) {
  // lazy import to avoid cycle
  const { imageFor } = require('../utils/imageFor');
  return imageFor(name);
}

main();
