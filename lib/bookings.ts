import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Booking, BookingStatus } from './types';

/**
 * Dev/demo persistence: a JSON file under /data. Simple, runs anywhere, and
 * keeps the booking logic behind a small interface.
 *
 * PRODUCTION: swap the four functions below for a real database (the
 * prisma/schema.prisma included in this repo models the same shape). Nothing
 * else in the app needs to change.
 */

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'bookings.json');
const SEED_FILE = path.join(DATA_DIR, 'bookings.seed.json');

/** Pending (unpaid) holds expire after this many minutes so dates free up. */
const PENDING_HOLD_MINUTES = 30;

async function readAll(): Promise<Booking[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw) as Booking[];
  } catch {
    // first run: seed from committed sample data if present
    try {
      const seed = await fs.readFile(SEED_FILE, 'utf8');
      const parsed = JSON.parse(seed) as Booking[];
      await writeAll(parsed);
      return parsed;
    } catch {
      return [];
    }
  }
}

async function writeAll(bookings: Booking[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf8');
}

function isActive(b: Booking): boolean {
  if (b.status === 'confirmed') return true;
  if (b.status === 'pending') {
    const age = Date.now() - new Date(b.createdAt).getTime();
    return age < PENDING_HOLD_MINUTES * 60_000;
  }
  return false;
}

/** All bookings currently holding dates (confirmed + unexpired pending). */
export async function getActiveBookings(): Promise<Booking[]> {
  return (await readAll()).filter(isActive);
}

export async function createBooking(
  data: Omit<Booking, 'id' | 'createdAt' | 'status'> &
    Partial<Pick<Booking, 'status'>>,
): Promise<Booking> {
  const all = await readAll();
  const booking: Booking = {
    id: randomUUID(),
    status: data.status ?? 'pending',
    createdAt: new Date().toISOString(),
    ...data,
  };
  all.push(booking);
  await writeAll(all);
  return booking;
}

export async function setBookingStatus(
  id: string,
  status: BookingStatus,
  patch: Partial<Booking> = {},
): Promise<Booking | null> {
  const all = await readAll();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, status };
  await writeAll(all);
  return all[idx];
}

export async function getBookingBySession(sessionId: string): Promise<Booking | null> {
  const all = await readAll();
  return all.find((b) => b.stripeSessionId === sessionId) ?? null;
}
