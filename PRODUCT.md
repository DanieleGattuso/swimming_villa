# PRODUCT.md — The Swimming Villa

## What this is
Direct-booking website for **The Swimming Villa**, a private luxury villa with
pool in **Cefalù, Sicily**. The site exists to convert visitors into direct
bookings (bypassing OTA commissions) by selling the experience and making the
date → pay flow effortless.

## Who it's for
- High-intent leisure travellers (couples, families, small groups) planning a
  Mediterranean stay, mostly on **mobile**.
- Browsing in a dreaming-and-comparing mindset: the page must seduce first,
  then make booking frictionless.

## Register
**Brand** — design *is* the product. Image-led luxury hospitality. The visitor's
impression (light, water, stone, calm) is the thing being made.

## Brand voice
Three words: **sun-warmed · serene · effortless**. Not loud, not corporate.
Confident Mediterranean hospitality — the feeling of arriving somewhere private
and timeless. Copy is warm and human, never salesy.

## Aesthetic lane (named reference)
Quiet luxury coastal — closer to a boutique Aeolian/Sicilian retreat brand than
to a booking-OTA. Deep sea-petrol carries the brand; terracotta sunset is the
single call-to-action accent; limestone-light content. NOT editorial-magazine,
NOT travel-OTA card-grid.

## Core flows
1. **Land → desire**: full-bleed hero (villa + pool), one clear CTA.
2. **Choose dates**: interactive calendar (check-in / check-out, guests),
   already-booked dates disabled, live price.
3. **Pay**: Stripe Checkout — full stay or refundable deposit. Webhook confirms.
4. **Reassure**: amenities, gallery, reviews, location.

## Constraints
- Mobile-first, fast, accessible (WCAG AA contrast).
- Real photography required (placeholders are Unsplash, to be swapped for the
  villa's own assets in `lib/content.ts`).
- Payments via Stripe Checkout + webhook confirmation. Never trust client price.

## Non-goals
- No multi-property / channel-manager complexity. One villa, one calendar.
- No account system; booking is guest-checkout via Stripe.
