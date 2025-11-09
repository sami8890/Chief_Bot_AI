import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'paella');

  return (
    <section id="hero" className="relative h-[calc(100vh-4rem)] min-h-[500px] w-full flex items-center justify-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center text-center p-4 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium bg-white/10 border border-white/20 rounded-full">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>AI-Powered Dining</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-headline text-shadow-lg">
          Discover Your Next Favorite Meal, Intelligently.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-white/90 mb-8 text-shadow-md">
          ChefBot analyzes menus, understands your tastes, and even identifies food from a photo. Say goodbye to menu guesswork and hello to personalized dining.
        </p>
        <Button size="lg" className="text-lg h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform duration-300 hover:scale-105" asChild>
          <Link href="/#main-content">Explore The Menu</Link>
        </Button>
      </div>
    </section>
  );
}
