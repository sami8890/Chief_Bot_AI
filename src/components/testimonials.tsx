import type { Testimonial } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="py-12 bg-muted/50 rounded-lg">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline text-center mb-8">What Our Customers Say</h2>
        <Carousel
          opts={{
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <Quote className="w-10 h-10 text-primary mb-4" />
                      <p className="text-lg italic mb-6 text-foreground/80">&ldquo;{testimonial.quote}&rdquo;</p>
                      <div className="flex items-center gap-4">
                        <Avatar>
                           <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
