
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


export const galleryImageIds: string[] = [
  'gallery-1',
  'gallery-2',
  'gallery-3',
  'gallery-4',
  'gallery-5',
  'gallery-6',
];

    
