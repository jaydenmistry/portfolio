import type { ReactNode } from 'react';
import SectionLabel from '@/components/SectionLabel';
import type { Project } from '@/lib/data';
import { repoEvent } from '@/lib/analytics';

type Props = {
  project: Project;
  total: number;
  /** Section number and name, shown only on the first case study of a section. */
  label?: { number: string; name: string };
  next?: Project;
  /** Replaces the screenshot slot, e.g. with a diagram. */
  figure?: ReactNode;
};

function Meta({ project }: { project: Project }) {
  const rows = [
    ['Role', project.role],
    ['Timeline', project.timeline],
    ['Status', project.status],
    ['Type', project.kind],
  ].filter((r): r is [string, string] => Boolean(r[1]));
  return (
    <dl className="m-0 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-1">
          <dt className="font-mono text-meta text-graphite-2">{k}</dt>
          <dd className="m-0 text-[0.9375rem] text-graphite md:text-base">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function BuiltList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="m-0 font-mono text-meta font-medium text-graphite">What I built</h4>
      <ul className="m-0 list-none border-b border-rule p-0">
        {items.map((item, i) => (
          <li
            key={item}
            className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 border-t border-rule py-3.5 text-body text-graphite"
          >
            <span aria-hidden className="pt-[0.2rem] font-mono text-meta text-signal-ink">
              {String.fromCharCode(97 + i)}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StackLine({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="m-0 font-mono text-meta font-medium text-graphite">Stack</h4>
      <p className="m-0 font-mono text-meta leading-relaxed text-graphite-2">{stack.join(' · ')}</p>
    </div>
  );
}

function Screenshot({ project }: { project: Project }) {
  const fig = project.figure;
  if (!fig) return null;
  return (
    <figure className="m-0 flex flex-col gap-3">
      {fig.src ? (
        // The capture is pre-sized, so serve it directly without optimization.
        // Fixed dimensions prevent layout shift.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fig.src}
          alt={fig.alt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="block aspect-[16/10] h-auto w-full border border-rule object-cover object-top"
        />
      ) : (
        <div
          role="img"
          aria-label={`Screenshot placeholder: ${fig.alt}`}
          className="hatch flex aspect-[16/10] flex-col items-center justify-center gap-2 border border-dashed border-rule-strong p-6 text-center"
        >
          <span className="font-mono text-meta font-medium text-signal-ink">Screenshot placeholder</span>
          <span className="text-base text-graphite">{fig.alt}</span>
        </div>
      )}
      <figcaption className="font-mono text-meta text-graphite-2">
        fig. {fig.number}. {fig.caption}
        {fig.src ? (
          <>
            {' '}
            <a className="ulink text-graphite" href={fig.src}>
              View full size<span aria-hidden> ↗</span>
            </a>
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}

export default function CaseStudy({ project, total, label, next, figure }: Props) {
  const headingId = `${project.id}-title`;
  const visual = figure ?? (project.figure ? <Screenshot project={project} /> : null);
  return (
    <article id={project.id} aria-labelledby={headingId} className="flex scroll-mt-20 flex-col gap-10 md:gap-12">
      {label ? (
        <SectionLabel number={label.number} name={label.name} note={`Project ${project.number} of ${String(total).padStart(2, '0')}`} />
      ) : (
        <p className="m-0 flex items-baseline gap-4 font-mono text-meta text-graphite-2">
          <span className="text-signal-ink">{project.number}</span>
          <span aria-hidden className="flex-1 self-center border-t border-rule" />
          Project {project.number} of {String(total).padStart(2, '0')}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-[4.5rem]">
        <div className="flex flex-col gap-4">
          <h3
            id={headingId}
            className={`m-0 font-semibold leading-[0.98] tracking-display text-graphite ${
              project.title.length > 24 ? 'text-[2.25rem] md:text-[3.5rem]' : 'text-[2.75rem] md:text-[4.5rem]'
            }`}
          >
            {project.title}
          </h3>
          <p className="m-0 max-w-[40rem] text-[1.1875rem] leading-[1.35] text-graphite md:text-2xl md:leading-[1.3]">
            {project.summary}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <Meta project={project} />
          {project.live || project.repo ? (
            <p className="m-0 flex flex-wrap gap-x-7 gap-y-3 text-[0.9375rem] md:text-base">
              {project.live ? (
                <a className="ulink text-graphite" href={project.live.href}>
                  {project.live.label} <span aria-hidden>↗</span>
                </a>
              ) : null}
              {project.repo ? (
                <a className="ulink text-graphite" href={project.repo} {...repoEvent(project.id)}>
                  Source on GitHub <span aria-hidden>↗</span>
                </a>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-[4.5rem]">
        {visual ? (
          <>
            <div>{visual}</div>
            <div className="flex flex-col gap-7">
              <BuiltList items={project.built} />
              <StackLine stack={project.stack} />
            </div>
          </>
        ) : (
          <>
            <BuiltList items={project.built} />
            <StackLine stack={project.stack} />
          </>
        )}
      </div>

      {next ? (
        <a
          href={`#${next.id}`}
          className="row-link flex items-center justify-between gap-4 border-y border-rule py-5 text-graphite no-underline md:px-3"
        >
          <span className="flex flex-col gap-1">
            <span className="font-mono text-meta text-graphite-2">Next project</span>
            <span className="text-[1.0625rem] font-medium md:text-lg">
              {next.number} · {next.title}
            </span>
          </span>
          <span aria-hidden className="arrow text-lg">
            →
          </span>
        </a>
      ) : null}
    </article>
  );
}
