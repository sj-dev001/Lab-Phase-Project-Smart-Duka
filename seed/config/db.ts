// FILE: seed/config/db.ts
import mongoose from 'mongoose';
import { config } from 'dotenv';

config({ path: '../../.env' });

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in env');
  return mongoose.connect(uri);
}
