import {
  Waves,
  Wifi,
  UtensilsCrossed,
  Wind,
  Car,
  TreePalm,
  ConciergeBell,
  BedDouble,
  type LucideIcon,
} from 'lucide-react';
import { AMENITIES } from '@/lib/content';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const ICONS: Record<string, LucideIcon> = {
  Waves,
  Wifi,
  UtensilsCrossed,
  Wind,
  Car,
  TreePalm,
  ConciergeBell,
  BedDouble,
};

export default function Amenities() {
  return (
    <section id="servizi" className="bg-surface">
      <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          title="Tutto il necessario, niente di superfluo"
          lead="Una proprietà pensata per soggiorni lenti: spazi ampi, servizi su misura e il mare a portata di tuffo."
        />

        <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {AMENITIES.map((a, i) => {
            const Icon = ICONS[a.icon] ?? Waves;
            return (
              <Reveal as="li" key={a.title} index={i % 4} className="flex flex-col">
                <Icon className="h-7 w-7 text-sea" strokeWidth={1.4} />
                <h3 className="mt-4 font-display text-xl text-ink">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{a.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
