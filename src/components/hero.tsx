import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <section id="hero" className="relative h-[60vh] min-h-[400px] max-h-[600px] w-full flex items-center justify-center text-center text-white overflow-hidden">
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
      <div className="relative z-10 p-4">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-shadow-lg mb-4 font-headline">
          Experience Culinary Excellence
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-shadow">
          Discover a symphony of flavors crafted with passion and the finest ingredients.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <a href="#menu">Explore The Menu</a>
        </Button>
      </div>
    </section>
  );
}
