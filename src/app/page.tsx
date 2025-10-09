
'use client';

import { Header } from '@/components/layout/header';
import { Hero } from '@/components/hero';
import { RestaurantInfo } from '@/components/restaurant-info';
import { MenuWrapper } from '@/components/menu/menu-wrapper';
import { restaurantInfo, testimonials, galleryImageIds } from '@/lib/data';
import { Footer } from '@/components/layout/footer';
import { Testimonials } from '@/components/testimonials';
import { Gallery } from '@/components/gallery';
import { FoodIdentifier } from '@/components/food-identifier';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import type { MenuItem } from '@/lib/data';
import { dietaryOptions } from '@/lib/data';
import { Loader2 } from 'lucide-react';


export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const menuCollectionRef = collection(db, "menu_items");
    const unsubscribe = onSnapshot(menuCollectionRef, (snapshot) => {
        const items = snapshot.docs.map(doc => {
             const data = doc.data();
             return {
                 id: doc.id,
                 name: data.name,
                 description: data.description,
                 price: data.price,
                 category: data.category,
                 dietaryTags: data.dietaryTags || [],
                 imageId: data.imageId,
                 userImageUrl: data.userImageUrl,
             } as MenuItem;
         });
        setMenuItems(items);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching menu items for customer:", error);
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="py-12 bg-muted/20">
          <FoodIdentifier />
        </div>
        <div id="main-content" className="container mx-auto px-4 py-8 md:py-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : (
            <MenuWrapper menuItems={menuItems} dietaryOptions={dietaryOptions} />
          )}
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
