import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import { createBooking } from '@/lib/bookings';
import { validateStay } from '@/lib/availability';
import { computePrice } from '@/lib/pricing';
import { fromISODate, formatRange } from '@/lib/dates';
import { BOOKING_CONFIG } from '@/lib/config';
import { VILLA } from '@/lib/content';
import { siteUrl } from '@/lib/utils';

const Body = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().min(1).max(BOOKING_CONFIG.maxGuests),
  paymentMode: z.enum(['full', 'deposit']),
});

/**
 * POST /api/checkout
 * Re-validates the stay and recomputes the price server-side (the client price
 * is never trusted), records a pending booking, then opens a Stripe Checkout
 * session. Returns { url } for the browser to redirect to.
 */
export async function POST(req: Request) {
  let payload;
  try {
    payload = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
  }

  const { checkIn, checkOut, guests, paymentMode } = payload;

  // 1. Authoritative availability + rules check.
  const invalid = await validateStay(checkIn, checkOut, guests);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 409 });

  // 2. Authoritative price (cents).
  const price = computePrice(fromISODate(checkIn)!, fromISODate(checkOut)!, paymentMode);

  // 3. Pending booking — holds the dates while the guest pays.
  const booking = await createBooking({
    checkIn,
    checkOut,
    guests,
    paymentMode,
    amountTotal: price.amountTotal,
    amountDue: price.amountDue,
    currency: price.currency,
  });

  // 4. Stripe Checkout session.
  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Pagamenti non configurati. Imposta le chiavi Stripe.' },
      { status: 500 },
    );
  }

  const stayLabel = formatRange(fromISODate(checkIn)!, fromISODate(checkOut)!);
  const isDeposit = paymentMode === 'deposit';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: price.currency,
          unit_amount: price.amountDue,
          product_data: {
            name: isDeposit
              ? `${VILLA.name} — Deposito (${price.depositPercent}%)`
              : `${VILLA.name} — Soggiorno`,
            description: `${stayLabel} · ${price.nights} notti · ${guests} ospiti`,
          },
        },
      },
    ],
    metadata: {
      bookingId: booking.id,
      checkIn,
      checkOut,
      guests: String(guests),
      paymentMode,
      amountTotal: String(price.amountTotal),
      balanceDue: String(price.balanceDue),
    },
    success_url: `${siteUrl()}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/booking/cancelled`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // align with pending hold
  });

  // Store the session id so the webhook can reconcile the booking.
  booking.stripeSessionId = session.id;
  await createBookingSessionLink(booking.id, session.id);

  return NextResponse.json({ url: session.url });
}

// Small helper kept inline to avoid an extra import cycle.
import { setBookingStatus } from '@/lib/bookings';
async function createBookingSessionLink(bookingId: string, sessionId: string) {
  await setBookingStatus(bookingId, 'pending', { stripeSessionId: sessionId });
}
