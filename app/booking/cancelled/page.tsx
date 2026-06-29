import Link from 'next/link';
import { XCircle } from 'lucide-react';

export const metadata = { title: 'Pagamento annullato' };

export default function CancelledPage() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-bg px-5 py-20">
      <div className="w-full max-w-md text-center">
        <XCircle className="mx-auto h-14 w-14 text-ink-muted" strokeWidth={1.4} />
        <h1 className="mt-6 font-display text-[clamp(1.8rem,4vw,2.5rem)] text-ink">
          Prenotazione non completata
        </h1>
        <p className="mt-4 text-ink-muted">
          Nessun importo è stato addebitato. Le tue date sono ancora disponibili: puoi riprovare
          quando vuoi.
        </p>
        <Link
          href="/#prenota"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-sea px-7 font-medium text-white transition-colors hover:bg-sea-deep"
        >
          Riprova la prenotazione
        </Link>
      </div>
    </main>
  );
}
