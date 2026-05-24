// FILE: seed/sources/faker.ts
import { faker } from '@faker-js/faker';
import { SeedProduct } from '../types/product';
import { slugify } from '../utils/slugify';
import { generateSKU, generateTags, randInt, generateRating } from '../utils/random';
import { imageFor } from '../utils/imageFor';

const LOCAL_CATEGORIES = [
  'books-stationery',
  'baby-kids',
  'food-beverages',
  'home-garden',
  'fashion',
  'electronics',
];

function makeProduct(category: string): SeedProduct {
  const name = faker.commerce.productName() + ' ' + faker.commerce.productAdjective();
  const price = parseFloat(faker.commerce.price(5, 600, 2));
  const discountPercentage = +((Math.random() * 30) | 0);
  const discountPrice = +(price * (1 - discountPercentage / 100)).toFixed(2);
  const sku = generateSKU(name);
  const tags = generateTags(name);
  const rating = generateRating(category);
  const numReviews = randInt(0, 500);

  return {
    name,
    slug: slugify(name),
    description: faker.commerce.productDescription(),
    shortDescription: faker.lorem.sentences(2),
    price,
    discountPercentage,
    discountPrice,
    stock: randInt(0, 200),
    brand: faker.company.name(),
    sku,
    tags,
    images: [imageFor(name, faker.number.int({ min: 1, max: 5 }))],
    categorySlug: category,
    vendorEmail: '',
    rating,
    numReviews,
    featured: Math.random() < 0.08,
    isActive: true,
  };
}

export function generateLocalFakeProducts(count = 60): SeedProduct[] {
  const products: SeedProduct[] = [];
  for (let i = 0; i < count; i++) {
    const category = LOCAL_CATEGORIES[Math.floor(Math.random() * LOCAL_CATEGORIES.length)];
    products.push(makeProduct(category));
  }
  return products;
}
