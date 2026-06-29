'use client';

import { useEffect, useMemo, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { Minus, Plus, Loader2, CalendarDays, ShieldCheck } from 'lucide-react';
import { addDays, fromISODate, nightsBetween, nightsOf, toISODate } from '@/lib/dates';
import { computePrice, formatMoney } from '@/lib/pricing';
import type { BlockedRange, PaymentMode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Policy {
  minNights: number;
  maxGuests: number;
  depositPercent: number;
  currency: string;
}

const DEFAULT_POLICY: Policy = { minNights: 3, maxGuests: 10, depositPercent: 30, currency: 'eur' };

export default function BookingWidget() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('full');
  const [blocked, setBlocked] = useState<BlockedRange[]>([]);
  const [policy, setPolicy] = useState<Policy>(DEFAULT_POLICY);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load availability + booking policy.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/availability', { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!active) return;
        setBlocked(data.blocked ?? []);
        setPolicy({ ...DEFAULT_POLICY, ...data.policy });
      } catch {
        if (active) setError('Disponibilità non caricata. Riprova.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const today = useMemo(() => fromISODate(toISODate(new Date()))!, []);

  // Individual occupied nights, for fast span validation.
  const blockedNights = useMemo(() => {
    const set = new Set<string>();
    for (const b of blocked) {
      for (const n of nightsOf(fromISODate(b.from)!, fromISODate(b.to)!)) set.add(n);
    }
    return set;
  }, [blocked]);

  // react-day-picker disabled matchers: past days + each booked night
  // (inclusive [checkIn, checkOut-1] so the checkout morning stays bookable).
  const disabled = useMemo(
    () => [
      { before: today },
      ...blocked.map((b) => ({
        from: fromISODate(b.from)!,
        to: addDays(fromISODate(b.to)!, -1),
      })),
    ],
    [today, blocked],
  );

  const nights = range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;

  const price = useMemo(() => {
    if (!range?.from || !range?.to || nights <= 0) return null;
    return computePrice(range.from, range.to, paymentMode);
  }, [range, nights, paymentMode]);

  function handleSelect(next: DateRange | undefined) {
    setError(null);
    if (next?.from && next?.to) {
      // Reject a range that jumps over a booked night.
      const spansBlocked = nightsOf(next.from, next.to).some((n) => blockedNights.has(n));
      if (spansBlocked) {
        setError('Le date selezionate includono notti non disponibili.');
        setRange({ from: next.from, to: undefined });
        return;
      }
    }
    setRange(next);
  }

  async function handleSubmit() {
    if (!range?.from || !range?.to) {
      setError('Seleziona le date di arrivo e partenza.');
      return;
    }
    if (nights < policy.minNights) {
      setError(`Soggiorno minimo ${policy.minNights} notti.`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkIn: toISODate(range.from),
          checkOut: toISODate(range.to),
          guests,
          paymentMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Errore durante la prenotazione.');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore imprevisto.');
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      {/* Calendar */}
      <div className="rounded-2xl bg-bg p-4 shadow-soft ring-1 ring-sea-light/60 sm:p-6">
        {loading ? (
          <div className="flex h-72 items-center justify-center text-ink-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <DayPicker
            mode="range"
            numberOfMonths={1}
            selected={range}
            onSelect={handleSelect}
            disabled={disabled}
            min={policy.minNights}
            startMonth={today}
            className="rdp-villa"
            classNames={{
              month_caption: 'flex items-center justify-center h-10 font-display text-lg text-ink',
              weekday: 'text-ink-muted text-xs font-medium pb-2',
              day: 'p-0.5',
            }}
          />
        )}
        <p className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
          <CalendarDays className="h-3.5 w-3.5" />
          Le date in grigio non sono disponibili. Soggiorno minimo {policy.minNights} notti.
        </p>
      </div>

      {/* Summary / actions */}
      <aside className="flex flex-col gap-5 rounded-2xl bg-sea-deep p-6 text-white shadow-lift">
        <div>
          <p className="font-display text-2xl">
            {price ? formatMoney(price.amountTotal, policy.currency) : 'Da €420'}
            <span className="ml-1 align-middle text-sm font-sans text-white/70">
              {price ? `· ${nights} notti` : '/ notte'}
            </span>
          </p>
          <p className="mt-1 text-sm text-white/70">
            {range?.from
              ? `Arrivo ${toISODate(range.from)}${range.to ? ` → Partenza ${toISODate(range.to)}` : ''}`
              : 'Seleziona le tue date nel calendario.'}
          </p>
        </div>

        {/* Guests stepper */}
        <div className="flex items-center justify-between border-y border-white/15 py-3">
          <span className="text-sm">Ospiti</span>
          <div className="flex items-center gap-3">
            <StepBtn
              aria-label="Riduci ospiti"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
            >
              <Minus className="h-4 w-4" />
            </StepBtn>
            <span className="w-6 text-center tabular-nums">{guests}</span>
            <StepBtn
              aria-label="Aumenta ospiti"
              onClick={() => setGuests((g) => Math.min(policy.maxGuests, g + 1))}
              disabled={guests >= policy.maxGuests}
            >
              <Plus className="h-4 w-4" />
            </StepBtn>
          </div>
        </div>

        {/* Payment mode */}
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Modalità di pagamento">
          <PayOption
            active={paymentMode === 'full'}
            onClick={() => setPaymentMode('full')}
            title="Saldo intero"
            sub="Paga ora il soggiorno"
          />
          <PayOption
            active={paymentMode === 'deposit'}
            onClick={() => setPaymentMode('deposit')}
            title={`Deposito ${policy.depositPercent}%`}
            sub="Salda all’arrivo"
          />
        </div>

        {/* Price breakdown */}
        {price && (
          <dl className="space-y-1.5 text-sm text-white/85">
            <Row label={`${formatMoney(price.nightsSubtotal / Math.max(nights, 1), policy.currency)} × ${nights} notti`} value={formatMoney(price.nightsSubtotal, policy.currency)} />
            <Row label="Pulizia finale" value={formatMoney(price.cleaningFee, policy.currency)} />
            <div className="my-2 h-px bg-white/15" />
            <Row label="Totale soggiorno" value={formatMoney(price.amountTotal, policy.currency)} strong />
            {paymentMode === 'deposit' && (
              <>
                <Row label="Da pagare ora" value={formatMoney(price.amountDue, policy.currency)} accent />
                <Row label="Saldo all’arrivo" value={formatMoney(price.balanceDue, policy.currency)} />
              </>
            )}
          </dl>
        )}

        {error && (
          <p className="rounded-lg bg-white/10 px-3 py-2 text-sm text-sunset" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !range?.to}
          className={cn(
            'mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sunset px-6',
            'font-medium text-ink transition-colors duration-200 ease-out-quart',
            'hover:bg-sunset-deep hover:text-white focus-visible:outline focus-visible:outline-2',
            'focus-visible:outline-offset-2 focus-visible:outline-sunset disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Reindirizzamento…
            </>
          ) : paymentMode === 'deposit' ? (
            <>Prenota con deposito</>
          ) : (
            <>Prenota ora</>
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-white/60">
          <ShieldCheck className="h-3.5 w-3.5" /> Pagamento sicuro con Stripe
        </p>
      </aside>
    </div>
  );
}

function StepBtn({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white/60 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function PayOption({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        'rounded-xl border px-3 py-2.5 text-left transition-colors duration-200',
        active
          ? 'border-sunset bg-sunset/15'
          : 'border-white/20 hover:border-white/45',
      )}
    >
      <span className="block text-sm font-medium">{title}</span>
      <span className="block text-xs text-white/65">{sub}</span>
    </button>
  );
}

function Row({
  label,
  value,
  strong,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={cn(strong && 'font-medium text-white')}>{label}</dt>
      <dd className={cn('tabular-nums', strong && 'font-medium text-white', accent && 'text-sunset')}>
        {value}
      </dd>
    </div>
  );
}
