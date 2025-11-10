'use client';

import { Header } from '@/components/layout/header';
import { Hero } from '@/components/hero';
import { RestaurantInfo } from '@/components/restaurant-info';
import { MenuWrapper } from '@/components/menu/menu-wrapper';
import { restaurantInfo, galleryImageIds, dietaryOptions, testimonials } from '@/lib/data';
import { localMenuItems } from '@/lib/dummy-data';
import { Footer } from '@/components/layout/footer';
import { Gallery } from '@/components/gallery';
import { FoodIdentifier } from '@/components/food-identifier';
import { Testimonials } from '@/components/testimonials';
import { ScrollToTop } from '@/components/scroll-to-top';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="py-12 bg-muted/20">
          <FoodIdentifier />
        </div>
        <div id="main-content" className="container mx-auto px-4 py-8 md:py-12">
          <MenuWrapper menuItems={localMenuItems} dietaryOptions={dietaryOptions} />
          <div className="my-16" />
          <Testimonials testimonials={testimonials} />
          <div className="my-16" />
          <Gallery imageIds={galleryImageIds} />
          <div className="my-16" />
          <RestaurantInfo info={restaurantInfo} />
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
