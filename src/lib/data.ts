
import type { CartItem as CartItemType } from '@/context/cart-context';

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
  imageId: string;
};

export type CartItem = MenuItem & {
  quantity: number;
};

export type Order = {
  id: string; // Firestore document ID
  userId: string;
  customerName: string;
  customerEmail: string;
  date: string; // ISO string
  total: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  items: CartItemType[];
  orderType: 'pickup' | 'delivery';
  address: string | null;
  paymentMethod: 'card' | 'cod';
};

export type Customer = {
    id: string; // Firestore document ID (which is user.uid)
    name: string;
    email: string;
    joinedDate: string; // ISO string
}

export type RestaurantInfoType = {
  name: string;
  address: string;
  contact: string;
  openingHours: string[];
  reviews: {
    rating: number;
    count: number;
  };
};

export type Testimonial = {
  quote: string;
  author: string;
};

export const restaurantInfo: RestaurantInfoType = {
  name: 'GastronomicAI Bistro',
  address: '123 Culinary Lane, Foodie City, 10101',
  contact: '(555) 123-4567',
  openingHours: [
    'Mon - Fri: 11:00 AM - 10:00 PM',
    'Sat - Sun: 10:00 AM - 11:00 PM',
  ],
  reviews: {
    rating: 4.5,
    count: 250,
  },
};

export const dietaryOptions: string[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
];

export const categories = ['Appetizers', 'Salads', 'Soups', 'Main Courses', 'Desserts'];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Sunrise Bruschetta',
    description:
      'Toasted artisan bread topped with a vibrant mix of diced tomatoes, fresh basil, garlic, and a drizzle of extra virgin olive oil.',
    price: 12.5,
    category: 'Appetizers',
    dietaryTags: ['vegetarian', 'vegan', 'dairy-free'],
    imageId: 'bruschetta',
  },
  {
    id: 2,
    name: 'Golden Quinoa Salad',
    description:
      'A refreshing salad with tri-color quinoa, cucumber, cherry tomatoes, and a zesty lemon-herb vinaigrette.',
    price: 15.0,
    category: 'Salads',
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    imageId: 'quinoa-salad',
  },
  {
    id: 3,
    name: 'Crimson Lentil Soup',
    description:
      'A hearty and flavorful soup made with red lentils, carrots, and a blend of aromatic spices.',
    price: 9.0,
    category: 'Soups',
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    imageId: 'lentil-soup',
  },
  {
    id: 4,
    name: 'Forest Mushroom Risotto',
    description:
      'Creamy Arborio rice cooked with a medley of wild mushrooms, parmesan cheese, and a touch of white truffle oil.',
    price: 22.0,
    category: 'Main Courses',
    dietaryTags: ['vegetarian', 'gluten-free'],
    imageId: 'mushroom-risotto',
  },
  {
    id: 5,
    name: 'Sizzling Saffron Paella',
    description:
      'A classic Spanish dish with saffron-infused rice, shrimp, mussels, and chicken, cooked to perfection.',
    price: 28.0,
    category: 'Main Courses',
    dietaryTags: ['dairy-free'],
    imageId: 'paella',
  },
  {
    id: 6,
    name: 'Char-Grilled Ribeye Steak',
    description:
      'A 12oz ribeye steak, seasoned and grilled to your liking, served with roasted garlic mashed potatoes and seasonal vegetables.',
    price: 35.0,
    category: 'Main Courses',
    dietaryTags: ['gluten-free'],
    imageId: 'ribeye-steak',
  },
  {
    id: 7,
    name: 'Molten Lava Chocolate Cake',
    description:
      'A decadent chocolate cake with a warm, gooey center, served with a scoop of vanilla bean ice cream.',
    price: 11.0,
    category: 'Desserts',
    dietaryTags: ['vegetarian'],
    imageId: 'lava-cake',
  },
  {
    id: 8,
    name: 'Avocado Toast Zenith',
    description:
      'Thick-cut sourdough toast with creamy avocado, chili flakes, and a sprinkle of sea salt. A perfect start.',
    price: 14.0,
    category: 'Appetizers',
    dietaryTags: ['vegetarian', 'dairy-free'],
    imageId: 'avocado-toast',
  },
  {
    id: 9,
    name: 'Seared Scallops',
    description:
      'Pan-seared jumbo scallops served with a lemon-butter sauce and asparagus.',
    price: 18.0,
    category: 'Appetizers',
    dietaryTags: ['gluten-free'],
    imageId: 'scallops',
  },
  {
    id: 10,
    name: 'Duck Confit',
    description:
      'Slow-cooked duck leg with a crispy skin, served on a bed of lentils.',
    price: 26.0,
    category: 'Main Courses',
    dietaryTags: ['dairy-free', 'gluten-free'],
    imageId: 'duck-confit',
  },
  {
    id: 11,
    name: 'Tiramisu',
    description:
      'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
    price: 10.0,
    category: 'Desserts',
    dietaryTags: ['vegetarian'],
    imageId: 'tiramisu',
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      'An absolute gem! The food was exquisite, the service was impeccable, and the atmosphere was cozy and inviting. The Mushroom Risotto is a must-try!',
    author: 'Jessica Miller',
  },
  {
    quote:
      'I came here for a special occasion and GastronomicAI exceeded all my expectations. The personalized recommendations were spot on. A truly 5-star experience.',
    author: 'David Chen',
  },
  {
    quote:
      'As a vegan, it’s often hard to find exciting options, but this place is a dream. The Golden Quinoa Salad was fresh and bursting with flavor. I’ll be back!',
    author: 'Sarah Jenkins',
  },
];

export const galleryImageIds: string[] = [
  'gallery-1',
  'gallery-2',
  'gallery-3',
  'gallery-4',
  'gallery-5',
  'gallery-6',
];
