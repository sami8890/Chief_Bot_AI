
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Home, Package } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const name = searchParams.get('name');
  const orderType = searchParams.get('orderType');
  const address = searchParams.get('address');

  // Clear cart on component mount
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center shadow-lg animate-fade-in-up">
          <CardHeader className="items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl font-headline">Order Confirmed!</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Thank you for your purchase, {name}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-left bg-muted/50 p-4 rounded-md border">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono text-xs">#{orderId ? orderId.substring(0,7) : 'N/A'}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Total:</span>
                  <span className="font-bold text-lg">${amount ? parseFloat(amount).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    {orderType === 'delivery' ? <Home className="w-4 h-4"/> : <Package className="w-4 h-4"/>}
                    Order Type:
                  </span>
                  <span className="font-medium capitalize">{orderType || 'N/A'}</span>
                </div>
                {orderType === 'delivery' && address && (
                   <div className="flex justify-between items-start">
                     <span className="text-muted-foreground">Delivery Address:</span>
                     <span className="font-medium text-right max-w-[70%]">{decodeURIComponent(address)}</span>
                   </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Time:</span>
                  <span className="font-medium">{orderType === 'delivery' ? '30-45 minutes' : '15-20 minutes'}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground px-4">
              Your order is being prepared. You'll receive a notification when it's ready for {orderType}.
            </p>
            <Button asChild className="w-full">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
