'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Utensils } from 'lucide-react';

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'luxury-interior');
  const floatingDishImage = PlaceHolderImages.find(p => p.id === 'floating-kebab');
  const { x, y } = useMousePosition();
  const [win, setWin] = useState<{ width: number, height: number } | null>(null);

  useEffect(() => {
    setWin({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const xPos = win ? (x - win.width / 2) : 0;
  const yPos = win ? (y - win.height / 2) : 0;

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
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center animate-fade-in">
        
        {floatingDishImage && (
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${-xPos / 25}px) translateY(${-yPos / 25}px)` }}
          >
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] animate-float">
              <Image
                src={floatingDishImage.imageUrl}
                alt={floatingDishImage.description}
                fill
                className="object-contain"
                quality={100}
                data-ai-hint={floatingDishImage.imageHint}
              />
            </div>
          </div>
        )}

        <div className="relative z-20 flex flex-col items-center justify-center">
            <div 
                className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold text-white"
                style={{ textShadow: '2px 2px 20px rgba(0,0,0,0.5)' }}
            >
                <span className="block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Artistry</span>
                <span className="block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>in Every Dish.</span>
            </div>

            <p className="mt-6 max-w-xl text-lg text-white/80 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                Discover a symphony of authentic Halal flavors, meticulously crafted with a modern touch.
            </p>
            
            <div className="mt-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-teal-500/50 transition-all duration-300 transform hover:-translate-y-1 rounded-full px-8 py-6 text-lg font-semibold"
                    asChild
                >
                    <Link href="/#menu"><Utensils className="mr-3"/>Explore the Menu</Link>
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
