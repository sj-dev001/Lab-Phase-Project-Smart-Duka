import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  stock: number;
  rating: number;
  numReviews: number;
  isActive: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ price: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
