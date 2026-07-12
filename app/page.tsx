import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Infrastructure from '@/components/Infrastructure';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Metrics from '@/components/Metrics';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Infrastructure />
        <Experience />
        <Skills />
        <Metrics />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
