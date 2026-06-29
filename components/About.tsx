import Image from 'next/image';
import { VILLA, GALLERY } from '@/lib/content';
import Reveal from './Reveal';

export default function About() {
  const img = GALLERY[3] ?? GALLERY[0];
  return (
    <section id="villa" className="mx-auto max-w-shell px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-sea">{VILLA.location}</p>
          <h2 className="mt-4 text-[clamp(1.9rem,4vw,3.25rem)] text-ink">
            {VILLA.tagline}
          </h2>
          <p className="measure mt-6 text-lg text-ink-muted">{VILLA.intro}</p>
          <a
            href="#prenota"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-sea px-7 font-medium text-white transition-colors hover:bg-sea-deep"
          >
            Prenota il tuo soggiorno
          </a>
        </Reveal>

        <Reveal y={32} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sea-light shadow-lift">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
