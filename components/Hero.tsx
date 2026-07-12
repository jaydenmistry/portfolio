import { site } from '@/lib/data';
import HeroBackground from '@/components/HeroBackground';
import SystemPanel from '@/components/SystemPanel';
import Reveal from '@/components/Reveal';
import { GitHubIcon, LinkedInIcon, MailIcon, DownloadIcon } from '@/components/icons';

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <HeroBackground />

      <div className="relative mx-auto grid w-full max-w-content items-center gap-14 px-5 py-24 md:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Reveal>
            <p className="section-label">Software Engineer / Infrastructure</p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tightest text-ink sm:text-5xl md:text-6xl lg:text-7xl">
              I build products, platforms, and the systems that{' '}
              <span className="text-accent">keep them running.</span>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ink-dim md:text-lg">
              {site.subhead}
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#projects" className="btn-primary">
                View My Work
              </a>
              <a href={site.resumePath} download className="btn-secondary">
                <DownloadIcon />
                Download Resume
              </a>
              <a href="#contact" className="btn-ghost">
                Let’s Connect →
              </a>
            </div>
          </Reveal>

          <Reveal delay={460}>
            <ul className="mt-10 flex items-center gap-5" aria-label="Social links">
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="text-ink-dim transition-colors hover:text-accent"
                >
                  <GitHubIcon />
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="text-ink-dim transition-colors hover:text-accent"
                >
                  <LinkedInIcon />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  aria-label={`Email ${site.name}`}
                  className="text-ink-dim transition-colors hover:text-accent"
                >
                  <MailIcon />
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={520} className="lg:justify-self-end lg:w-full lg:max-w-md">
          <SystemPanel />
        </Reveal>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-hidden>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-mute">
          Scroll to explore
        </span>
        <span className="block h-10 w-px overflow-hidden bg-line">
          <span className="scroll-hint block h-full w-full bg-accent" />
        </span>
      </div>
    </section>
  );
}
