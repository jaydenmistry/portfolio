import { BuiltList, Facts, ProjectLinks } from '@/components/CaseStudy';
import FullTopology from '@/components/figures/FullTopology';
import { projects, topologyNodes } from '@/lib/data';

/** The infrastructure story, on a dark band in either theme. */
export default function Infrastructure() {
  const project = projects.find((p) => p.id === 'infrastructure');
  if (!project) return null;
  return (
    <section
      id="infrastructure"
      aria-labelledby="infrastructure-title"
      className="surface-dark mx-2 scroll-mt-12 rounded-[2.5rem] bg-background py-20 ring-1 ring-separator/60 md:mx-4 md:py-32"
    >
      <div className="container-content flex flex-col gap-10 md:gap-14">
        <header className="reveal flex max-w-3xl flex-col gap-4">
          <p className="m-0 text-headline font-semibold text-accent">{project.kind}</p>
          <h2 id="infrastructure-title" className="m-0 text-balance text-title-1 text-label">
            {project.title}
          </h2>
          <p className="m-0 text-pretty text-headline text-label-2">{project.summary}</p>
          <ProjectLinks project={project} />
        </header>

        <FullTopology />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="tile reveal p-7 md:p-10">
            <BuiltList items={project.built} />
          </div>
          <div className="tile reveal p-7 md:p-10">
            <Facts project={project} />
          </div>
        </div>

        <ComponentList />
      </div>
    </section>
  );
}

/** Every component in the diagram, in words. */
function ComponentList() {
  return (
    <div className="tile reveal p-7 md:p-10">
      <h3 className="m-0 text-callout font-medium text-label-2">Components</h3>
      <dl className="m-0 mt-5 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {topologyNodes.map((node) => (
          <div key={node.id} className="flex flex-col gap-1 border-t border-separator py-4">
            <dt className="text-headline font-semibold text-label">{node.label}</dt>
            <dd className="m-0 text-callout text-label-2">{node.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
