import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export async function listProducts(req: Request, res: Response): Promise<void> {
  const {
    category,
    vendor,
    search,
    minPrice,
    maxPrice,
    sort,
    page = '1',
    limit = '20',
  } = req.query;

  const filter: Record<string, unknown> = { isActive: true };

  if (category) filter.category = category;
  if (vendor) filter.vendor = vendor;
  if (search) filter.$text = { $search: search as string };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
  }

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  else if (sort === 'price_desc') sortOption = { price: -1 };
  else if (sort === 'rating') sortOption = { rating: -1 };
  else if (sort === 'oldest') sortOption = { createdAt: 1 };

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .populate('vendor', 'name vendorProfile')
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('vendor', 'name vendorProfile');

  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  res.json({ success: true, data: product });
}

export async function createProduct(req: AuthRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const { name, description, price, category, stock, images } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    images: images || [],
    vendor: req.user!.id,
  });

  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created',
  });
}

export async function updateProduct(req: AuthRequest, res: Response): Promise<void> {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  if (product.vendor.toString() !== req.user!.id && req.user!.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  const allowedFields = ['name', 'description', 'price', 'category', 'stock', 'images', 'isActive'];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      (product as any)[field] = req.body[field];
    }
  }

  await product.save();

  res.json({ success: true, data: product, message: 'Product updated' });
}

export async function deleteProduct(req: AuthRequest, res: Response): Promise<void> {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  if (product.vendor.toString() !== req.user!.id && req.user!.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  await product.deleteOne();

  res.json({ success: true, message: 'Product deleted' });
}
