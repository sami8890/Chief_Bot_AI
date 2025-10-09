
'use client';

import { Header } from '@/components/layout/header';
import { Hero } from '@/components/hero';
import { RestaurantInfo } from '@/components/restaurant-info';
import { MenuWrapper } from '@/components/menu/menu-wrapper';
import { restaurantInfo, testimonials, galleryImageIds, dietaryOptions } from '@/lib/data';
import { localMenuItems as menuItems } from '@/lib/dummy-data';
import { Footer } from '@/components/layout/footer';
import { Testimonials } from '@/components/testimonials';
import { Gallery } from '@/components/gallery';
import { FoodIdentifier } from '@/components/food-identifier';


export default function Home() {
  
  // Note: We are using local dummy data for now.
  // To switch back to live Firestore data, you would re-implement
  // the useEffect hook to fetch from the 'menu_items' collection.
  const isLoading = false;
  const menuItems = require('@/lib/dummy-data').localMenuItems;


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="py-12 bg-muted/20">
          <FoodIdentifier />
        </div>
        <div id="main-content" className="container mx-auto px-4 py-8 md:py-12">
          <MenuWrapper menuItems={menuItems} dietaryOptions={dietaryOptions} />
          <div className="my-16" />
          <Testimonials testimonials={testimonials} />
          <div className="my-16" />
          <Gallery imageIds={galleryImageIds} />
          <div className="my-16" />
          <RestaurantInfo info={restaurantInfo} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
