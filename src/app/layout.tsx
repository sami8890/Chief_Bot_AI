
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from 'next-themes';
import { Poppins, Nunito_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-headline',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
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
      <body className={cn("font-body antialiased", poppins.variable, nunitoSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
