"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // Example 8% tax
  const total = subtotal + tax;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-headline mb-8">Your Cart</h1>
        {cart.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty.</p>
              <Button asChild>
                <Link href="/#menu">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => {
                const placeholder = PlaceHolderImages.find(p => p.id === item.imageId);
                return (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start p-4 gap-4">
                      {placeholder && (
                          <Image src={placeholder.imageUrl} alt={item.name} width={100} height={100} className="rounded-md object-cover w-full sm:w-24 sm:h-24 aspect-video sm:aspect-square" />
                      )}
                      <div className="flex-grow w-full">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                            </div>
                            <span className="font-bold text-lg sm:hidden">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4"/></Button>
                              <Input type="number" value={item.quantity} readOnly className="w-16 text-center" />
                              <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4"/></Button>
                            </div>
                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                <span className="hidden sm:block font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                                    <Trash2 className="h-5 w-5"/>
                                    <span className="sr-only">Remove item</span>
                                </Button>
                            </div>
                          </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
            <div className="lg:col-span-1 sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
