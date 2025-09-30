import type { RestaurantInfoType } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Phone, Star } from 'lucide-react';

export function RestaurantInfo({ info }: { info: RestaurantInfoType }) {
  return (
    <section className="mb-12">
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="bg-muted/30 p-6">
          <CardTitle className="text-3xl font-headline">{info.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location & Contact
            </h3>
            <div className="text-muted-foreground pl-7 space-y-1">
              <p>{info.address}</p>
              <p>{info.contact}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Opening Hours
            </h3>
            <div className="text-muted-foreground pl-7 space-y-1">
              {info.openingHours.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Customer Reviews
            </h3>
            <div className="flex items-center gap-2 pl-7">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(info.reviews.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                ))}
              </div>
              <span className="font-bold">{info.reviews.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({info.reviews.count} reviews)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
