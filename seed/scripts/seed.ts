// FILE: seed/scripts/seed.ts
import { connectDB } from '../config/db';
import fs from 'fs-extra';
import path from 'path';
import mongoose from 'mongoose';

async function main() {
  console.log('[seed] connecting to db...');
  const { connectDB } = require('../../server/src/config/db');
  await connectDB();
  console.log('[seed] connected');

  // import models from server
  const User = require('../../server/src/models/User').default;
  const Product = require('../../server/src/models/Product').default;
  const Category = require('../../server/src/models/Category').default;

  // clear collections
  console.log('[seed] clearing collections');
  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Category.deleteMany({})]);

  // create admin and a customer
  console.log('[seed] creating users');
  const admin = await User.create({ name: 'Admin', email: 'admin@smartduka.test', password: 'password', role: 'admin', isActive: true });
  const customer = await User.create({ name: 'Customer', email: 'customer@smartduka.test', password: 'password', role: 'customer', isActive: true });

  // create vendors from seed/data/vendors.ts
  const vendorsList = require('../data/vendors').VENDORS as string[];
  const vendorDocs: Record<string, any> = {};
  for (const v of vendorsList) {
    const u = await User.create({ name: v.split('@')[0], email: v, password: 'password', role: 'vendor', isActive: true, vendorProfile: { storeName: `${v.split('@')[0]}'s store`, approved: true } });
    vendorDocs[v] = u;
  }

  // create categories
  console.log('[seed] creating categories');
  const categories = require('../data/categories').INTERNAL_CATEGORIES as { slug: string; name: string }[];
  const categoryDocs: Record<string, any> = {};
  for (const c of categories) {
    const cat = await Category.create({ name: c.name, slug: c.slug, description: `${c.name} category`, image: '' });
    categoryDocs[c.slug] = cat;
  }

  // load generated products
  const productsFile = path.resolve(__dirname, '..', 'data', 'products.generated.json');
  if (!(await fs.pathExists(productsFile))) {
    console.error('[seed] products.generated.json not found. Run `npm run generate:products` first.');
    process.exit(1);
  }
  const products = await fs.readJson(productsFile);

  console.log(`[seed] inserting ${products.length} products`);
  const insertOps = products.map(async (p: any, idx: number) => {
    const vendor = vendorDocs[p.vendorEmail];
    const category = categoryDocs[p.categorySlug];
    if (!vendor || !category) return null;
    const prod = {
      name: p.name,
      description: p.description,
      price: p.price,
      images: p.images,
      category: category._id,
      vendor: vendor._id,
      stock: p.stock,
      rating: p.rating,
      numReviews: p.numReviews,
      isActive: p.isActive,
      createdAt: new Date(Date.now() - idx * 60000),
    };
    return Product.create(prod);
  });

  await Promise.all(insertOps);

  console.log('[seed] done');
  const serverMongoose = require('../../server/node_modules/mongoose');
  await serverMongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
