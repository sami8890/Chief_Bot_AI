import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'brunch-spread');

  return (
    <section 
      id="hero" 
      className="container mx-auto px-4 py-12 md:py-24"
    >
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-start text-left animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-headline text-foreground">
            Wholesome Halal Flavors, Fresh Every Morning
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
            Enjoy locally sourced, ethically prepared halal meals made with love.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
            <Button 
                size="lg" 
                className="text-lg h-14 w-full sm:w-auto transition-all duration-300 hover:scale-105" 
                asChild
            >
              <Link href="/#menu">Order Online</Link>
            </Button>
            <Button 
                size="lg"
                variant="outline"
                className="text-lg h-14 w-full sm:w-auto transition-all duration-300 hover:bg-secondary"
                asChild
            >
                <Link href="/#menu">View Menu</Link>
            </Button>
          </div>
        </div>

        <div className="relative w-full h-80 md:h-full min-h-[300px] md:min-h-[500px] animate-fade-in-up [animation-delay:200ms]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      </div>
    </section>
  );
}
