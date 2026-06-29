import { MapPin, Mail, Phone } from 'lucide-react';
import { VILLA, NAV } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="bg-sea-deep text-white">
      <div className="mx-auto grid max-w-shell gap-12 px-5 py-20 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">{VILLA.name}</p>
          <p className="mt-3 max-w-xs text-sm text-white/70">{VILLA.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h3 className="font-display text-base text-white/90">Naviga</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {NAV.map((item) => (
              <li key={item.href}>
                <a className="transition-colors hover:text-white" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-base text-white/90">Contatti</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sunset" />
              <span>{VILLA.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-sunset" />
              <a className="hover:text-white" href={`mailto:${VILLA.email}`}>
                {VILLA.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-sunset" />
              <a className="hover:text-white" href={`tel:${VILLA.phone.replace(/\s/g, '')}`}>
                {VILLA.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-shell flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-white/50 sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} {VILLA.name}. Tutti i diritti riservati.</p>
          <p>{VILLA.location}</p>
        </div>
      </div>
    </footer>
  );
}
