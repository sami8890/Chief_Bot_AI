"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Loader2 } from "lucide-react";

const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  orderType: z.enum(["pickup", "delivery"]),
  address: z.string().optional(),
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

export default function CheckoutPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orderType: "pickup",
    },
  });

  const orderType = form.watch("orderType");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/signin");
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (user) {
      form.setValue("fullName", user.displayName || "");
    }
  }, [user, form]);
  
  if (isAuthLoading || !user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    )
  }

  function onSubmit(data: CheckoutFormValues) {
    console.log("Checkout data:", data);
    // Next step: proceed to payment
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl font-headline mb-8">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="orderType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Order Option</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="pickup" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Pickup
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="delivery" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Delivery
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {orderType === 'delivery' && (
                       <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St, Foodie City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Button type="submit" className="w-full" size="lg">
                      Proceed to Payment
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          {/* Order summary can be added here */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
