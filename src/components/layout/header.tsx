import { UtensilsCrossed } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 px-6 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="container mx-auto flex items-center gap-2">
        <UtensilsCrossed className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold font-headline tracking-tight text-foreground">
          GastronomicAI
        </h1>
      </div>
    </header>
  );
}
