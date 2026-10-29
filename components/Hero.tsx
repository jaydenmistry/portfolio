import type { CSSProperties } from 'react';
import { site } from '@/lib/data';
import { resumeEvent } from '@/lib/analytics';
import { ArrowUpRightIcon, ChevronRightIcon } from '@/components/icons';

const step = (i: number) => ({ '--i': i }) as CSSProperties;

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-name" className="hero-exit container-content flex flex-col items-center pb-20 pt-16 text-center md:pb-28 md:pt-28">
      <p className="hero-in m-0 text-balance text-callout text-label-2 md:text-headline" style={step(0)}>
        Software engineer <span aria-hidden>·</span> {site.education}
      </p>
      <h1 id="hero-name" className="hero-in m-0 mt-3 text-display text-label" style={step(1)}>
        {site.name}
      </h1>
      <p className="hero-in m-0 mt-5 max-w-[24ch] text-balance text-title-2 text-label md:mt-6" style={step(2)}>
        {site.headline}
      </p>
      <p className="hero-in m-0 mt-5 max-w-[38rem] text-pretty text-body text-label-2 md:text-body-lg" style={step(3)}>
        {site.subhead}
      </p>

      <div className="hero-in mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4" style={step(4)}>
        <a href="#work" className="button-filled min-h-12 px-7 text-[1.0625rem]">
          See my work
        </a>
        <a href={site.resumePath} className="link-chevron text-[1.0625rem]" {...resumeEvent('hero')}>
          Résumé (PDF)
          <ArrowUpRightIcon width={15} height={15} />
        </a>
      </div>

      <p className="hero-in m-0 mt-8 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-callout text-label-2" style={step(5)}>
        <span aria-hidden className="availability-dot relative inline-block h-2 w-2 rounded-full bg-success" />
        {site.availability}
        <a href="#contact" className="link-chevron whitespace-nowrap">
          Get in touch
          <ChevronRightIcon width={14} height={14} />
        </a>
      </p>
    </section>
  );
}
