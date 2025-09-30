"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Loader2, AlertTriangle } from "lucide-react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "./actions";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  orderType: z.enum(["pickup", "delivery"]),
  address: z.string().optional(),
  paymentMethod: z.enum(["card", "cod"]),
}).refine(data => {
  if (data.orderType === 'delivery') {
    return data.address && data.address.length > 0;
  }
  return true;
}, {
  message: "Address is required for delivery",
  path: ["address"],
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function CheckoutForm() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orderType: "pickup",
      paymentMethod: "card",
      fullName: user?.displayName || "",
    },
  });
  
  const orderType = form.watch("orderType");
  const paymentMethod = form.watch("paymentMethod");


  async function onSubmit(data: CheckoutFormValues) {
    setIsLoading(true);
    setMessage(null);

    if (data.paymentMethod === 'cod') {
      // Handle Cash on Delivery
      console.log("Placing order with Cash on Delivery", data);
      clearCart();
      router.push(`/payment/success?amount=${total}&name=${data.fullName}&orderType=${data.orderType}`);
      return;
    }

    if (!stripe || !elements) {
      setMessage("Payment system is not ready. Please wait a moment and try again.");
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?amount=${total}&name=${data.fullName}&orderType=${data.orderType}`,
        payment_method_data: {
          billing_details: {
            name: data.fullName,
            phone: data.phone,
          }
        }
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An unexpected error occurred.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
      setIsLoading(false);
    } else {
      clearCart();
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Checkout Details</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {message && (
                  <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-md flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{message}</span>
                  </div>
              )}

              <FormField
                control={form.control}
                name="orderType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Order Option</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="pickup" /></FormControl>
                          <FormLabel className="font-normal">Pickup</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="delivery" /></FormControl>
                          <FormLabel className="font-normal">Delivery</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {orderType === 'delivery' && (
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl><Input placeholder="123 Main St, Foodie City" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              
              <Separator />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="card" /></FormControl>
                          <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="cod" /></FormControl>
                          <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {paymentMethod === 'card' && (
                <div className="p-4 border rounded-md bg-muted/20">
                  <Label className="text-sm font-medium mb-2 block">Card Details</Label>
                  <PaymentElement />
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading || (paymentMethod === 'card' && !stripe)}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : `Confirm Order - $${total.toFixed(2)}`}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      
      <div className="sticky top-24">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {cart.map(item => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function CheckoutPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push("/signin");
      } else if (cart.length === 0) {
        router.push("/#menu");
      }
    }
  }, [user, isAuthLoading, cart, router]);

  useEffect(() => {
    if (cart.length > 0 && !clientSecret) {
      createPaymentIntent(total)
        .then(secret => {
          setClientSecret(secret);
        })
        .catch(err => {
            console.error("Failed to create payment intent", err);
        });
    }
  }, [cart, total, clientSecret]);
  
  if (isAuthLoading || !user || cart.length === 0) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    )
  }
  
  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
        theme: 'night',
        labels: 'floating',
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-headline mb-8">Checkout</h1>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        ) : (
           <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
           </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

    