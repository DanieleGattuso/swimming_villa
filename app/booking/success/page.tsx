import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { getStripe } from '@/lib/stripe';
import { formatMoney } from '@/lib/pricing';
import { VILLA } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Prenotazione confermata' };

async function loadSession(sessionId?: string) {
  if (!sessionId) return null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    return session;
  } catch {
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session = await loadSession(searchParams.session_id);
  const m = session?.metadata ?? {};

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-sea-deep px-5 py-20 text-white">
      <div className="w-full max-w-lg text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-sunset" strokeWidth={1.4} />
        <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3rem)]">Ci vediamo a Cefalù</h1>
        <p className="mt-4 text-white/80">
          Grazie {session?.customer_details?.name ?? ''}, la tua prenotazione a {VILLA.name} è
          confermata. Riceverai una email con tutti i dettagli del soggiorno.
        </p>

        {session && (
          <dl className="mx-auto mt-8 max-w-sm space-y-2 rounded-2xl bg-white/10 p-6 text-left text-sm">
            {m.checkIn && (
              <div className="flex justify-between">
                <dt className="text-white/70">Arrivo</dt>
                <dd>{m.checkIn}</dd>
              </div>
            )}
            {m.checkOut && (
              <div className="flex justify-between">
                <dt className="text-white/70">Partenza</dt>
                <dd>{m.checkOut}</dd>
              </div>
            )}
            {m.guests && (
              <div className="flex justify-between">
                <dt className="text-white/70">Ospiti</dt>
                <dd>{m.guests}</dd>
              </div>
            )}
            {session.amount_total != null && (
              <div className="flex justify-between border-t border-white/15 pt-2">
                <dt className="text-white/70">
                  {m.paymentMode === 'deposit' ? 'Deposito pagato' : 'Totale pagato'}
                </dt>
                <dd className="font-medium">
                  {formatMoney(session.amount_total, session.currency ?? 'eur')}
                </dd>
              </div>
            )}
            {m.paymentMode === 'deposit' && m.balanceDue && (
              <div className="flex justify-between">
                <dt className="text-white/70">Saldo all’arrivo</dt>
                <dd>{formatMoney(Number(m.balanceDue), session.currency ?? 'eur')}</dd>
              </div>
            )}
          </dl>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-sunset px-7 font-medium text-ink transition-colors hover:bg-sunset-deep hover:text-white"
        >
          Torna alla villa
        </Link>
      </div>
    </main>
  );
}
