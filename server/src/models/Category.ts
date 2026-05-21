import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', categorySchema);
