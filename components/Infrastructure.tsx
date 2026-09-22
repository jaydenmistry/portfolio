import CaseStudy from '@/components/CaseStudy';
import FullTopology from '@/components/figures/FullTopology';
import { projects, topologyNodes } from '@/lib/data';

export default function Infrastructure() {
  const project = projects.find((p) => p.id === 'infrastructure');
  if (!project) return null;
  return (
    <section aria-label="Infrastructure" className="flex flex-col gap-12">
      <CaseStudy
        project={project}
        total={projects.length}
        label={{ number: '03', name: 'Infrastructure' }}
        figure={<ComponentList />}
      />
      <FullTopology />
    </section>
  );
}

/** Every component in the diagram, in words. */
function ComponentList() {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="m-0 font-mono text-meta font-medium text-graphite">Components</h4>
      <dl className="m-0 border-b border-rule">
        {topologyNodes.map((node) => (
          <div
            key={node.id}
            className="grid gap-1 border-t border-rule py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6"
          >
            <dt className="font-mono text-meta font-medium text-graphite">{node.label}</dt>
            <dd className="m-0 text-body text-graphite-2">{node.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
