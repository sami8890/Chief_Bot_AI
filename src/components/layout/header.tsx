"use client";

import { UtensilsCrossed, Menu as MenuIcon, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link href={href} passHref>
    <Button variant="ghost" onClick={onClick} className="w-full justify-start sm:w-auto sm:justify-center">
      {children}
    </Button>
  </Link>
);

export function Header() {
  const { user, isLoading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    await signOut(auth);
    setIsMobileMenuOpen(false);
    router.push('/signin');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = (
    <>
      <NavLink href="/#menu" onClick={() => setIsMobileMenuOpen(false)}>Menu</NavLink>
      <NavLink href="/#testimonials" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</NavLink>
      <NavLink href="/#gallery" onClick={() => setIsMobileMenuOpen(false)}>Gallery</NavLink>
    </>
  );

  const authLinks = (
    <>
      {user ? (
        <>
          <div className="flex items-center gap-4 sm:gap-2 flex-col sm:flex-row">
            <span className="text-sm text-muted-foreground">Welcome, {user.displayName || user.email}</span>
            <Button variant="ghost" onClick={handleSignOut} className="w-full sm:w-auto">Sign Out</Button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 flex-col sm:flex-row">
          <Button variant="ghost" asChild className="w-full sm:w-auto">
            <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
          </Button>
        </div>
      )}
    </>
  );

  return (
    <header className={cn(
      "sticky top-0 z-30 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto flex items-center h-16 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <UtensilsCrossed className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-headline tracking-tight">
            GastronomicAI
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2 ml-auto">
          {navLinks}
          <div className="w-px h-6 bg-border mx-2" />
          {!isLoading && authLinks}
           <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{cartItemCount}</Badge>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
        </nav>

        <div className="ml-auto md:hidden flex items-center">
           <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{cartItemCount}</Badge>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center border-b pb-4">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-foreground">
                    <UtensilsCrossed className="w-6 h-6 text-primary" />
                    <h1 className="text-xl font-bold font-headline tracking-tight">
                      GastronomicAI
                    </h1>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-2 mt-6">
                  {navLinks}
                </nav>
                <div className="mt-auto border-t pt-6 flex flex-col gap-2">
                  {!isLoading && authLinks}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
