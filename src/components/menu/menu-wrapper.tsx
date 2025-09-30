"use client";

import { useState, useMemo } from 'react';
import type { MenuItem } from '@/lib/data';
import { DietaryFilter } from './dietary-filter';
import { MenuList } from './menu-list';
import { PersonalizedRecommendations } from './personalized-recommendations';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function MenuWrapper({ menuItems, dietaryOptions }: { menuItems: MenuItem[], dietaryOptions: string[] }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const filteredMenuItems = useMemo(() => {
    let items = menuItems;
    if (activeFilters.length > 0) {
      items = items.filter(item => 
        activeFilters.every(filter => item.dietaryTags.includes(filter))
      );
    }
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return items;
  }, [menuItems, activeFilters, searchTerm]);
  
  const menuAsString = useMemo(() => {
    return menuItems.map(item => `${item.name}: ${item.description}`).join('\n');
  }, [menuItems]);

  return (
    <section id="menu">
        <div className="mb-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <PersonalizedRecommendations menu={menuAsString} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
                <div className="sticky top-24 space-y-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4 font-headline">Search Menu</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search dishes..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <DietaryFilter 
                        options={dietaryOptions}
                        activeFilters={activeFilters}
                        onFilterChange={handleFilterChange}
                    />
                </div>
            </aside>
            <div className="md:col-span-3">
                <MenuList items={filteredMenuItems} />
            </div>
        </div>
    </section>
  );
}
