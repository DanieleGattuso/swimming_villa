import type { Metadata, Viewport } from 'next';
import { Marcellus, Mulish } from 'next/font/google';
import { VILLA } from '@/lib/content';
import './globals.css';

const display = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const body = Mulish({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const description =
  'Villa privata di lusso con piscina a sfioro a Cefalù, Sicilia. Sei camere, fino a 10 ospiti. Prenotazione diretta con disponibilità in tempo reale.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: `${VILLA.name} — Villa con piscina a Cefalù`,
    template: `%s · ${VILLA.name}`,
  },
  description,
  openGraph: {
    title: `${VILLA.name} — Villa con piscina a Cefalù, Sicilia`,
    description,
    type: 'website',
    locale: 'it_IT',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#0d3b46',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable}`}>
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
