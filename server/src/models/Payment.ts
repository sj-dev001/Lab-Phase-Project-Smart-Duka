import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  paystackReference: string;
  paystackAccessCode: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'KES' },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    paystackReference: { type: String },
    paystackAccessCode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', paymentSchema);
