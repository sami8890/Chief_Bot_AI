import { Header } from '@/components/layout/header';
import { Hero } from '@/components/hero';
import { RestaurantInfo } from '@/components/restaurant-info';
import { MenuWrapper } from '@/components/menu/menu-wrapper';
import { menuItems, restaurantInfo, dietaryOptions } from '@/lib/data';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Hero />
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <RestaurantInfo info={restaurantInfo} />
        <MenuWrapper menuItems={menuItems} dietaryOptions={dietaryOptions} />
      </main>
      <Footer />
    </div>
  );
}
