import BookingWidget from './BookingWidget';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function BookingSection() {
  return (
    <section id="prenota" className="scroll-mt-20 bg-stone/40">
      <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          title="Prenota The Swimming Villa"
          lead="Scegli le date, controlla la disponibilità in tempo reale e conferma in pochi secondi con pagamento sicuro."
        />
        <Reveal y={28} className="mt-12">
          <BookingWidget />
        </Reveal>
      </div>
    </section>
  );
}
