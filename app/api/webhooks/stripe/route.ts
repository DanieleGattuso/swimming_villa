import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getBookingBySession, setBookingStatus } from '@/lib/bookings';

// Stripe needs the raw request body to verify the signature.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/stripe
 * Source of truth for payment confirmation. Stripe calls this; we verify the
 * signature, then confirm or release the booking. Never confirm a booking from
 * the browser success page alone.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');
  if (!secret || !signature) {
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const booking = await resolveBooking(session);
        if (booking) {
          await setBookingStatus(booking.id, 'confirmed', {
            email: session.customer_details?.email ?? undefined,
            name: session.customer_details?.name ?? undefined,
          });
          // TODO: send confirmation email (Resend / Postmark) here.
        }
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const booking = await resolveBooking(session);
        if (booking) await setBookingStatus(booking.id, 'cancelled');
        break;
      }
      default:
        // Other events are acknowledged and ignored.
        break;
    }
  } catch (err) {
    console.error('Webhook handler error', err);
    return NextResponse.json({ error: 'Handler error.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function resolveBooking(session: Stripe.Checkout.Session) {
  const byId = session.metadata?.bookingId;
  if (byId) {
    const linked = await getBookingBySession(session.id);
    if (linked) return linked;
  }
  return getBookingBySession(session.id);
}
