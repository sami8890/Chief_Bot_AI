"use client";

import { UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/signin');
  };

  return (
    <header className="py-4 px-6 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="container mx-auto flex items-center gap-2">
        <UtensilsCrossed className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold font-headline tracking-tight text-foreground">
          <Link href="/">GastronomicAI</Link>
        </h1>
        <div className="ml-auto flex items-center gap-4">
          {!isLoading && (
            <>
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user.displayName || user.email}</span>
                  <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
