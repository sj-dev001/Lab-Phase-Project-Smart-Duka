import { Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Payment from '../models/Payment';
import { AuthRequest } from '../middleware/auth';

export async function listUsers(req: AuthRequest, res: Response): Promise<void> {
  const { role, page = '1', limit = '20' } = req.query;
  const filter: Record<string, unknown> = {};

  if (role) filter.role = role;

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      users,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    },
  });
}

export async function updateUser(req: AuthRequest, res: Response): Promise<void> {
  const { isActive, role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  if (isActive !== undefined) user.isActive = isActive;
  if (role && ['customer', 'vendor', 'admin'].includes(role)) user.role = role;

  await user.save();

  res.json({ success: true, data: user, message: 'User updated' });
}

export async function listPendingVendors(req: AuthRequest, res: Response): Promise<void> {
  const vendors = await User.find({
    role: 'vendor',
    'vendorProfile.approved': false,
  }).select('name email vendorProfile createdAt');

  res.json({ success: true, data: vendors });
}

export async function approveVendor(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'vendor') {
    res.status(404).json({ success: false, message: 'Vendor not found' });
    return;
  }

  if (!user.vendorProfile) {
    res.status(400).json({ success: false, message: 'Vendor has no profile' });
    return;
  }

  user.vendorProfile.approved = true;
  await user.save();

  res.json({ success: true, data: user, message: 'Vendor approved' });
}

export async function getAnalytics(req: AuthRequest, res: Response): Promise<void> {
  const [totalUsers, totalVendors, totalProducts, totalOrders, totalRevenue] =
    await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'vendor' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  });
}
