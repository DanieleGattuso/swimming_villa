import { BOOKING_CONFIG, type Season } from './config';
import { fromISODate, nightsOf } from './dates';
import type { PaymentMode, PriceBreakdown } from './types';

const MMDD = (d: Date) =>
  `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** True when a MM-DD falls inside a season range (handles year wrap-around). */
function inSeason(mmdd: string, s: Season): boolean {
  if (s.from <= s.to) return mmdd >= s.from && mmdd <= s.to;
  // wraps over new year, e.g. 10-16 → 05-14
  return mmdd >= s.from || mmdd <= s.to;
}

/** Nightly rate (in euros) for a given calendar night. */
export function nightlyRate(date: Date): number {
  const mmdd = MMDD(date);
  const match = BOOKING_CONFIG.seasons.find((s) => inSeason(mmdd, s));
  return match ? match.nightly : BOOKING_CONFIG.baseNightly;
}

/**
 * Authoritative price calculation. Used both by the API (source of truth) and
 * the client widget (live preview). All money returned in minor units (cents).
 */
export function computePrice(
  checkIn: Date,
  checkOut: Date,
  paymentMode: PaymentMode = 'full',
): PriceBreakdown {
  const nights = nightsOf(checkIn, checkOut);
  const nightsSubtotal = nights.reduce(
    (sum, iso) => sum + nightlyRate(fromISODate(iso)!) * 100,
    0,
  );
  const cleaningFee = nights.length > 0 ? BOOKING_CONFIG.cleaningFee * 100 : 0;
  const amountTotal = nightsSubtotal + cleaningFee;

  const depositPercent = BOOKING_CONFIG.depositPercent;
  const amountDue =
    paymentMode === 'deposit'
      ? Math.round((amountTotal * depositPercent) / 100)
      : amountTotal;

  return {
    nights: nights.length,
    nightsSubtotal,
    cleaningFee,
    amountTotal,
    amountDue,
    balanceDue: amountTotal - amountDue,
    currency: BOOKING_CONFIG.currency,
    paymentMode,
    depositPercent,
  };
}

/** Format minor units as a localized currency string. */
export function formatMoney(cents: number, currency = BOOKING_CONFIG.currency): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
