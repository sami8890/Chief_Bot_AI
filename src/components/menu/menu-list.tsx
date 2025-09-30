import type { MenuItem } from '@/lib/data';
import { MenuCard } from './menu-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';

export function MenuList({ items }: { items: MenuItem[] }) {
    if (items.length === 0) {
        return (
            <Alert>
                <Frown className="h-4 w-4" />
                <AlertTitle>No Dishes Found</AlertTitle>
                <AlertDescription>
                    Sorry, we couldn't find any dishes matching your criteria. Try changing your search or filters.
                </AlertDescription>
            </Alert>
        )
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {items.map(item => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
}
