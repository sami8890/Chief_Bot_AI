import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
      {heroImage && (
        <Image
          src='https://i.ibb.co/6yv6YcZ/photo-1555396273-367ea4eb4db5-q-80-w-1974-auto-format-fit-crop-ixlib-rb-4-0.jpg'
          alt={heroImage.description}
          layout="fill"
          objectFit="cover"
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
      <div className="relative z-10 p-4 animate-fade-in-up">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 font-headline" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
          Experience Culinary Excellence
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
          Discover a symphony of flavors crafted with passion and the finest ingredients.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/#main-content">Explore The Menu</Link>
        </Button>
      </div>
    </section>
  );
}
