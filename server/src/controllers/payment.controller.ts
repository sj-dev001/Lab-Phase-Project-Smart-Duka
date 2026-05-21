import { Response } from 'express';
import axios from 'axios';
import Payment from '../models/Payment';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';
import { env } from '../config/env';

const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function initializePayment(req: AuthRequest, res: Response): Promise<void> {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  if (order.customer.toString() !== req.user!.id) {
    res.status(403).json({ success: false, message: 'Not authorized' });
    return;
  }

  const existingPayment = await Payment.findOne({ order: orderId, status: 'success' });
  if (existingPayment) {
    res.status(400).json({ success: false, message: 'Order already paid' });
    return;
  }

  const user = await (await import('../models/User')).default.findById(req.user!.id);

  try {
    const response = await paystackApi.post('/transaction/initialize', {
      email: user!.email,
      amount: Math.round(order.totalAmount * 100),
      currency: 'KES',
      callback_url: `${env.CLIENT_URL}/payment/verify`,
      metadata: { orderId: order._id.toString(), customerId: req.user!.id },
    });

    const payment = await Payment.create({
      order: order._id,
      customer: req.user!.id,
      amount: order.totalAmount,
      paystackReference: response.data.data.reference,
      paystackAccessCode: response.data.data.access_code,
    });

    order.payment = payment._id;
    await order.save();

    res.json({
      success: true,
      data: {
        authorizationUrl: response.data.data.authorization_url,
        reference: response.data.data.reference,
        accessCode: response.data.data.access_code,
      },
      message: 'Payment initialized',
    });
  } catch (error) {
    console.error('Paystack error:', error);
    res.status(502).json({ success: false, message: 'Payment service error' });
  }
}

export async function verifyPayment(req: AuthRequest, res: Response): Promise<void> {
  const { reference } = req.query;

  if (!reference) {
    res.status(400).json({ success: false, message: 'Reference is required' });
    return;
  }

  try {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);

    if (response.data.data.status === 'success') {
      const payment = await Payment.findOneAndUpdate(
        { paystackReference: reference },
        { status: 'success' },
        { new: true }
      );

      if (payment) {
        await Order.findByIdAndUpdate(payment.order, { status: 'confirmed' });
      }

      res.json({
        success: true,
        data: { payment },
        message: 'Payment verified successfully',
      });
    } else {
      await Payment.findOneAndUpdate(
        { paystackReference: reference },
        { status: 'failed' }
      );

      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Paystack verification error:', error);
    res.status(502).json({ success: false, message: 'Payment verification service error' });
  }
}
