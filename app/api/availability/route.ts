import { NextResponse } from 'next/server';
import { getBlockedRanges } from '@/lib/availability';
import { BOOKING_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic'; // availability must never be cached

/**
 * GET /api/availability
 * Returns the ranges the calendar must disable plus the booking policy the
 * widget needs (min nights, max guests, deposit %).
 */
export async function GET() {
  try {
    const blocked = await getBlockedRanges();
    return NextResponse.json({
      blocked,
      policy: {
        minNights: BOOKING_CONFIG.minNights,
        maxGuests: BOOKING_CONFIG.maxGuests,
        depositPercent: BOOKING_CONFIG.depositPercent,
        currency: BOOKING_CONFIG.currency,
      },
    });
  } catch (err) {
    console.error('availability error', err);
    return NextResponse.json(
      { error: 'Impossibile caricare la disponibilità.' },
      { status: 500 },
    );
  }
}
