
'use server';

import { stripe } from '@/lib/stripe';

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
