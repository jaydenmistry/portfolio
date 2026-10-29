import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WorkIndex from '@/components/WorkIndex';
import Projects from '@/components/Projects';
import Infrastructure from '@/components/Infrastructure';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <div className="mx-auto flex max-w-sheet flex-col gap-24 px-5 pb-24 md:gap-32 md:px-12 md:pb-32 xl:px-24">
          <WorkIndex />
          <Projects />
          <Infrastructure />
          <Experience />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
