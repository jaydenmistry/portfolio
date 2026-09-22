import { projects } from '@/lib/data';

/** Scannable list of every project, directly under the hero. */
export default function WorkIndex() {
  return (
    <section id="work" aria-labelledby="work-index" className="flex flex-col">
      <div className="flex items-baseline justify-between gap-4 pb-3 xl:px-3">
        <h2 id="work-index" className="m-0 font-mono text-meta font-medium text-graphite">
          Index of work
        </h2>
        <p className="m-0 hidden font-mono text-meta text-graphite-2 md:block">Software, systems and infrastructure</p>
      </div>
      <ol className="m-0 list-none border-b border-rule p-0">
        {projects.map((p) => {
          const when = p.timeline ?? p.status;
          return (
            <li key={p.id} className="border-t border-rule">
              <a
                href={`#${p.id}`}
                className="row-link grid grid-cols-[2.25rem_minmax(0,1fr)_1.25rem] items-start gap-x-2 py-4 text-graphite no-underline xl:grid-cols-[3.5rem_minmax(0,1fr)_11rem_20rem_10.5rem_1.5rem] xl:items-center xl:px-3 xl:py-0 xl:min-h-16"
              >
                <span className="pt-0.5 font-mono text-meta text-signal-ink xl:pt-0">{p.number}</span>
                <span className="flex flex-col gap-1.5 xl:contents">
                  <span className="text-[1.0625rem] font-medium leading-snug tracking-[-0.01em] xl:text-[1.1875rem]">
                    {p.indexTitle}
                  </span>
                  <span className="font-mono text-meta text-graphite-2 xl:hidden">
                    {p.kind}
                    {when ? ` · ${when}` : ''}
                  </span>
                  <span className="hidden font-mono text-meta text-graphite-2 xl:block">{p.kind}</span>
                  <span className="hidden font-mono text-meta text-graphite-2 xl:block">{p.indexStack}</span>
                  <span className="hidden font-mono text-meta text-graphite-2 xl:block">{when ?? ''}</span>
                </span>
                <span aria-hidden className="arrow justify-self-end pt-0.5 xl:pt-0">
                  →
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
