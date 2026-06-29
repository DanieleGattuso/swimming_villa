export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type PaymentMode = 'full' | 'deposit';

export interface Booking {
  id: string;
  /** ISO date (yyyy-MM-dd), night of arrival */
  checkIn: string;
  /** ISO date (yyyy-MM-dd), morning of departure (exclusive night) */
  checkOut: string;
  guests: number;
  status: BookingStatus;
  paymentMode: PaymentMode;
  /** total stay price in minor units (cents) */
  amountTotal: number;
  /** amount actually charged now in minor units (full stay or deposit) */
  amountDue: number;
  currency: string;
  email?: string;
  name?: string;
  stripeSessionId?: string;
  createdAt: string;
}

/** A half-open date range [from, to) that cannot be booked. */
export interface BlockedRange {
  from: string; // yyyy-MM-dd inclusive
  to: string; // yyyy-MM-dd exclusive
}

export interface PriceBreakdown {
  nights: number;
  /** per-night subtotal in cents (before fees) */
  nightsSubtotal: number;
  cleaningFee: number;
  amountTotal: number;
  /** charged now given the payment mode */
  amountDue: number;
  /** remaining balance when a deposit is paid */
  balanceDue: number;
  currency: string;
  paymentMode: PaymentMode;
  depositPercent: number;
}
