import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Work from '@/components/Work';
import Infrastructure from '@/components/Infrastructure';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex flex-col gap-28 pb-28 md:gap-40 md:pb-40">
        <Hero />
        <Work />
        <Infrastructure />
        <div className="mx-auto flex max-w-sheet flex-col gap-24 px-5 md:gap-32 md:px-12 xl:px-24">
          <Experience />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
