import { Response } from 'express';
import { validationResult } from 'express-validator';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

export async function listOrders(req: AuthRequest, res: Response): Promise<void> {
  const filter: Record<string, unknown> = {};

  if (req.user!.role === 'customer') {
    filter.customer = req.user!.id;
  } else if (req.user!.role === 'vendor') {
    filter.vendor = req.user!.id;
  }

  const orders = await Order.find(filter)
    .populate('customer', 'name email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
}

export async function getOrder(req: AuthRequest, res: Response): Promise<void> {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email')
    .populate('items.product', 'name images price')
    .populate('payment');

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  const isOwner =
    order.customer._id.toString() === req.user!.id ||
    order.vendor.toString() === req.user!.id ||
    req.user!.role === 'admin';

  if (!isOwner) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  res.json({ success: true, data: order });
}

export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const { items, shippingAddress } = req.body;

  const productIds = items.map((i: { product: string }) => i.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });

  if (products.length !== productIds.length) {
    res.status(400).json({ success: false, message: 'Some products not found or inactive' });
    return;
  }

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));
  const vendors = new Set<string>();

  const orderItems = items.map((item: { product: string; quantity: number }) => {
    const product = productMap.get(item.product);
    if (!product) throw new Error('Product not found');

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    vendors.add(product.vendor.toString());

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0] || '',
    };
  });

  if (vendors.size !== 1) {
    res.status(400).json({ success: false, message: 'All items must be from the same vendor' });
    return;
  }

  const vendorId = Array.from(vendors)[0];
  const totalAmount = orderItems.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    customer: req.user!.id,
    vendor: vendorId,
    items: orderItems,
    totalAmount,
    shippingAddress,
  });

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  const populated = await Order.findById(order._id).populate('items.product', 'name images');

  res.status(201).json({
    success: true,
    data: populated,
    message: 'Order created',
  });
}

export async function updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid status' });
    return;
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  if (req.user!.role === 'vendor' && order.vendor.toString() !== req.user!.id) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  order.status = status;
  await order.save();

  res.json({ success: true, data: order, message: 'Order status updated' });
}
