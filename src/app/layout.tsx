
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'ChefBot',
  description: 'AI-powered restaurant menu assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <FirebaseClientProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
