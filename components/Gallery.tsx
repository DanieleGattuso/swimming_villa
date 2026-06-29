import Image from 'next/image';
import { GALLERY } from '@/lib/content';
import { cn } from '@/lib/utils';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function Gallery() {
  return (
    <section id="galleria" className="mx-auto max-w-shell px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        title="Uno sguardo dentro la villa"
        lead="Pietra, lino e luce mediterranea. Ogni angolo è pensato per rallentare."
      />

      <div className="mt-14 grid auto-rows-[44vw] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 md:grid-cols-4">
        {GALLERY.map((img, i) => (
          <Reveal
            key={img.src}
            index={i % 4}
            className={cn(
              'group relative overflow-hidden rounded-2xl bg-sea-light',
              img.span === 'wide' && 'col-span-2',
              img.span === 'tall' && 'row-span-2',
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
