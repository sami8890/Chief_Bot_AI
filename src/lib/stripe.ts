import Stripe from 'stripe';
import 'dotenv/config';

// Ensure the secret key is defined in your environment variables.
// The key is checked here, but the object is exported conditionally
// to prevent crashes if the key is missing.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (process.env.NODE_ENV !== 'production' && !stripeSecretKey) {
  console.warn(
    'Stripe secret key is not set. Stripe functionality will be disabled.'
  );
}

// Conditionally create the Stripe instance
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    })
  : null;
