import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Cake } from '../models/Cake.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-treats';

// Static cakes data from frontend
const staticCakes = [
  {
    id: '1',
    name: 'Classic Vanilla Dream',
    description: 'A light and fluffy vanilla sponge cake with vanilla buttercream frosting.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
    category: ['classic', 'vanilla', 'birthday'],
    flavors: ['vanilla', 'buttercream'],
    toppings: ['sprinkles', 'berries', 'chocolate shavings'],
    sizes: ['6"', '8"', '10"'],
    rating: 4.7,
    reviews: 128,
    bestseller: true
  },
  {
    id: '2',
    name: 'Chocolate Indulgence',
    description: 'Rich chocolate cake with dark chocolate ganache and chocolate buttercream.',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop',
    category: ['chocolate', 'indulgent'],
    flavors: ['chocolate', 'ganache'],
    toppings: ['chocolate curls', 'cherries', 'gold dust'],
    sizes: ['6"', '8"', '10"'],
    rating: 4.9,
    reviews: 156
  },
  {
    id: '3',
    name: 'Strawberry Bliss',
    description: 'Light vanilla cake with layers of fresh strawberries and whipped cream.',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop',
    category: ['fruit', 'summer', 'light'],
    flavors: ['vanilla', 'strawberry'],
    toppings: ['fresh strawberries', 'whipped cream', 'white chocolate'],
    sizes: ['6"', '8"', '10"'],
    rating: 4.8,
    reviews: 98,
    bestseller: true
  },
  {
    id: '4',
    name: 'Red Velvet Love',
    description: 'Classic red velvet cake with cream cheese frosting and subtle cocoa flavor.',
    price: 2700,
    image: 'https://images.unsplash.com/photo-1586195831800-24f14c992cea?w=800&auto=format&fit=crop',
    category: ['classic', 'red velvet', 'celebration'],
    flavors: ['red velvet', 'cream cheese'],
    toppings: ['white chocolate shavings', 'red velvet crumbs', 'roses'],
    sizes: ['6"', '8"', '10"'],
    rating: 4.6,
    reviews: 112
  },
  {
    id: '5',
    name: 'Lemon Raspberry Delight',
    description: 'Tangy lemon cake with raspberry filling and lemon buttercream.',
    price: 2900,
    image: 'https://images.unsplash.com/photo-1535254973219-607245c8cc6b?w=800&auto=format&fit=crop',
    category: ['fruit', 'summer', 'citrus'],
    flavors: ['lemon', 'raspberry'],
    toppings: ['fresh raspberries', 'lemon zest', 'edible flowers'],
    sizes: ['6"', '8"', '10"'],
    rating: 4.8,
    reviews: 79
  },
  {
    id: '6',
    name: 'Caramel Drizzle',
    description: 'Moist caramel cake with salted caramel filling and caramel buttercream.',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=800&auto=format&fit=crop',
    category: ['caramel', 'indulgent', 'celebration'],
    flavors: ['caramel', 'vanilla'],
    toppings: ['caramel drizzle', 'caramel popcorn', 'gold flakes'],
    sizes: ['6"', '8"', '10"'],
    rating: 4.9,
    reviews: 64,
    bestseller: true
  },
  {
    id: '7',
    name: 'Matcha Green Tea Dream',
    description: 'Light and refreshing matcha green tea cake with white chocolate cream.',
    price: 3100,
    image: 'https://images.unsplash.com/photo-1583516858982-f70077361043?w=800&auto=format&fit=crop',
    category: ['specialty', 'asian-inspired'],
    flavors: ['matcha', 'white chocolate'],
    toppings: ['matcha powder', 'white chocolate shavings', 'edible flowers'],
    sizes: ['6"', '8"', '10"'],
    rating: 4.7,
    reviews: 45
  },
  {
    id: '8',
    name: 'Tiramisu Delight',
    description: 'Classic Italian tiramisu-inspired cake with coffee-soaked layers.',
    price: 3150,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&auto=format&fit=crop',
    category: ['coffee', 'italian'],
    flavors: ['coffee', 'mascarpone'],
    toppings: ['cocoa powder', 'chocolate curls', 'coffee beans'],
    sizes: ['6"', '8"', '10"'],
    rating: 4.9,
    reviews: 87,
    bestseller: true
  },
  {
    id: '9',
    name: 'Tropical Paradise',
    description: 'Coconut cake with passion fruit curd and mango mousse.',
    price: 3300,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop',
    category: ['tropical', 'fruit'],
    flavors: ['coconut', 'passion fruit', 'mango'],
    toppings: ['fresh tropical fruit', 'toasted coconut', 'white chocolate'],
    sizes: ['6"', '8"', '10"'],
    rating: 4.8,
    reviews: 56
  }
];

async function migrateCakes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Checking for existing cakes...');
    const existingCount = await Cake.countDocuments();

    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing cakes. Clearing database...`);
      await Cake.deleteMany({});
    }

    console.log('Inserting static cakes...');
    await Cake.insertMany(staticCakes);
    console.log(`Successfully migrated ${staticCakes.length} cakes to MongoDB`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateCakes();
