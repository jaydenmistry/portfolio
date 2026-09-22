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
      <main
        id="main"
        className="mx-auto flex max-w-sheet flex-col gap-24 px-5 pb-24 pt-10 md:gap-32 md:px-12 md:pb-32 md:pt-24 xl:px-24"
      >
        <div className="flex flex-col gap-14 md:gap-24">
          <Hero />
          <WorkIndex />
        </div>
        <Projects />
        <Infrastructure />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
