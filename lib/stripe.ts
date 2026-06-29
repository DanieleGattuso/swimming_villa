import Stripe from 'stripe';

/**
 * Server-side Stripe client. Instantiated lazily so the app can build without
 * keys present (e.g. CI / preview) and only fails when a payment is attempted.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Copy .env.example to .env.local and add your keys.',
    );
  }
  _stripe = new Stripe(key, {
    apiVersion: '2024-06-20',
    appInfo: { name: 'The Swimming Villa', version: '0.1.0' },
  });
  return _stripe;
}
