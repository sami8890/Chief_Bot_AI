
'use server';

import { stripe } from '@/lib/stripe';
import { getFirestore, collection, addDoc } from 'firebase/firestore/lite';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import type { CartItem } from '@/context/cart-context';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export async function createPaymentIntent(amount: number) {
  // Gracefully handle missing Stripe configuration
  if (!stripe) {
    console.error("Stripe is not configured. Skipping payment intent creation.");
    // Return a value that can be handled by the client
    return null;
  }
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    if (!paymentIntent.client_secret) {
        throw new Error('Failed to create payment intent: client_secret is null');
    }

    return paymentIntent.client_secret;
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    // Propagate a more generic error to the client
    throw new Error('Could not create payment intent.');
  }
}

export async function createOrder(
    { userId, userName, userEmail } : { userId: string, userName: string, userEmail: string },
    cart: CartItem[], 
    total: number,
    orderType: 'pickup' | 'delivery',
    address: string | undefined,
    paymentMethod: 'card' | 'cod'
) {
    try {
        const orderData = {
            userId,
            customerName: userName,
            customerEmail: userEmail,
            date: new Date().toISOString(),
            items: cart.map(item => ({...item})), // Make a serializable copy
            total,
            status: 'Pending' as const,
            orderType,
            address: address || null,
            paymentMethod,
        };

        const docRef = await addDoc(collection(db, 'orders'), orderData);

        return { success: true, orderId: docRef.id };
    } catch(e: any) {
        console.error("Error creating order: ", e);
        // Return the specific Firebase error message instead of a generic one.
        const errorMessage = e.message || 'Failed to create order in database.';
        return { success: false, error: errorMessage };
    }
}
