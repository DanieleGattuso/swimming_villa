/**
 * Single source of truth for marketing copy + imagery.
 * ─────────────────────────────────────────────────────────────────────────
 * IMAGES: the `src` values below are Unsplash PLACEHOLDERS (marked TODO).
 * Replace them with The Swimming Villa's own photography — ideally drop the
 * files into /public/images and point `src` at e.g. "/images/hero.jpg".
 * Alt text is part of the brand voice: keep it specific and evocative.
 */

const ph = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const VILLA = {
  name: 'The Swimming Villa',
  tagline: 'Una villa privata con piscina a strapiombo sul mare di Cefalù.',
  location: 'Cefalù · Sicilia',
  intro:
    'Pietra calda, acqua salata e il silenzio del Mediterraneo. The Swimming Villa è un rifugio privato dove le giornate si misurano in tuffi e tramonti, a pochi minuti dal centro normanno di Cefalù.',
  email: 'stay@theswimmingvilla.com',
  phone: '+39 333 000 0000',
  address: 'Contrada Mazzaforno, 90015 Cefalù (PA), Sicilia',
  // Maps embed query — swap for exact coordinates of the property.
  mapQuery: 'Mazzaforno, Cefalù, Sicilia',
};

export const NAV = [
  { label: 'La Villa', href: '#villa' },
  { label: 'Servizi', href: '#servizi' },
  { label: 'Galleria', href: '#galleria' },
  { label: 'Recensioni', href: '#recensioni' },
  { label: 'Prenota', href: '#prenota' },
];

export const HERO = {
  // TODO: replace with a 6–10s silent loop of the pool/villa (mp4 + webm in /public).
  videoSrc: '', // e.g. "/video/villa-loop.mp4" — leave empty to use the poster image
  posterSrc: ph('1582719508461-905c673771fd', 2000), // TODO villa/pool at golden hour
  posterAlt:
    'La piscina a sfioro di The Swimming Villa al tramonto, con il mare di Cefalù sullo sfondo',
  eyebrow: 'Cefalù · Sicilia',
  title: 'Il mare comincia\ndal bordo piscina',
  subtitle:
    'Una dimora privata sospesa fra la pietra siciliana e il blu del Tirreno. Sei camere, una piscina a sfioro, e niente altro intorno se non la luce.',
};

export const AMENITIES = [
  { icon: 'Waves', title: 'Piscina a sfioro', text: 'Vasca a sfioro riscaldata di 18 metri affacciata sul mare, con zona idromassaggio.' },
  { icon: 'Wifi', title: 'Wi-Fi in fibra', text: 'Connessione 1 Gbps in tutta la proprietà, ideale anche per lo smart working.' },
  { icon: 'UtensilsCrossed', title: 'Chef su richiesta', text: 'Cucina siciliana a domicilio: dalla colazione alla cena sulla terrazza.' },
  { icon: 'Wind', title: 'Aria condizionata', text: 'Climatizzazione silenziosa in tutte le sei camere matrimoniali.' },
  { icon: 'Car', title: 'Parcheggio privato', text: 'Posti auto interni alla proprietà e servizio transfer dall’aeroporto di Palermo.' },
  { icon: 'TreePalm', title: 'Giardino mediterraneo', text: 'Ulivi secolari, agrumeto e angoli ombreggiati per la siesta.' },
  { icon: 'ConciergeBell', title: 'Concierge dedicato', text: 'Escursioni, barca privata, prenotazioni: un referente per tutto il soggiorno.' },
  { icon: 'BedDouble', title: 'Sei camere', text: 'Fino a 10 ospiti, biancheria in lino e bagni in pietra locale.' },
];

export const GALLERY = [
  { src: ph('1571896349842-33c89424de2d'), alt: 'La piscina a sfioro al crepuscolo con le luci della villa accese', span: 'wide' },
  { src: ph('1505691938895-1758d7feb511'), alt: 'Camera matrimoniale con tende di lino mosse dalla brezza marina' },
  { src: ph('1520250497591-112f2f40a3f4'), alt: 'Terrazza in pietra con tavolo apparecchiato per la cena al tramonto' },
  { src: ph('1566073771259-6a8506099945'), alt: 'Dettaglio del giardino mediterraneo con ulivi e agrumi', span: 'tall' },
  { src: ph('1564013799919-ab600027ffc6'), alt: 'Facciata della villa in pietra calcarea sotto il sole di mezzogiorno' },
  { src: ph('1540541338287-41700207dee6'), alt: 'Vista dall’alto della piscina che incontra il blu del Tirreno', span: 'wide' },
];

export const REVIEWS = [
  { quote: 'Ci siamo svegliati ogni mattina con il rumore del mare e ci siamo addormentati con i grilli. La piscina al tramonto è qualcosa che non dimenticheremo.', author: 'Giulia & Marco', origin: 'Milano, Italia', stay: 'Luglio 2025', rating: 5 },
  { quote: 'The villa is impeccable — every stone, every detail. The concierge arranged a private boat to the Aeolian islands. Flawless.', author: 'The Hartley Family', origin: 'London, UK', stay: 'Agosto 2025', rating: 5 },
  { quote: 'Abbiamo festeggiato qui il nostro anniversario in dieci amici. Spazio, privacy e una cucina siciliana indimenticabile. Torneremo.', author: 'Elena R.', origin: 'Roma, Italia', stay: 'Settembre 2025', rating: 5 },
];

export const VILLA_STATS = [
  { value: '6', label: 'Camere' },
  { value: '10', label: 'Ospiti' },
  { value: '18 m', label: 'Piscina a sfioro' },
  { value: '4 min', label: 'Dal centro di Cefalù' },
];
