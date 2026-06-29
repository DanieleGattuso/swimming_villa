'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV, VILLA } from '@/lib/content';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[200] transition-colors duration-300 ease-out-quart',
        scrolled ? 'bg-sea-deep/90 backdrop-blur-md shadow-soft' : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-shell items-center justify-between px-5 py-4 text-white sm:px-8">
        <a href="#top" className="font-display text-lg tracking-tight">
          {VILLA.name}
        </a>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {NAV.slice(0, -1).map((item) => (
            <li key={item.href}>
              <a className="text-white/85 transition-colors hover:text-white" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#prenota"
          className="hidden rounded-full bg-sunset px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-sunset-deep hover:text-white md:inline-block"
        >
          Prenota
        </a>

        <button
          type="button"
          className="md:hidden"
          aria-label={open ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <div className="border-t border-white/10 bg-sea-deep/95 px-5 py-4 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1 text-white">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  className="block rounded-lg px-2 py-3 text-base hover:bg-white/10"
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
