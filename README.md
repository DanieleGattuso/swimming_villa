# The Swimming Villa

Direct-booking website for **The Swimming Villa** — a luxury villa with infinity
pool in Cefalù, Sicily. High-conversion, mobile-first, with an interactive
availability calendar and Stripe payments (full stay or refundable deposit).

Built with **Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
react-day-picker · Stripe**.

---

## Architecture

```
the-swimming-villa/
├── app/
│   ├── layout.tsx              # fonts (Marcellus + Mulish), SEO metadata
│   ├── page.tsx               # landing page — composes the sections
│   ├── globals.css            # OKLCH design tokens, calendar theme, base styles
│   ├── booking/
│   │   ├── success/page.tsx   # post-payment confirmation (reads Stripe session)
│   │   └── cancelled/page.tsx # payment cancelled
│   └── api/
│       ├── availability/route.ts     # GET booked ranges + booking policy
│       ├── checkout/route.ts         # POST → validates, prices, opens Stripe Checkout
│       └── webhooks/stripe/route.ts  # POST ← Stripe confirms / expires bookings
├── components/                 # Hero, BookingWidget, Amenities, Gallery, Reviews, …
├── lib/
│   ├── content.ts             # ALL copy + imagery (swap Unsplash placeholders here)
│   ├── config.ts              # rates, seasons, min nights, deposit %  ← edit pricing here
│   ├── pricing.ts             # authoritative price calculation (cents)
│   ├── dates.ts               # date helpers (date-fns)
│   ├── availability.ts        # blocked ranges + server-side stay validation
│   ├── bookings.ts            # data store (JSON file; swap for Prisma in prod)
│   ├── stripe.ts              # lazy server-side Stripe client
│   └── types.ts
├── data/bookings.seed.json     # sample booked dates (so the calendar has blocks)
└── prisma/schema.prisma        # production database model (optional)
```

### Booking flow

1. **Calendar** (`BookingWidget`) fetches `GET /api/availability`, disables booked
   nights + past dates, and previews the price live.
2. On submit, `POST /api/checkout` **re-validates availability and recomputes the
   price server-side** (the client price is never trusted), records a *pending*
   booking that holds the dates, and creates a **Stripe Checkout** session.
3. The browser redirects to Stripe’s hosted, PCI-compliant payment page.
4. Stripe calls `POST /api/webhooks/stripe`; the verified
   `checkout.session.completed` event flips the booking to *confirmed*
   (`checkout.session.expired` releases the dates). **This webhook — not the
   success page — is the source of truth for payment.**
5. The guest lands on `/booking/success`.

Pending holds expire after 30 minutes so abandoned checkouts free their dates.

---

## Getting started

```bash
npm install
cp .env.example .env.local      # add your Stripe test keys
npm run dev                     # http://localhost:3000
```

The calendar works immediately (seed data provides some booked dates).
Payments need Stripe keys.

### Stripe setup

1. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test keys)
   to `.env.local`.
2. Forward webhooks locally and copy the printed `whsec_...` into
   `STRIPE_WEBHOOK_SECRET`:
   ```bash
   npm run stripe:listen
   ```
3. Test card: `4242 4242 4242 4242`, any future expiry / CVC.

### Customising

| Want to change…        | Edit |
|------------------------|------|
| Photos, copy, reviews  | `lib/content.ts` |
| Nightly rates, seasons, deposit %, min nights | `lib/config.ts` |
| Colors / fonts         | `app/globals.css` + `tailwind.config.ts` + `DESIGN.md` |

### Going to production

The JSON-file store (`lib/bookings.ts`) is for dev. For a real deployment use a
database: install Prisma, run the migration against `prisma/schema.prisma`, and
re-implement the four functions in `lib/bookings.ts` against it. Set
`NEXT_PUBLIC_SITE_URL` to your domain and create a Stripe webhook endpoint
pointing at `/api/webhooks/stripe`.

> **Replace the imagery.** All images are Unsplash placeholders (marked `TODO`
> in `lib/content.ts`). Drop the villa’s own photography into `/public/images`
> and point `src` at it.
