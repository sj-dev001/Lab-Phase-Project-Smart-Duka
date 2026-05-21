import mongoose from 'mongoose';
import { connectDB } from './config/db';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smartduka.com',
    password: 'admin123',
    role: 'admin',
  });

  const customer = await User.create({
    name: 'Jane Customer',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer',
  });

  const vendor = await User.create({
    name: 'John Vendor',
    email: 'john@example.com',
    password: 'password123',
    role: 'vendor',
    vendorProfile: {
      storeName: 'John\'s Electronics',
      description: 'Quality electronics and gadgets',
      logo: '',
      phone: '+254712345678',
      address: '123 Kenyatta Ave, Nairobi',
      approved: true,
    },
  });

  const categories = await Category.insertMany([
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
    { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden' },
    { name: 'Food & Beverages', slug: 'food-beverages', description: 'Groceries and drinks' },
    { name: 'Health & Beauty', slug: 'health-beauty', description: 'Personal care products' },
  ]);

  await Product.insertMany([
    {
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
      price: 4500,
      images: ['https://placehold.co/600x400?text=Headphones'],
      category: categories[0]._id,
      vendor: vendor._id,
      stock: 50,
    },
    {
      name: 'Smart Watch Pro',
      description: 'Fitness tracker with heart rate monitor, GPS, and smartphone notifications.',
      price: 8500,
      images: ['https://placehold.co/600x400?text=Smart+Watch'],
      category: categories[0]._id,
      vendor: vendor._id,
      stock: 30,
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: 'Waterproof portable speaker with deep bass and 12-hour playtime.',
      price: 3200,
      images: ['https://placehold.co/600x400?text=Speaker'],
      category: categories[0]._id,
      vendor: vendor._id,
      stock: 40,
    },
    {
      name: 'USB-C Hub 7-in-1',
      description: 'Multi-port adapter with HDMI, USB-A, SD card reader, and PD charging.',
      price: 2500,
      images: ['https://placehold.co/600x400?text=USB+Hub'],
      category: categories[0]._id,
      vendor: vendor._id,
      stock: 100,
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with blue switches for tactile feedback.',
      price: 5500,
      images: ['https://placehold.co/600x400?text=Keyboard'],
      category: categories[0]._id,
      vendor: vendor._id,
      stock: 25,
    },
  ]);

  console.log('Database seeded successfully');
  console.log('---');
  console.log('Admin: admin@smartduka.com / admin123');
  console.log('Vendor: john@example.com / password123');
  console.log('Customer: jane@example.com / password123');

  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
