
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Calendar, ChefHat, Leaf, Mouse, Star, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'luxury-interior');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollDown = () => {
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      className="relative flex items-center justify-center min-h-screen text-white overflow-hidden"
    >
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover -z-20"
          sizes="100vw"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center animate-fade-in-up">
        
        <div 
          className="[--delay:0s] opacity-0 animate-fade-in-up animation-delay-0 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md animate-float"
        >
          ⭐ Michelin Guide Featured
        </div>

        <h1 className="mt-6 font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block opacity-0 animate-fade-in-up [--delay:0.2s] animation-delay-200">Culinary</span>
          <span className="block opacity-0 animate-scale-in [--delay:0.4s] animation-delay-400 my-1 lg:my-2 bg-gradient-to-r from-[#00C19D] to-[#00E5B8] bg-clip-text text-transparent font-black tracking-tighter text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            Excellence
          </span>
          <span className="block opacity-0 animate-slide-up [--delay:0.6s] animation-delay-600 font-body font-light tracking-widest text-white/80 text-2xl sm:text-3xl">
            Awaits
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/90 opacity-0 animate-fade-in-up [--delay:0.8s] animation-delay-800">
          An unforgettable dining experience where modern innovation meets the rich heritage of authentic Halal cuisine.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 text-base">
          <div className="opacity-0 animate-slide-in-from-left [--delay:1s] animation-delay-1000 flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span> Award-Winning Chef
          </div>
          <div className="opacity-0 animate-scale-in [--delay:1s] animation-delay-1000 flex items-center justify-center gap-2">
             <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span> Farm-to-Table Ingredients
          </div>
          <div className="opacity-0 animate-slide-in-from-right [--delay:1s] animation-delay-1000 flex items-center justify-center sm:justify-end gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span> Intimate Dining Experience
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-scale-in [--delay:1.2s] animation-delay-1200">
          <Button 
              size="lg" 
              className="bg-[#00C19D] text-white hover:bg-[#00E5B8] shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:-translate-y-0.5 rounded-lg px-8 py-6 text-base font-semibold w-full sm:w-auto"
              asChild
          >
            <Link href="/#reservation"><Calendar className="mr-2"/>Make Reservation</Link>
          </Button>
          <Button 
              size="lg"
              variant="outline"
              className="border-2 border-[#00C19D] text-white bg-transparent hover:bg-[#00C19D] hover:text-white transition-all duration-300 rounded-lg px-8 py-6 text-base font-semibold w-full sm:w-auto"
              asChild
          >
              <Link href="/#menu"><Utensils className="mr-2"/>View Menu</Link>
          </Button>
        </div>

        <div className="mt-12 w-full max-w-lg border-t border-white/20 pt-4 text-sm text-white/70">
          <p>Open Daily: 12:00 PM - 11:00 PM</p>
        </div>
      </div>

       <div 
        onClick={handleScrollDown}
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer transition-opacity duration-500",
          showScrollIndicator ? "opacity-100" : "opacity-0"
        )}
      >
        <Mouse className="w-6 h-6 animate-scroll-bounce" />
        <span className="text-xs text-white/70">Scroll</span>
      </div>
    </section>
  );
}
