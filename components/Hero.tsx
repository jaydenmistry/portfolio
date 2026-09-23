import { site } from '@/lib/data';
import { resumeEvent } from '@/lib/analytics';
import HeroTopology from '@/components/figures/HeroTopology';

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-name" className="grid gap-16 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:gap-[4.5rem]">
      <div className="flex flex-col gap-5 md:gap-7">
        <p className="m-0 font-mono text-meta text-graphite-2">
          Software engineer <span aria-hidden>·</span> {site.education}
        </p>
        <h1
          id="hero-name"
          className="m-0 text-[clamp(3rem,12.5vw,6.75rem)] xl:text-[clamp(4.5rem,7.6vw,6.75rem)] font-semibold leading-[0.92] tracking-tightest text-graphite"
        >
          {site.name}
        </h1>
        <p className="m-0 max-w-[40rem] text-[1.375rem] leading-[1.25] tracking-[-0.015em] text-graphite md:text-[2rem] md:leading-[1.22]">
          {site.headline}
        </p>
        <p className="m-0 max-w-[36rem] text-body text-graphite-2 md:text-body-lg">{site.subhead}</p>

        <div className="flex flex-col gap-5 pt-1 md:gap-6 md:pt-2">
          <div className="flex flex-wrap gap-3">
            <a href="#work" className="btn-dark">
              See selected work
            </a>
            <a href={site.resumePath} className="btn-line" {...resumeEvent('hero')}>
              Résumé (PDF)
            </a>
          </div>
          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1 p-0 text-[0.9375rem]" aria-label="Elsewhere">
            <li>
              <a className="ulink inline-block py-1 text-graphite" href={site.github}>
                GitHub
              </a>
            </li>
            <li>
              <a className="ulink inline-block py-1 text-graphite" href={site.linkedin}>
                LinkedIn
              </a>
            </li>
            <li>
              <a className="ulink inline-block py-1 text-graphite" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
          </ul>
          <p className="m-0 flex items-center gap-3 font-mono text-meta text-graphite">
            <span aria-hidden className="inline-block h-2 w-2 bg-signal" />
            {site.availability}
          </p>
        </div>
      </div>

      {/* Desktop only. On narrower screens the full diagram lives in the infrastructure section. */}
      <div className="hidden pt-10 xl:block">
        <HeroTopology />
      </div>
    </section>
  );
}
