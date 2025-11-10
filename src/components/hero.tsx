
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'grilled-kebab-spread');

  return (
    <section 
      id="hero" 
      className="relative flex items-center justify-center h-[85vh] min-h-[600px] w-full overflow-hidden bg-black"
    >
      {/* Background Image and Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out scale-105"
        style={{ backgroundImage: `url(${heroImage?.imageUrl})` }}
      >
        {/* Desaturation, Vignette, and Gradient Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-saturate-50" 
             style={{
                boxShadow: 'inset 0 0 100px 50px #0B0B0B'
             }}
        />
      </div>

      {/* AI Scanner Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            {/* Pulsing Ring */}
            <div className="absolute inset-0 border-2 border-primary/70 rounded-full animate-[scan-ring_4s_ease-out_infinite]"></div>
            <div className="absolute inset-0 border-2 border-primary/50 rounded-full animate-[scan-ring_4s_ease-out_infinite_1s]"></div>

            {/* Particle Grid */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-4">
              {Array.from({ length: 36 }).map((_, i) => (
                <div 
                  key={i}
                  className="bg-primary/70 rounded-full animate-[particle-fade_2s_ease-in-out_infinite]"
                  style={{ 
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 animate-fade-in-up">
          <Button 
            size="lg" 
            className={cn(
                "h-16 text-lg font-bold text-white rounded-xl",
                "bg-primary/10 border-2 border-primary/50 backdrop-blur-md",
                "hover:bg-primary/20 hover:border-primary/80",
                "transition-all duration-300 animate-[pulse-glow_4s_ease-in-out_infinite]"
            )}
            asChild
          >
            <Link href="/#food-identifier">See The Calories</Link>
          </Button>
      </div>
    </section>
  );
}
