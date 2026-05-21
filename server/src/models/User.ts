import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'vendor' | 'admin';
  isActive: boolean;
  vendorProfile?: {
    storeName: string;
    description: string;
    logo: string;
    phone: string;
    address: string;
    approved: boolean;
  };
  wishlist: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
    isActive: { type: Boolean, default: true },
    vendorProfile: {
      storeName: { type: String, trim: true },
      description: { type: String },
      logo: { type: String },
      phone: { type: String },
      address: { type: String },
      approved: { type: Boolean, default: false },
    },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model<IUser>('User', userSchema);
