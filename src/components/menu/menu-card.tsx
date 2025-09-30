import type { MenuItem } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Vegan, WheatOff, MilkOff, ShoppingCart } from 'lucide-react';
import type { ComponentType } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { MenuAnalyzer } from './menu-analyzer';

const tagIconMap: { [key: string]: ComponentType<{ className?: string }> } = {
    vegetarian: Leaf,
    vegan: Vegan,
    'gluten-free': WheatOff,
    'dairy-free': MilkOff,
};

export function MenuCard({ item }: { item: MenuItem }) {
  const placeholder = PlaceHolderImages.find(p => p.id === item.imageId);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to place your order.',
      });
      return;
    }
    addToCart(item);
    toast({
      title: 'Added to Cart',
      description: `${item.name} has been added to your cart.`,
    })
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {placeholder && (
        <div className="relative h-48 w-full">
          <Image
            src={placeholder.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            data-ai-hint={placeholder.imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline">{item.name}</CardTitle>
          <MenuAnalyzer menuItemDescription={item.description} />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground mb-4">{item.description}</p>
        <div className="flex flex-wrap gap-2">
            {item.dietaryTags.map(tag => {
                const Icon = tagIconMap[tag];
                return (
                    <Badge key={tag} variant="secondary" className="capitalize font-normal">
                        {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 text-accent" />}
                        {tag.replace('-', ' ')}
                    </Badge>
                );
            })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/30 p-4">
        <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
        <Button onClick={handleAddToCart}>
            <ShoppingCart className="mr-2"/>
            Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}