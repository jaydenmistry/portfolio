import type { Project } from '@/lib/data';
import { repoEvent } from '@/lib/analytics';
import { ArrowUpRightIcon, CheckIcon } from '@/components/icons';
import { Chips } from '@/components/WorkOverview';
import ScreenshotViewer from '@/components/ScreenshotViewer';

export function BuiltList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="m-0 text-callout font-medium text-label-2">What I built</h4>
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 text-body text-label md:text-body-lg">
            <CheckIcon aria-hidden className="mt-[0.2em] text-accent" width={20} height={20} />
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Facts({ project }: { project: Project }) {
  const rows = [
    ['Role', project.role],
    ['Timeline', project.timeline],
    ['Status', project.status],
    ['Type', project.kind],
  ].filter((r): r is [string, string] => Boolean(r[1]));
  return (
    <div className="flex flex-col gap-8">
      <dl className="m-0 flex flex-col gap-5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5">
            <dt className="text-callout text-label-2">{k}</dt>
            <dd className="m-0 text-headline font-medium text-label">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-3">
        <h4 className="m-0 text-callout font-medium text-label-2">Stack</h4>
        <Chips items={project.stack} />
      </div>
    </div>
  );
}

export function ProjectLinks({ project }: { project: Project }) {
  if (!project.live && !project.repo) return null;
  return (
    <p className="m-0 flex flex-wrap gap-x-7 gap-y-3 text-[1.0625rem]">
      {project.live ? (
        <a className="link-chevron" href={project.live.href}>
          Visit {project.live.label}
          <ArrowUpRightIcon width={15} height={15} />
        </a>
      ) : null}
      {project.repo ? (
        <a className="link-chevron" href={project.repo} {...repoEvent(project.id)}>
          Source on GitHub
          <ArrowUpRightIcon width={15} height={15} />
        </a>
      ) : null}
    </p>
  );
}

/** One project, told Apple product-page style: headline, the shot, then the details. */
export default function CaseStudy({ project }: { project: Project }) {
  const headingId = `${project.id}-title`;
  const fig = project.figure;
  return (
    <article id={project.id} aria-labelledby={headingId} className="flex scroll-mt-20 flex-col gap-8 md:gap-12">
      <header className="reveal flex max-w-3xl flex-col gap-4">
        <p className="m-0 text-headline font-semibold text-accent">{project.kind}</p>
        <h3 id={headingId} className="m-0 text-balance text-title-1 text-label">
          {project.title}
        </h3>
        <p className="m-0 text-pretty text-headline text-label-2">{project.summary}</p>
        <ProjectLinks project={project} />
      </header>

      {fig?.src ? <ScreenshotViewer shot={{ id: project.id, src: fig.src, alt: fig.alt, caption: fig.caption }} /> : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="tile reveal p-7 md:p-10">
          <BuiltList items={project.built} />
        </div>
        <div className="tile reveal p-7 md:p-10">
          <Facts project={project} />
        </div>
      </div>
    </article>
  );
}
