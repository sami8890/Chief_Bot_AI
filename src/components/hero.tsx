import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { IslamicGeometric } from './icons';
import { ScanLine, BookOpen } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'grilled-lamb-skewers');

  return (
    <section id="hero" className="relative h-screen min-h-[700px] w-full flex items-center justify-center text-white overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/30" />
      
      <div className="relative z-10 flex flex-col items-center text-center p-4 animate-fade-in-up max-w-4xl mx-auto">
        
        <div className="relative border-2 border-amber-400/50 p-8 rounded-lg backdrop-blur-sm bg-black/30">
          <IslamicGeometric className="absolute top-0 left-0 w-16 h-16 text-amber-400/60 -translate-x-1/3 -translate-y-1/3" />
          <IslamicGeometric className="absolute top-0 right-0 w-16 h-16 text-amber-400/60 translate-x-1/3 -translate-y-1/3" />
          <IslamicGeometric className="absolute bottom-0 left-0 w-16 h-16 text-amber-400/60 -translate-x-1/3 translate-y-1/3" />
          <IslamicGeometric className="absolute bottom-0 right-0 w-16 h-16 text-amber-400/60 translate-x-1/3 translate-y-1/3" />

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 font-headline text-white [text-shadow:0_3px_10px_rgba(0,0,0,0.7)]">
            Modern halal dining for every moment
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-white/90 mb-8 [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">
            Crafted with purity, tradition, and passion — where every bite tells a story.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
                size="lg" 
                className="text-lg h-14 w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-400/50" 
                asChild
            >
              <Link href="/#food-identifier">
                <ScanLine className="mr-2 h-6 w-6" />
                Scan calariees
              </Link>
            </Button>
            <Button 
                size="lg"
                variant="outline"
                className="text-lg h-14 w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
                asChild
            >
                <Link href="/#menu">
                  <BookOpen className="mr-2 h-6 w-6" />
                  View Menu
                </Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
