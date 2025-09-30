
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Home, Utensils, Users, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu as MenuIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/menu', label: 'Menu Items', icon: Utensils },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Customers', icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    router.replace('/signin');
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Redirecting...</p>
        </div>
    );
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/signin');
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span>GastronomicAI</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
                {navItems.map(item => (
                    <NavItem key={item.href} {...item} />
                ))}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
              <div className="flex items-center gap-2">
                  <Avatar>
                      <AvatarFallback>{user.displayName?.[0] || user.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                      <span className="font-semibold">{user.displayName || 'Admin'}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={handleSignOut}>Sign Out</Button>
              </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-6 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/admin" className="flex items-center gap-2 font-semibold text-xl">
                  <UtensilsCrossed className="h-7 w-7 text-primary" />
                  <span>GastronomicAI</span>
                </Link>
                {navItems.map(item => (
                    <NavItem key={item.href} {...item} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
           <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}


function NavItem({ href, label, icon: Icon }: {href: string, label: string, icon: React.ElementType}) {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    )
}

function UtensilsCrossed(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l8 8"/>
            <path d="M16 16l-2.5 2.5a3.5 3.5 0 0 1-5 0l-4.5-4.5a3.5 3.5 0 0 1 0-5L6.5 6.5"/>
            <path d="m2 6 8 8"/>
        </svg>
    )
}
