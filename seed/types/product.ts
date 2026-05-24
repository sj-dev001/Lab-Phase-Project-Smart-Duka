// FILE: seed/types/product.ts

export type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPercentage: number;
  discountPrice: number;
  stock: number;
  brand: string;
  sku: string;
  tags: string[];
  images: string[];
  categorySlug: string;
  vendorEmail: string;
  rating: number;
  numReviews: number;
  featured: boolean;
  isActive: boolean;
};
