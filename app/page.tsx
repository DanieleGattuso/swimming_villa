import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Amenities from '@/components/Amenities';
import Gallery from '@/components/Gallery';
import BookingSection from '@/components/BookingSection';
import Reviews from '@/components/Reviews';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Amenities />
        <Gallery />
        <BookingSection />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
