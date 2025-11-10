'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, Menu, Award, Star, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateMousePosition = (ev: MouseEvent) => {
        setMousePosition({ x: ev.clientX, y: ev.clientY });
      };
      window.addEventListener('mousemove', updateMousePosition);
      return () => {
        window.removeEventListener('mousemove', updateMousePosition);
      };
    }
  }, []);

  return mousePosition;
};

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'luxury-interior');
  const { x, y } = useMousePosition();
  const [win, setWin] = useState<{ width: number, height: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWin({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  const xPos = win ? (x - win.width / 2) : 0;
  const yPos = win ? (y - win.height / 2) : 0;

  const scrollToMain = () => {
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      className="relative flex items-center justify-center min-h-screen text-white overflow-hidden bg-black"
    >
      {heroImage && (
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(${xPos / 50}px) translateY(${yPos / 50}px) scale(1.1)`}}
        >
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            quality={90}
            data-ai-hint={heroImage.imageHint}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30" />
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-5 md:p-10">
        
        <div className="glassmorphism rounded-full px-4 py-2 text-sm mb-6 opacity-0 animate-fade-in-up flex items-center gap-2" style={{ animationDelay: '0s' }}>
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span>Michelin Guide Featured</span>
        </div>

        <h1 
            className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            style={{ textShadow: '2px 2px 20px rgba(0,0,0,0.5)' }}
        >
            <span className="block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Culinary</span>
            <span className="block text-gradient text-5xl md:text-7xl lg:text-8xl opacity-0 animate-scale-in" style={{ animationDelay: '0.4s' }}>Excellence</span>
            <span className="block font-body font-light text-3xl md:text-4xl lg:text-5xl opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>Awaits</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base md:text-xl text-white/90 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            Where timeless recipes meet modern artistry. A symphony of authentic Halal flavors, crafted to perfection.
        </p>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Award className="w-5 h-5 text-secondary" />
            <span>Award-Winning Chef</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Leaf className="w-5 h-5 text-secondary" />
            <span>Farm-to-Table Ingredients</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Star className="w-5 h-5 text-secondary" />
            <span>Intimate Dining</span>
          </div>
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-scale-in" style={{ animationDelay: '1.2s' }}>
            <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:-translate-y-1 rounded-full px-8 py-6 text-lg font-semibold"
            >
                <Calendar className="mr-3"/>Make Reservation
            </Button>
             <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 border-primary text-white hover:bg-primary hover:text-white rounded-full px-8 py-6 text-lg font-semibold transition-all duration-300"
            >
                <Menu className="mr-3"/>View Menu
            </Button>
        </div>

        <div className="absolute bottom-20 text-center text-sm text-white/70 border-t border-white/20 pt-4 w-full max-w-4xl opacity-0 animate-fade-in" style={{ animationDelay: '1.4s' }}>
          <p>Open Daily: 12:00 PM - 11:00 PM</p>
        </div>

        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer opacity-0 animate-fade-in" 
          style={{ animationDelay: '1.6s' }}
          onClick={scrollToMain}
          aria-label="Scroll down"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center items-start p-1 animate-scroll-bounce">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
