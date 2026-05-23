import mongoose from 'mongoose';
import { connectDB } from './config/db';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';

const imageSwatches: Array<[string, string]> = [
  ['065f46', 'ffffff'],
  ['047857', 'ffffff'],
  ['0f766e', 'ffffff'],
  ['f97316', 'ffffff'],
  ['f59e0b', '111827'],
  ['111827', 'ffffff'],
];

const imageFor = (label: string) => {
  const colorIndex = label
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % imageSwatches.length;
  const [background, foreground] = imageSwatches[colorIndex] || imageSwatches[0];
  const text = encodeURIComponent(label).replace(/%20/g, '+');

  return `https://placehold.co/900x700/${background}/${foreground}/png?text=${text}`;
};

const categoriesSeed = [
  { name: 'Electronics', slug: 'electronics', description: 'Phones, accessories, audio, and smart devices' },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, bags, and accessories' },
  { name: 'Home & Garden', slug: 'home-garden', description: 'Decor, kitchenware, bedding, and home essentials' },
  { name: 'Food & Beverages', slug: 'food-beverages', description: 'Groceries, snacks, drinks, and pantry staples' },
  { name: 'Health & Beauty', slug: 'health-beauty', description: 'Skin care, personal care, wellness, and grooming' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Fitness gear, outdoor supplies, and active lifestyle products' },
  { name: 'Books & Stationery', slug: 'books-stationery', description: 'Books, notebooks, office tools, and study essentials' },
  { name: 'Baby & Kids', slug: 'baby-kids', description: 'Kids clothing, toys, school items, and baby care' },
];

const vendorSeeds = [
  {
    name: 'John Vendor',
    email: 'john@example.com',
    storeName: 'John\'s Electronics',
    description: 'Quality electronics and gadgets',
    logoQuery: 'electronics store logo',
    phone: '+254712345678',
    address: '123 Kenyatta Ave, Nairobi',
  },
  {
    name: 'Amina Vendor',
    email: 'amina@example.com',
    storeName: 'Amina Style House',
    description: 'Modern fashion, accessories, and lifestyle essentials',
    logoQuery: 'fashion boutique',
    phone: '+254798765432',
    address: 'Village Market, Nairobi',
  },
  {
    name: 'Grace Vendor',
    email: 'grace@example.com',
    storeName: 'Grace Home Finds',
    description: 'Warm home goods, decor, groceries, and self care picks',
    logoQuery: 'home decor shop',
    phone: '+254722456789',
    address: 'Westlands, Nairobi',
  },
  {
    name: 'Brian Vendor',
    email: 'brian@example.com',
    storeName: 'Peak Sports Kenya',
    description: 'Reliable fitness, training, and outdoor equipment',
    logoQuery: 'sports shop',
    phone: '+254733456789',
    address: 'Ngong Road, Nairobi',
  },
  {
    name: 'Lucy Vendor',
    email: 'lucy@example.com',
    storeName: 'Lucy Reads & Writes',
    description: 'Books, stationery, and desk essentials for study and work',
    logoQuery: 'bookstore stationery',
    phone: '+254744456789',
    address: 'Moi Avenue, Nairobi',
  },
  {
    name: 'Mary Vendor',
    email: 'mary@example.com',
    storeName: 'Little Steps Duka',
    description: 'Thoughtful baby, kids, and family essentials',
    logoQuery: 'kids store',
    phone: '+254755456789',
    address: 'Thika Road Mall, Nairobi',
  },
];

const productSeeds = [
  ['Wireless Bluetooth Headphones', 'electronics', 'john@example.com', 4500, 50, 'Noise cancelling headphones with soft ear cushions and long battery life.', 'wireless headphones product'],
  ['Smart Watch Pro', 'electronics', 'john@example.com', 8500, 30, 'Fitness smartwatch with heart rate tracking, GPS, and phone notifications.', 'smart watch product'],
  ['Portable Bluetooth Speaker', 'electronics', 'john@example.com', 3200, 40, 'Water resistant speaker with deep bass and all-day playtime.', 'portable bluetooth speaker'],
  ['USB-C Hub 7-in-1', 'electronics', 'john@example.com', 2500, 100, 'Compact adapter with HDMI, USB, SD card reader, and fast charging support.', 'usb c hub adapter'],
  ['Mechanical Keyboard', 'electronics', 'john@example.com', 5500, 25, 'Tactile RGB mechanical keyboard built for typing, gaming, and office work.', 'mechanical keyboard'],
  ['Wireless Mouse', 'electronics', 'john@example.com', 1600, 70, 'Ergonomic wireless mouse with quiet clicks and adjustable DPI.', 'wireless mouse product'],
  ['Laptop Stand', 'electronics', 'john@example.com', 2800, 42, 'Foldable aluminum laptop stand for better posture and airflow.', 'laptop stand desk'],
  ['Fast Charging Power Bank', 'electronics', 'john@example.com', 3900, 55, 'High capacity power bank with dual USB output and fast charging.', 'power bank product'],
  ['Ring Light Kit', 'electronics', 'john@example.com', 3400, 36, 'LED ring light with tripod stand for content creation and video calls.', 'ring light tripod'],
  ['Wireless Earbuds', 'electronics', 'john@example.com', 4200, 60, 'Compact earbuds with charging case, clear calls, and balanced sound.', 'wireless earbuds product'],

  ['Linen Summer Shirt', 'fashion', 'amina@example.com', 2200, 35, 'Breathable linen shirt with a relaxed fit for warm days.', 'linen shirt fashion'],
  ['Leather Crossbody Bag', 'fashion', 'amina@example.com', 3900, 14, 'Compact everyday crossbody bag with premium stitching and adjustable strap.', 'leather crossbody bag'],
  ['Classic White Sneakers', 'fashion', 'amina@example.com', 4800, 22, 'Minimal low-top sneakers with cushioned soles for all-day comfort.', 'white sneakers product'],
  ['Denim Jacket', 'fashion', 'amina@example.com', 5200, 18, 'Classic denim jacket with structured seams and a comfortable fit.', 'denim jacket fashion'],
  ['Printed Maxi Dress', 'fashion', 'amina@example.com', 3600, 26, 'Flowing maxi dress with a vibrant print and easy weekend feel.', 'maxi dress fashion'],
  ['Cotton Hoodie', 'fashion', 'amina@example.com', 3100, 40, 'Soft cotton hoodie with a clean everyday silhouette.', 'cotton hoodie fashion'],
  ['Slim Chino Trousers', 'fashion', 'amina@example.com', 2800, 33, 'Smart casual chinos with stretch fabric and a tapered cut.', 'chino trousers fashion'],
  ['Leather Belt', 'fashion', 'amina@example.com', 1500, 80, 'Durable leather belt with a polished buckle for work or weekends.', 'leather belt product'],
  ['Aviator Sunglasses', 'fashion', 'amina@example.com', 1900, 44, 'Lightweight sunglasses with UV protection and a timeless frame.', 'aviator sunglasses'],
  ['Canvas Tote Bag', 'fashion', 'amina@example.com', 1200, 65, 'Reusable canvas tote bag for shopping, errands, and daily carry.', 'canvas tote bag'],

  ['Ceramic Dinner Set', 'home-garden', 'grace@example.com', 6200, 18, 'Elegant 16-piece ceramic dinner set for family meals and entertaining.', 'ceramic dinner set'],
  ['Woven Storage Basket', 'home-garden', 'grace@example.com', 1800, 44, 'Handwoven basket for blankets, laundry, toys, or living room styling.', 'woven storage basket'],
  ['Cotton Bedsheet Set', 'home-garden', 'grace@example.com', 3600, 31, 'Soft breathable cotton bedsheets with pillowcases for restful sleep.', 'cotton bedsheets'],
  ['Scented Candle Trio', 'home-garden', 'grace@example.com', 1400, 50, 'Three scented candles for warm, calm, and welcoming spaces.', 'scented candles product'],
  ['Nonstick Cookware Pan', 'home-garden', 'grace@example.com', 2600, 29, 'Durable nonstick pan for easy cooking and quick cleanup.', 'nonstick pan cookware'],
  ['Bamboo Cutting Board', 'home-garden', 'grace@example.com', 1300, 58, 'Strong bamboo cutting board for meal prep and serving.', 'bamboo cutting board'],
  ['Indoor Plant Pot', 'home-garden', 'grace@example.com', 950, 72, 'Minimal ceramic plant pot for desks, shelves, and windowsills.', 'ceramic plant pot'],
  ['Table Lamp', 'home-garden', 'grace@example.com', 4200, 20, 'Modern table lamp with warm lighting for bedside or workspaces.', 'modern table lamp'],
  ['Wall Clock', 'home-garden', 'grace@example.com', 2100, 37, 'Clean wall clock with bold numbers for home or office use.', 'wall clock home'],
  ['Microfiber Bath Towel Set', 'home-garden', 'grace@example.com', 2400, 46, 'Quick-dry towel set with plush texture and everyday durability.', 'bath towels product'],

  ['Arabica Coffee Beans', 'food-beverages', 'grace@example.com', 1200, 80, 'Freshly roasted Kenyan arabica beans with bright citrus notes.', 'arabica coffee beans'],
  ['Cold Pressed Juice Pack', 'food-beverages', 'grace@example.com', 1500, 9, 'Assorted cold pressed juices made with seasonal fruit.', 'cold pressed juice'],
  ['Premium Green Tea', 'food-beverages', 'grace@example.com', 850, 95, 'Smooth green tea leaves for a refreshing daily brew.', 'green tea product'],
  ['Organic Honey Jar', 'food-beverages', 'grace@example.com', 1100, 64, 'Pure golden honey for tea, breakfast, baking, and marinades.', 'organic honey jar'],
  ['Granola Breakfast Mix', 'food-beverages', 'grace@example.com', 950, 53, 'Crunchy oat granola with nuts, seeds, and dried fruit.', 'granola product'],
  ['Dark Chocolate Bar Pack', 'food-beverages', 'grace@example.com', 700, 88, 'Rich dark chocolate bars with smooth cocoa flavor.', 'dark chocolate bars'],
  ['Pasta Pantry Bundle', 'food-beverages', 'grace@example.com', 1600, 39, 'Assorted pasta pack for easy weeknight meals.', 'pasta package product'],
  ['Extra Virgin Olive Oil', 'food-beverages', 'grace@example.com', 1900, 41, 'Cold pressed olive oil for salads, cooking, and finishing dishes.', 'olive oil bottle'],
  ['Spice Starter Kit', 'food-beverages', 'grace@example.com', 1350, 47, 'Essential spices for everyday Kenyan and global cooking.', 'spice jars product'],
  ['Sparkling Water Case', 'food-beverages', 'grace@example.com', 1800, 57, 'Refreshing sparkling water cans for meals, office, and events.', 'sparkling water cans'],

  ['Botanical Face Serum', 'health-beauty', 'amina@example.com', 2600, 28, 'Lightweight hydrating serum with botanical extracts.', 'face serum skincare'],
  ['Natural Shea Body Butter', 'health-beauty', 'amina@example.com', 1700, 36, 'Rich whipped body butter with shea, coconut oil, and vanilla notes.', 'body butter skincare'],
  ['Daily Sunscreen SPF 50', 'health-beauty', 'amina@example.com', 2200, 60, 'Lightweight broad spectrum sunscreen for daily protection.', 'sunscreen skincare'],
  ['Aloe Vera Gel', 'health-beauty', 'amina@example.com', 950, 75, 'Cooling aloe gel for skin hydration and after-sun care.', 'aloe vera gel'],
  ['Charcoal Face Wash', 'health-beauty', 'amina@example.com', 1300, 48, 'Deep cleansing face wash designed for fresh, balanced skin.', 'face wash product'],
  ['Hair Growth Oil', 'health-beauty', 'amina@example.com', 1600, 52, 'Nourishing hair oil blend for scalp care and shine.', 'hair oil product'],
  ['Electric Toothbrush', 'health-beauty', 'john@example.com', 3400, 24, 'Rechargeable toothbrush with gentle modes and travel case.', 'electric toothbrush'],
  ['Beard Grooming Kit', 'health-beauty', 'amina@example.com', 2800, 21, 'Complete beard care kit with oil, comb, balm, and trimming scissors.', 'beard grooming kit'],
  ['Hand Cream Duo', 'health-beauty', 'amina@example.com', 900, 67, 'Two nourishing hand creams for soft everyday care.', 'hand cream product'],
  ['Essential Oil Diffuser', 'health-beauty', 'grace@example.com', 3100, 33, 'Compact diffuser with soft mist and ambient light.', 'essential oil diffuser'],

  ['Yoga Mat', 'sports-outdoors', 'brian@example.com', 2400, 45, 'Non-slip yoga mat with comfortable cushioning for home workouts.', 'yoga mat product'],
  ['Adjustable Dumbbell Set', 'sports-outdoors', 'brian@example.com', 7800, 16, 'Space-saving dumbbell set for strength training at home.', 'adjustable dumbbells'],
  ['Resistance Bands Set', 'sports-outdoors', 'brian@example.com', 1300, 90, 'Color coded resistance bands for stretching and strength work.', 'resistance bands'],
  ['Running Waist Pack', 'sports-outdoors', 'brian@example.com', 1100, 58, 'Lightweight waist pack for phone, keys, and small essentials.', 'running waist pack'],
  ['Insulated Water Bottle', 'sports-outdoors', 'brian@example.com', 1800, 84, 'Double wall bottle that keeps drinks cold or hot for hours.', 'insulated water bottle'],
  ['Camping Lantern', 'sports-outdoors', 'brian@example.com', 2600, 27, 'Rechargeable lantern for camping, power outages, and outdoor nights.', 'camping lantern'],
  ['Football Training Ball', 'sports-outdoors', 'brian@example.com', 2100, 38, 'Durable football for training sessions and weekend matches.', 'football ball product'],
  ['Cycling Gloves', 'sports-outdoors', 'brian@example.com', 1250, 62, 'Padded cycling gloves for grip, comfort, and hand protection.', 'cycling gloves'],
  ['Jump Rope Pro', 'sports-outdoors', 'brian@example.com', 950, 76, 'Speed jump rope for cardio, warmups, and agility training.', 'jump rope product'],
  ['Hiking Backpack', 'sports-outdoors', 'brian@example.com', 4900, 19, 'Comfortable daypack with compartments for hikes and travel.', 'hiking backpack'],

  ['Hardcover Notebook', 'books-stationery', 'lucy@example.com', 650, 120, 'Ruled hardcover notebook for class notes, meetings, and journaling.', 'hardcover notebook'],
  ['Gel Pen Set', 'books-stationery', 'lucy@example.com', 550, 140, 'Smooth gel pens in assorted colors for school and office work.', 'gel pens set'],
  ['Desk Organizer', 'books-stationery', 'lucy@example.com', 1450, 49, 'Compact organizer for pens, sticky notes, clips, and desk tools.', 'desk organizer stationery'],
  ['Academic Planner', 'books-stationery', 'lucy@example.com', 1200, 71, 'Undated planner for goals, deadlines, weekly schedules, and tasks.', 'planner notebook'],
  ['Sticky Notes Bundle', 'books-stationery', 'lucy@example.com', 400, 150, 'Colorful sticky notes for reminders, bookmarks, and quick ideas.', 'sticky notes'],
  ['Watercolor Paint Set', 'books-stationery', 'lucy@example.com', 1900, 35, 'Portable watercolor set for art practice and creative projects.', 'watercolor paint set'],
  ['Business Book', 'books-stationery', 'lucy@example.com', 1800, 24, 'Practical business book for entrepreneurs and growing teams.', 'business book'],
  ['Children Story Book', 'books-stationery', 'lucy@example.com', 900, 40, 'Illustrated story book with warm lessons for young readers.', 'children story book'],
  ['File Folder Pack', 'books-stationery', 'lucy@example.com', 750, 88, 'Durable folders for organizing documents, invoices, and schoolwork.', 'file folders stationery'],
  ['Desk Calendar', 'books-stationery', 'lucy@example.com', 850, 54, 'Simple desk calendar for planning months at a glance.', 'desk calendar'],

  ['Baby Blanket', 'baby-kids', 'mary@example.com', 1700, 44, 'Soft baby blanket for naps, stroller rides, and gifting.', 'baby blanket'],
  ['Kids Lunch Box', 'baby-kids', 'mary@example.com', 1200, 70, 'Leak resistant lunch box with compartments for school meals.', 'kids lunch box'],
  ['Wooden Puzzle Toy', 'baby-kids', 'mary@example.com', 1500, 37, 'Colorful wooden puzzle that supports early learning and motor skills.', 'wooden puzzle toy'],
  ['School Backpack', 'baby-kids', 'mary@example.com', 2800, 32, 'Durable kids backpack with padded straps and roomy compartments.', 'kids school backpack'],
  ['Baby Care Kit', 'baby-kids', 'mary@example.com', 2300, 26, 'Essential baby grooming kit with safe daily care tools.', 'baby care kit'],
  ['Cotton Kids Pajamas', 'baby-kids', 'mary@example.com', 1800, 46, 'Soft cotton pajamas with playful prints for cozy nights.', 'kids pajamas'],
  ['Building Blocks Set', 'baby-kids', 'mary@example.com', 2600, 29, 'Creative building blocks set for open-ended play.', 'building blocks toy'],
  ['Training Cup', 'baby-kids', 'mary@example.com', 800, 92, 'Easy grip training cup with spill resistant lid.', 'baby training cup'],
  ['Kids Rain Boots', 'baby-kids', 'mary@example.com', 2100, 34, 'Waterproof rain boots with bright colors and sturdy soles.', 'kids rain boots'],
  ['Plush Teddy Bear', 'baby-kids', 'mary@example.com', 1600, 41, 'Soft plush teddy bear for cuddles, gifts, and nursery decor.', 'plush teddy bear'],
] as const;

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  await User.create({
    name: 'Admin User',
    email: 'admin@smartduka.com',
    password: 'admin123',
    role: 'admin',
  });

  await User.create({
    name: 'Jane Customer',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer',
  });

  const vendors = await Promise.all(
    vendorSeeds.map((vendor) =>
      User.create({
        name: vendor.name,
        email: vendor.email,
        password: 'password123',
        role: 'vendor',
        vendorProfile: {
          storeName: vendor.storeName,
          description: vendor.description,
          logo: imageFor(vendor.logoQuery),
          phone: vendor.phone,
          address: vendor.address,
          approved: true,
        },
      })
    )
  );

  const categories = await Category.insertMany(categoriesSeed);

  const categoryBySlug = new Map(categories.map((category) => [category.slug, category._id]));
  const vendorByEmail = new Map(vendors.map((vendor) => [vendor.email, vendor._id]));

  const products = productSeeds.map(
    ([name, categorySlug, vendorEmail, price, stock, description], index) => ({
      name,
      description,
      price,
      images: [imageFor(name)],
      category: categoryBySlug.get(categorySlug)!,
      vendor: vendorByEmail.get(vendorEmail)!,
      stock,
      rating: Number((4.1 + (index % 9) * 0.1).toFixed(1)),
      numReviews: 8 + ((index * 7) % 64),
      isActive: true,
    })
  );

  await Product.insertMany(products);

  console.log(`Database seeded successfully with ${products.length} products`);
  console.log('---');
  console.log('Admin: admin@smartduka.com / admin123');
  console.log('Vendor: john@example.com / password123');
  console.log('Vendor: amina@example.com / password123');
  console.log('Vendor: grace@example.com / password123');
  console.log('Vendor: brian@example.com / password123');
  console.log('Vendor: lucy@example.com / password123');
  console.log('Vendor: mary@example.com / password123');
  console.log('Customer: jane@example.com / password123');

  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
