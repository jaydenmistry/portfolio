import type { ReactNode } from 'react';
import { projects, type Project } from '@/lib/data';
import { ChevronRightIcon } from '@/components/icons';
import SpotlightTile from '@/components/SpotlightTile';
import TrafficSpine from '@/components/figures/TrafficSpine';

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-elevated px-3 py-1 text-caption text-label">
          {item}
        </li>
      ))}
    </ul>
  );
}

function TileText({ project, size = 'md', children }: { project: Project; size?: 'md' | 'lg'; children?: ReactNode }) {
  const when = project.timeline ?? project.status;
  return (
    <div className="relative z-10 flex flex-col gap-3">
      <p className="m-0 text-callout font-medium text-label-2">
        {project.kind}
        {when ? <span className="font-normal"> · {when}</span> : null}
      </p>
      <h3 className={`m-0 text-balance text-label ${size === 'lg' ? 'text-title-1' : 'text-title-3'}`}>{project.title}</h3>
      <p className={`m-0 max-w-[34rem] text-pretty text-label-2 ${size === 'lg' ? 'text-headline' : 'text-body'}`}>{project.summary}</p>
      {children}
      <span className="link-chevron mt-1 text-[1.0625rem]">
        Read the case study
        <ChevronRightIcon width={15} height={15} />
      </span>
    </div>
  );
}

/** Every project as a tile, sized by how much there is to show. */
export default function WorkOverview() {
  const byId = (id: string) => projects.find((p) => p.id === id);
  const spotr = byId('spotr');
  const infra = byId('infrastructure');
  const kv = byId('kv-store');
  const chat = byId('chat');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      {spotr ? (
        <SpotlightTile href={`#${spotr.id}`} className="reveal flex flex-col p-7 md:col-span-2 md:min-h-[38rem] md:p-10 lg:col-span-4 lg:row-span-2">
          <TileText project={spotr} size="lg" />
          {spotr.figure?.src ? (
            // Decorative here; the case study shows the same capture with full alt text.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={spotr.figure.src}
              alt=""
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
              className="product-shot pointer-events-none relative -mb-16 -mr-24 ml-auto mt-10 w-[118%] max-w-none rounded-xl shadow-float md:absolute md:-right-16 md:top-[44%] md:m-0 md:w-[82%]"
            />
          ) : null}
        </SpotlightTile>
      ) : null}

      {infra ? (
        <SpotlightTile href={`#${infra.id}`} className="surface-dark reveal flex min-h-[34rem] flex-col justify-between gap-8 bg-surface p-7 md:p-10 lg:col-span-2 lg:row-span-2">
          <TileText project={{ ...infra, title: 'Production infrastructure' }} />
          <TrafficSpine />
        </SpotlightTile>
      ) : null}

      {[kv, chat].map((project) =>
        project ? (
          <SpotlightTile
            key={project.id}
            href={`#${project.id}`}
            className={`reveal flex flex-col p-7 md:p-10 lg:col-span-3 ${project.id === 'chat' ? 'md:col-span-2 lg:col-span-3' : ''}`}
          >
            <TileText project={project}>
              <div className="pt-2">
                <Chips items={project.stack.slice(0, 4)} />
              </div>
            </TileText>
          </SpotlightTile>
        ) : null,
      )}
    </div>
  );
}

export { Chips };
