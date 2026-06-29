import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isValid,
  parseISO,
} from 'date-fns';

/** yyyy-MM-dd string for a Date (local). */
export function toISODate(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

/** Parse a yyyy-MM-dd string into a Date, or null if invalid. */
export function fromISODate(s: string | undefined | null): Date | null {
  if (!s) return null;
  const d = parseISO(s);
  return isValid(d) ? d : null;
}

/** Number of nights between check-in and check-out (half-open). */
export function nightsBetween(checkIn: Date, checkOut: Date): number {
  return Math.max(0, differenceInCalendarDays(checkOut, checkIn));
}

/**
 * Every night occupied by a [checkIn, checkOut) stay as yyyy-MM-dd strings.
 * The checkout day itself is free (guest leaves that morning).
 */
export function nightsOf(checkIn: Date, checkOut: Date): string[] {
  if (nightsBetween(checkIn, checkOut) <= 0) return [];
  return eachDayOfInterval({ start: checkIn, end: addDays(checkOut, -1) }).map(
    toISODate,
  );
}

/** Human-readable range, e.g. "12 – 19 lug 2026". */
export function formatRange(checkIn: Date, checkOut: Date, locale = 'it'): string {
  void locale;
  const sameMonth =
    checkIn.getMonth() === checkOut.getMonth() &&
    checkIn.getFullYear() === checkOut.getFullYear();
  const left = sameMonth ? format(checkIn, 'd') : format(checkIn, 'd MMM');
  const right = format(checkOut, 'd MMM yyyy');
  return `${left} – ${right}`;
}

export { addDays, parseISO };
