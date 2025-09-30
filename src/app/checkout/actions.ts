
'use server';

import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { CartItem } from '@/context/cart-context';
import { auth } from '@/lib/firebase';
import { headers } from 'next/headers';

export async function createPaymentIntent(amount: number) {
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
    } catch(e) {
        console.error("Error creating order: ", e);
        return { success: false, error: 'Failed to create order in database.'};
    }
}
