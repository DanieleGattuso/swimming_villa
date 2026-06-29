import { Star } from 'lucide-react';
import { REVIEWS } from '@/lib/content';
import { cn } from '@/lib/utils';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} su 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('h-4 w-4', i < n ? 'fill-sunset text-sunset' : 'text-sea-light')}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [lead, ...rest] = REVIEWS;
  return (
    <section id="recensioni" className="bg-surface">
      <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          title="Chi ci ha soggiornato"
          lead="Le parole degli ospiti raccontano la villa meglio di qualsiasi descrizione."
        />

        <div className="mt-14 grid gap-x-12 gap-y-12 lg:grid-cols-3">
          {/* Featured */}
          <Reveal className="lg:col-span-3">
            <figure className="border-l-0">
              <Stars n={lead.rating} />
              <blockquote className="mt-5 max-w-4xl font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-snug text-ink">
                “{lead.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-ink-muted">
                <span className="font-medium text-ink">{lead.author}</span> · {lead.origin} ·{' '}
                {lead.stay}
              </figcaption>
            </figure>
          </Reveal>

          {/* Supporting */}
          {rest.map((r, i) => (
            <Reveal as="article" key={r.author} index={i}>
              <Stars n={r.rating} />
              <blockquote className="mt-4 text-lg leading-relaxed text-ink">“{r.quote}”</blockquote>
              <p className="mt-4 text-sm text-ink-muted">
                <span className="font-medium text-ink">{r.author}</span> · {r.origin} · {r.stay}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
