
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { MenuItem } from '@/lib/data';
import { collection, onSnapshot, FirestoreError } from 'firebase/firestore';

import { Header } from '@/components/layout/header';
import { Hero } from '@/components/hero';
import { RestaurantInfo } from '@/components/restaurant-info';
import { MenuWrapper } from '@/components/menu/menu-wrapper';
import { restaurantInfo, galleryImageIds, dietaryOptions } from '@/lib/data';
import { Footer } from '@/components/layout/footer';
import { Gallery } from '@/components/gallery';
import { FoodIdentifier } from '@/components/food-identifier';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export default function Home() {
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();

  const menuCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "restaurants", "main-restaurant", "menu_items");
  }, [firestore]);


  useEffect(() => {
    if (!menuCollectionRef) {
      // Firestore is not available yet.
      // We'll wait for the ref to be initialized.
      return;
    };
    setIsLoading(true);

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
    }, (err: FirestoreError) => {
        // This is the correct, contextual error handling implementation.
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path: menuCollectionRef.path,
        });

        // Emit the error to be caught by the global error boundary.
        // DO NOT use console.error here.
        errorEmitter.emit('permission-error', contextualError);

        setIsLoading(false); // Stop loading, as an error has occurred.
        setMenuItems([]); // Ensure menu is empty on error.
    });

    return () => unsubscribe();
  }, [menuCollectionRef]);


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
          <Gallery imageIds={galleryImageIds} />
          <div className="my-16" />
          <RestaurantInfo info={restaurantInfo} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
