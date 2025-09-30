"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Leaf, Vegan, WheatOff, MilkOff } from 'lucide-react';
import type { ComponentType } from 'react';

const iconMap: { [key: string]: ComponentType<{ className?: string }> } = {
  vegetarian: Leaf,
  vegan: Vegan,
  'gluten-free': WheatOff,
  'dairy-free': MilkOff,
};

export function DietaryFilter({ options, activeFilters, onFilterChange }: { options: string[], activeFilters: string[], onFilterChange: (filter: string) => void }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 font-headline">Dietary Options</h3>
      <div className="space-y-3">
        {options.map(option => {
            const Icon = iconMap[option];
            return (
              <div key={option} className="flex items-center space-x-3">
                <Checkbox 
                  id={option} 
                  checked={activeFilters.includes(option)}
                  onCheckedChange={() => onFilterChange(option)}
                />
                <Label htmlFor={option} className="flex items-center gap-2 text-base cursor-pointer">
                  {Icon && <Icon className="w-5 h-5 text-accent" />}
                  <span className="capitalize">{option.replace('-', ' ')}</span>
                </Label>
              </div>
            );
        })}
      </div>
    </div>
  );
}
