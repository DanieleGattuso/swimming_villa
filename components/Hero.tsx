'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { HERO, VILLA_STATS } from '@/lib/content';

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
      {/* Media layer — gradient base shows through if the asset is missing */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sea to-sea-deep">
        {HERO.videoSrc ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO.posterSrc}
          >
            <source src={HERO.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={HERO.posterSrc}
            alt={HERO.posterAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* Scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-sea-deep/85 via-sea-deep/30 to-sea-deep/40" />
      </div>

      <div className="mx-auto w-full max-w-shell px-5 pb-16 pt-32 text-white sm:px-8 sm:pb-24">
        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 text-sm uppercase tracking-[0.25em] text-white/80"
        >
          {HERO.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.02]"
        >
          {HERO.title.split('\n').map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          className="mt-6 max-w-xl text-lg text-white/85"
        >
          {HERO.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href="#prenota"
            className="inline-flex h-12 items-center rounded-full bg-sunset px-7 font-medium text-ink transition-colors hover:bg-sunset-deep hover:text-white"
          >
            Verifica disponibilità
          </a>
          <a
            href="#galleria"
            className="inline-flex h-12 items-center rounded-full border border-white/40 px-7 font-medium text-white transition-colors hover:bg-white/10"
          >
            Scopri la villa
          </a>
        </motion.div>

        {/* Stats strip */}
        <div className="mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
          {VILLA_STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl text-white sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center text-white/70"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      )}
    </section>
  );
}
