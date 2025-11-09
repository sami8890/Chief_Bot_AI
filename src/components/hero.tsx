import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'fine-dining-dish');

  return (
    <section id="hero" className="relative h-screen min-h-[700px] w-full flex items-center justify-center text-white">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 flex flex-col items-center text-center p-4 animate-fade-in-up">
        
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 font-headline [text-shadow:0_4px_12px_rgba(0,0,0,0.8)] leading-tight">
          Where Culinary Art Meets Tradition
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-white/90 mb-10 [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">
          An unforgettable culinary experience where every dish is a masterpiece.
        </p>
        <Button 
            size="lg" 
            className="text-lg h-14 bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-400/50" 
            asChild
        >
          <Link href="/#menu">Reserve a Table</Link>
        </Button>
      </div>
    </section>
  );
}
