export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
  imageId: string;
};

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

export const restaurantInfo: RestaurantInfoType = {
  name: "GastronomicAI Bistro",
  address: "123 Culinary Lane, Foodie City, 10101",
  contact: "(555) 123-4567",
  openingHours: [
    "Mon - Fri: 11:00 AM - 10:00 PM",
    "Sat - Sun: 10:00 AM - 11:00 PM",
  ],
  reviews: {
    rating: 4.5,
    count: 250,
  },
};

export const dietaryOptions: string[] = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
];

export const menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Sunrise Bruschetta',
      description: 'Toasted artisan bread topped with a vibrant mix of diced tomatoes, fresh basil, garlic, and a drizzle of extra virgin olive oil.',
      price: 12.50,
      category: 'Appetizers',
      dietaryTags: ['vegetarian', 'vegan', 'dairy-free'],
      imageId: 'bruschetta'
    },
    {
      id: 2,
      name: 'Golden Quinoa Salad',
      description: 'A refreshing salad with tri-color quinoa, cucumber, cherry tomatoes, and a zesty lemon-herb vinaigrette.',
      price: 15.00,
      category: 'Salads',
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
      imageId: 'quinoa-salad'
    },
    {
      id: 3,
      name: 'Crimson Lentil Soup',
      description: 'A hearty and flavorful soup made with red lentils, carrots, and a blend of aromatic spices.',
      price: 9.00,
      category: 'Soups',
      dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
      imageId: 'lentil-soup'
    },
    {
      id: 4,
      name: 'Forest Mushroom Risotto',
      description: 'Creamy Arborio rice cooked with a medley of wild mushrooms, parmesan cheese, and a touch of white truffle oil.',
      price: 22.00,
      category: 'Main Courses',
      dietaryTags: ['vegetarian', 'gluten-free'],
      imageId: 'mushroom-risotto'
    },
    {
      id: 5,
      name: 'Sizzling Saffron Paella',
      description: 'A classic Spanish dish with saffron-infused rice, shrimp, mussels, and chicken, cooked to perfection.',
      price: 28.00,
      category: 'Main Courses',
      dietaryTags: ['dairy-free'],
      imageId: 'paella'
    },
    {
      id: 6,
      name: 'Char-Grilled Ribeye Steak',
      description: 'A 12oz ribeye steak, seasoned and grilled to your liking, served with roasted garlic mashed potatoes and seasonal vegetables.',
      price: 35.00,
      category: 'Main Courses',
      dietaryTags: ['gluten-free'],
      imageId: 'ribeye-steak'
    },
    {
        id: 7,
        name: 'Molten Lava Chocolate Cake',
        description: 'A decadent chocolate cake with a warm, gooey center, served with a scoop of vanilla bean ice cream.',
        price: 11.00,
        category: 'Desserts',
        dietaryTags: ['vegetarian'],
        imageId: 'lava-cake'
    },
    {
        id: 8,
        name: 'Avocado Toast Zenith',
        description: 'Thick-cut sourdough toast with creamy avocado, chili flakes, and a sprinkle of sea salt. A perfect start.',
        price: 14.00,
        category: 'Appetizers',
        dietaryTags: ['vegetarian', 'dairy-free'],
        imageId: 'avocado-toast'
    }
];
