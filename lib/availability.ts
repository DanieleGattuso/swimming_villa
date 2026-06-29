import { getActiveBookings } from './bookings';
import { BOOKING_CONFIG } from './config';
import { fromISODate, nightsBetween, nightsOf, toISODate } from './dates';
import type { BlockedRange } from './types';

/**
 * Date ranges that cannot be booked, derived from active bookings.
 * Each range is half-open [from, to): `to` is the checkout morning and stays
 * bookable as a new check-in (back-to-back stays are allowed).
 */
export async function getBlockedRanges(): Promise<BlockedRange[]> {
  const active = await getActiveBookings();
  return active.map((b) => ({ from: b.checkIn, to: b.checkOut }));
}

/** Set of individual occupied nights (yyyy-MM-dd) — handy for the calendar. */
export async function getBlockedNights(): Promise<string[]> {
  const active = await getActiveBookings();
  const nights = new Set<string>();
  for (const b of active) {
    for (const n of nightsOf(fromISODate(b.checkIn)!, fromISODate(b.checkOut)!)) {
      nights.add(n);
    }
  }
  return [...nights].sort();
}

/**
 * Server-side validation that a requested stay is bookable.
 * Returns a reason string when invalid, or null when OK. Never trust the
 * client: the checkout API calls this before creating a Stripe session.
 */
export async function validateStay(
  checkInISO: string,
  checkOutISO: string,
  guests: number,
): Promise<string | null> {
  const checkIn = fromISODate(checkInISO);
  const checkOut = fromISODate(checkOutISO);
  if (!checkIn || !checkOut) return 'Date non valide.';

  const today = fromISODate(toISODate(new Date()))!;
  if (checkIn < today) return 'La data di arrivo è nel passato.';

  const nights = nightsBetween(checkIn, checkOut);
  if (nights <= 0) return 'Il check-out deve essere successivo al check-in.';
  if (nights < BOOKING_CONFIG.minNights) {
    return `Soggiorno minimo ${BOOKING_CONFIG.minNights} notti.`;
  }
  if (guests < 1 || guests > BOOKING_CONFIG.maxGuests) {
    return `Numero ospiti tra 1 e ${BOOKING_CONFIG.maxGuests}.`;
  }

  const requested = new Set(nightsOf(checkIn, checkOut));
  const blocked = await getBlockedNights();
  if (blocked.some((n) => requested.has(n))) {
    return 'Alcune notti selezionate non sono più disponibili.';
  }
  return null;
}
