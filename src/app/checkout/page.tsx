
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@/firebase";
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
import { createPaymentIntent, createOrder } from "./actions";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null;

const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  orderType: z.enum(["pickup", "delivery"]),
  address: z.string().optional(),
  paymentMethod: z.enum(["card", "cod"]),
}).refine(data => {
  if (data.orderType === 'delivery') {
    return data.address && data.address.trim().length > 0;
  }
  return true;
}, {
  message: "Address is required for delivery",
  path: ["address"],
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function CheckoutForm({ clientSecret }: { clientSecret: string | null }) {
  const { user } = useUser();
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
      phone: "",
      address: "",
    },
  });
  
  const orderType = form.watch("orderType");
  const paymentMethod = form.watch("paymentMethod");

  const isStripeConfigured = !!stripePromise;


  useEffect(() => {
    if (paymentMethod === 'card' && isStripeConfigured && !clientSecret) {
      setMessage("Initializing payment... please wait.");
    } else if (paymentMethod === 'card' && !isStripeConfigured) {
        setMessage("Online payment is currently unavailable. Please select Cash on Delivery.")
    } else {
      setMessage(null);
    }
  }, [paymentMethod, clientSecret, isStripeConfigured])


  async function onSubmit(data: CheckoutFormValues) {
    setIsLoading(true);
    setMessage(null);

    if (!user) {
        setMessage("You must be logged in to place an order.");
        setIsLoading(false);
        return;
    }
    
    const orderResult = await createOrder(
        { userId: user.uid, userName: data.fullName, userEmail: user.email! },
        cart, 
        total, 
        data.orderType, 
        data.address,
        data.paymentMethod
    );

    if (!orderResult.success) {
        setMessage(orderResult.error || "Failed to create order. Please try again.");
        setIsLoading(false);
        return;
    }
    
    const successUrl = `/payment/success?orderId=${orderResult.orderId}&amount=${total}&name=${data.fullName}&orderType=${data.orderType}${data.address ? `&address=${encodeURIComponent(data.address)}` : ''}`;

    if (data.paymentMethod === 'cod') {
      clearCart();
      router.push(successUrl);
      return;
    }

    if (!stripe || !elements || !clientSecret) {
      setMessage("Payment system is not ready. Please wait a moment and try again.");
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${successUrl}`,
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
                        {isStripeConfigured && <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="card" /></FormControl>
                          <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                        </FormItem>}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="cod" /></FormControl>
                          <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {paymentMethod === 'card' && isStripeConfigured && (
                <>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important Notice</AlertTitle>
                    <AlertDescription>
                      This is a demo website created by sami-e, but it is completely workable. Please do not use your actual card information.
                    </AlertDescription>
                  </Alert>
                  <div className="p-4 border rounded-md bg-muted/20">
                    <Label className="text-sm font-medium mb-2 block">Card Details</Label>
                     {clientSecret ? <PaymentElement /> : <Loader2 className="w-6 h-6 animate-spin" />}
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading || (paymentMethod === 'card' && (!stripe || !clientSecret))}>
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

function CheckoutPageContents() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { cart } = useCart();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingSecret, setIsLoadingSecret] = useState(true);
  
  const isStripeConfigured = !!stripePromise;

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
    if (isStripeConfigured && cart.length > 0 && total > 0.50) { // Stripe requires a minimum amount
      setIsLoadingSecret(true);
      createPaymentIntent(total)
        .then(secret => {
          if (secret) {
            setClientSecret(secret);
          }
        })
        .catch(err => {
            console.error("Failed to create payment intent", err);
        })
        .finally(() => {
            setIsLoadingSecret(false);
        });
    } else if (cart.length > 0) {
        setIsLoadingSecret(false);
    }
  }, [cart, total, isStripeConfigured]);
  
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
        theme: 'stripe',
        variables: {
          colorPrimary: '#D3470A',
          colorBackground: '#3c3c3c',
          colorText: '#ffffff',
          colorDanger: '#df1b41',
          fontFamily: 'PT Sans, sans-serif',
          spacingUnit: '4px',
          borderRadius: '4px',
        }
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-headline mb-8">Checkout</h1>
        {(isLoadingSecret && isStripeConfigured) ? (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        ) : (
            isStripeConfigured ? (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm clientSecret={clientSecret} />
              </Elements>
            ) : (
               <CheckoutForm clientSecret={null} />
            )
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
       <CheckoutPageContents />
    </Suspense>
  )
}
