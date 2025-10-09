
import type { CartItem as CartItemType } from '@/context/cart-context';

export type MenuItem = {
  id: string; // Changed from number to string to match Firestore ID
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
  imageId?: string; // Placeholder image ID
  userImageUrl?: string; // Custom uploaded image URL
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

// This is now just for local data, not for the main menu display which is fetched from Firestore
export const localMenuItems: Omit<MenuItem, 'id'>[] = [
  {
    name: 'Sunrise Bruschetta',
    description:
      'Toasted artisan bread topped with a vibrant mix of diced tomatoes, fresh basil, garlic, and a drizzle of extra virgin olive oil.',
    price: 12.5,
    category: 'Appetizers',
    dietaryTags: ['vegetarian', 'vegan', 'dairy-free'],
    imageId: 'bruschetta',
  },
  {
    name: 'Golden Quinoa Salad',
    description:
      'A refreshing salad with tri-color quinoa, cucumber, cherry tomatoes, and a zesty lemon-herb vinaigrette.',
    price: 15.0,
    category: 'Salads',
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    imageId: 'quinoa-salad',
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
