
import type { CartItem as CartItemType } from '@/context/cart-context';

export type MenuItem = {
  id: string; 
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
  imageId?: string;
  userImageUrl?: string; 
};

export type CartItem = MenuItem & {
  quantity: number;
};

export type Order = {
  id: string; 
  userId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  items: CartItemType[];
  orderType: 'pickup' | 'delivery';
  address: string | null;
  paymentMethod: 'card' | 'cod';
};

export type Customer = {
    id: string; 
    name: string;
    email: string;
    joinedDate: string;
    scanCredits?: number;
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
  name: 'ChefBot Bistro',
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


export const testimonials: Testimonial[] = [
  {
    quote:
      'An absolute gem! The food was exquisite, the service was impeccable, and the atmosphere was cozy and inviting. The Mushroom Risotto is a must-try!',
    author: 'Jessica Miller',
  },
  {
    quote:
      'I came here for a special occasion and ChefBot exceeded all my expectations. The personalized recommendations were spot on. A truly 5-star experience.',
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

    