import { Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';

export async function registerVendor(req: AuthRequest, res: Response): Promise<void> {
  const { storeName, description, phone, address } = req.body;

  const user = await User.findById(req.user!.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  if (user.vendorProfile?.storeName) {
    res.status(400).json({ success: false, message: 'Already registered as vendor' });
    return;
  }

  user.vendorProfile = {
    storeName,
    description: description || '',
    logo: '',
    phone: phone || '',
    address: address || '',
    approved: false,
  };
  user.role = 'vendor';
  await user.save();

  res.json({
    success: true,
    data: user,
    message: 'Vendor registration submitted for approval',
  });
}

export async function getVendorProducts(req: AuthRequest, res: Response): Promise<void> {
  const vendorId = req.params.id;

  const products = await Product.find({ vendor: vendorId, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: products });
}

export async function getVendorOrders(req: AuthRequest, res: Response): Promise<void> {
  if (req.user!.role !== 'admin' && req.user!.id !== req.params.id) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  const orders = await Order.find({ vendor: req.params.id })
    .populate('customer', 'name email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
}
