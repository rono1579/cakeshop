export interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string[];
  flavors: string[];
  toppings: string[];
  sizes: string[];
  rating: number;
  reviews: number;
  bestseller?: boolean;
}

export const cakes: Cake[] = [
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

export interface CakeCustomization {
  sizes: SizeOption[];
  flavors: FlavorOption[];
  frostings: FrostingOption[];
  fillings: FillingOption[];
  toppings: ToppingOption[];
  decorations: DecorationOption[];
}

interface SizeOption {
  id: string;
  name: string;
  serves: string;
  priceModifier: number;
  image: string;
}

interface FlavorOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  image: string;
}

interface FrostingOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  color?: string;
  image: string;
}

interface FillingOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  image: string;
}

interface ToppingOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  image: string;
}

interface DecorationOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  image: string;
}

export const cakeCustomizationOptions: CakeCustomization = {
  sizes: [
    {
      id: 'size-6',
      name: '6" Round',
      serves: '8-10 people',
      priceModifier: 0,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'
    },
    {
      id: 'size-8',
      name: '8" Round',
      serves: '12-16 people',
      priceModifier: 800,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'
    },
    {
      id: 'size-10',
      name: '10" Round',
      serves: '20-24 people',
      priceModifier: 1500,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'
    }
  ],
  flavors: [
    {
      id: 'flavor-vanilla',
      name: 'Vanilla',
      description: 'Classic light and fluffy vanilla cake',
      priceModifier: 0,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'
    },
    {
      id: 'flavor-chocolate',
      name: 'Chocolate',
      description: 'Rich and moist chocolate cake',
      priceModifier: 300,
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=200&auto=format&fit=crop'
    },
    {
      id: 'flavor-redvelvet',
      name: 'Red Velvet',
      description: 'Classic red velvet with subtle cocoa flavor',
      priceModifier: 400,
      image: 'https://images.unsplash.com/photo-1586195831800-24f14c992cea?w=200&auto=format&fit=crop'
    },
    {
      id: 'flavor-lemon',
      name: 'Lemon',
      description: 'Tangy and refreshing lemon cake',
      priceModifier: 350,
      image: 'https://images.unsplash.com/photo-1535254973219-607245c8cc6b?w=200&auto=format&fit=crop'
    }
  ],
  frostings: [
    {
      id: 'frosting-buttercream',
      name: 'Vanilla Buttercream',
      description: 'Smooth and creamy vanilla buttercream',
      priceModifier: 0,
      color: '#f8f8e8',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'
    },
    {
      id: 'frosting-chocolate',
      name: 'Chocolate Buttercream',
      description: 'Rich chocolate buttercream',
      priceModifier: 250,
      color: '#3c2317',
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=200&auto=format&fit=crop'
    },
    {
      id: 'frosting-creamcheese',
      name: 'Cream Cheese',
      description: 'Tangy cream cheese frosting',
      priceModifier: 300,
      color: '#f5f5f5',
      image: 'https://images.unsplash.com/photo-1586195831800-24f14c992cea?w=200&auto=format&fit=crop'
    }
  ],
  fillings: [
    {
      id: 'filling-none',
      name: 'None',
      description: 'No filling, just layers of cake and frosting',
      priceModifier: 0,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'
    },
    {
      id: 'filling-strawberry',
      name: 'Strawberry',
      description: 'Fresh strawberry preserves',
      priceModifier: 400,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&auto=format&fit=crop'
    },
    {
      id: 'filling-chocolate',
      name: 'Chocolate Ganache',
      description: 'Rich chocolate ganache',
      priceModifier: 450,
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=200&auto=format&fit=crop'
    },
    {
      id: 'filling-lemon',
      name: 'Lemon Curd',
      description: 'Tangy lemon curd',
      priceModifier: 400,
      image: 'https://images.unsplash.com/photo-1535254973219-607245c8cc6b?w=200&auto=format&fit=crop'
    }
  ],
  toppings: [
    {
      id: 'topping-none',
      name: 'None',
      description: 'Just frosting',
      priceModifier: 0,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'
    },
    {
      id: 'topping-strawberries',
      name: 'Fresh Strawberries',
      description: 'Fresh strawberry slices on top',
      priceModifier: 500,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&auto=format&fit=crop'
    },
    {
      id: 'topping-chocolate',
      name: 'Chocolate Shavings',
      description: 'Elegant chocolate curls and shavings',
      priceModifier: 400,
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=200&auto=format&fit=crop'
    },
    {
      id: 'topping-sprinkles',
      name: 'Sprinkles',
      description: 'Colorful sprinkles for a fun look',
      priceModifier: 200,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'
    }
  ],
  decorations: [
    {
      id: 'deco-none',
      name: 'None',
      description: 'No additional decorations',
      priceModifier: 0,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'
    },
    {
      id: 'deco-flowers',
      name: 'Edible Flowers',
      description: 'Beautiful edible flowers',
      priceModifier: 600,
      image: 'https://images.unsplash.com/photo-1535254973219-607245c8cc6b?w=200&auto=format&fit=crop'
    },
    {
      id: 'deco-message',
      name: 'Custom Message',
      description: 'Personalized message written on the cake',
      priceModifier: 300,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop'
    },
    {
      id: 'deco-topper',
      name: 'Cake Topper',
      description: 'Decorative cake topper (various options available)',
      priceModifier: 700,
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=200&auto=format&fit=crop'
    }
  ]
};
