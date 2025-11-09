
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

export const testimonials: Testimonial[] = [
  {
    quote: "The food was absolutely wonderful, from preparation to presentation, very pleasing. We especially enjoyed the special bar drinks, the cucumber/cilantro infused vodka martini was great (even took photos so we could try to replicate at home).",
    author: "Aisha R."
  },
  {
    quote: "This is my absolute favorite restaurant. The food is always fantastic and no matter what I order I am always delighted with my meal! Servers are also great and always efficient, happy and polite. Can’t wait to return and wouldn’t hesitate to recommend to anyone looking for somewhere to eat.",
    author: "Omar K."
  },
  {
    quote: "Excellent food. Menu is extensive and seasonal to a particularly high standard. Definitely fine dining. It can be expensive but worth it and they do different deals on different nights so it’s worth checking them out before you book. Highly recommended.",
    author: "Fatima S."
  },
   {
    quote: "This place is great! Atmosphere is chill and cool but the staff is also really friendly. They know what they’re doing and what they’re talking about, and you can tell making the customers happy is their main priority. Food is pretty good, some classics and some twists, and for their prices it’s 100% worth it.",
    author: "Yusuf A."
  }
];
    
