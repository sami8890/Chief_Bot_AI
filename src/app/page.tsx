
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import type { MenuItem } from '@/lib/data';
import { collection } from 'firebase/firestore';

import { Header } from '@/components/layout/header';
import { Hero } from '@/components/hero';
import { RestaurantInfo } from '@/components/restaurant-info';
import { MenuWrapper } from '@/components/menu/menu-wrapper';
import { restaurantInfo, testimonials, galleryImageIds, dietaryOptions } from '@/lib/data';
import { Footer } from '@/components/layout/footer';
import { Testimonials } from '@/components/testimonials';
import { Gallery } from '@/components/gallery';
import { FoodIdentifier } from '@/components/food-identifier';
import { Skeleton } from '@/components/ui/skeleton';


export default function Home() {
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) {
      console.log("Firestore not available yet");
      return;
    };
    setIsLoading(true);
    const menuCollectionRef = collection(firestore, "menu_items");

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
        console.error("Failed to fetch menu items: ", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);


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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <aside className="md:col-span-1">
                <div className="sticky top-24 space-y-8">
                   <Skeleton className="h-10 w-full" />
                   <Skeleton className="h-32 w-full" />
                </div>
              </aside>
              <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-full"/>)}
              </div>
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
