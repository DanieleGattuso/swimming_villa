/**
 * Booking & pricing rules for The Swimming Villa.
 * Single source of truth — change rates / policies here.
 * Prices are expressed in whole currency units (euros) and converted to
 * minor units (cents) by the pricing module.
 */

export const CURRENCY = (process.env.NEXT_PUBLIC_CURRENCY ?? 'eur').toLowerCase();

export const DEPOSIT_PERCENT = Number(process.env.DEPOSIT_PERCENT ?? 30);

export interface Season {
  name: string;
  /** inclusive start, MM-DD */
  from: string;
  /** inclusive end, MM-DD */
  to: string;
  /** nightly rate in whole euros */
  nightly: number;
}

export const BOOKING_CONFIG = {
  currency: CURRENCY,
  minNights: 3,
  maxGuests: 10,
  /** fallback nightly rate (euros) when no season matches */
  baseNightly: 480,
  /** one-off cleaning fee (euros) */
  cleaningFee: 180,
  depositPercent: DEPOSIT_PERCENT,
  /**
   * Seasonal nightly rates. Ranges are matched by month-day, so they repeat
   * every year and never need maintenance. Order matters: first match wins.
   */
  seasons: [
    { name: 'Alta stagione', from: '07-01', to: '08-31', nightly: 920 },
    { name: 'Stagione di mezzo', from: '05-15', to: '06-30', nightly: 680 },
    { name: 'Stagione di mezzo', from: '09-01', to: '10-15', nightly: 640 },
    { name: 'Bassa stagione', from: '10-16', to: '05-14', nightly: 420 },
  ] satisfies Season[],
} as const;
