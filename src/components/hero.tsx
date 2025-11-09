import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'paella');

  return (
    <section id="hero" className="bg-muted/30">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[calc(100vh-4rem)] py-12 md:py-20">
        <div className="flex flex-col items-center md:items-start text-center md:text-left animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Dining</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-headline text-foreground">
            Discover Your Next Favorite Meal, Intelligently.
          </h1>
          <p className="text-lg md:text-xl max-w-xl text-muted-foreground mb-8">
            ChefBot analyzes menus, understands your tastes, and even identifies food from a photo. Say goodbye to menu guesswork and hello to personalized dining.
          </p>
          <Button size="lg" className="text-lg h-12" asChild>
            <Link href="/#main-content">Explore The Menu</Link>
          </Button>
        </div>
        <div className="relative w-full h-80 md:h-auto md:aspect-[4/3] animate-fade-in-up [animation-delay:200ms]">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover rounded-2xl shadow-lg border-4 border-background"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
        </div>
      </div>
    </section>
  );
}
