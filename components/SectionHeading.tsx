import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';

/**
 * Section title + optional lead. Deliberately NOT an uppercase eyebrow on every
 * section (that's AI scaffolding) — just a committed display heading.
 */
export default function SectionHeading({
  title,
  lead,
  align = 'left',
  tone = 'ink',
  className,
}: {
  title: ReactNode;
  lead?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'ink' | 'light';
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <h2
        className={cn(
          'text-[clamp(1.9rem,4vw,3rem)]',
          tone === 'light' ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            'mt-4 text-lg',
            tone === 'light' ? 'text-white/80' : 'text-ink-muted',
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
