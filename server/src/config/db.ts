import mongoose from 'mongoose';
import { env } from './env';

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.MONGODB_URI).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  const conn = await connectionPromise;
  console.log(`MongoDB connected: ${conn.connection.host}`);
}
