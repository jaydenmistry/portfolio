import TopologyCanvas, { type CanvasEdge, type CanvasNode } from '@/components/figures/TopologyCanvas';
import Figure from '@/components/figures/Figure';
import DrawOnView from '@/components/figures/DrawOnView';
import { topologyEdges, topologyNodes } from '@/lib/data';

const byId = new Map(topologyNodes.map((n) => [n.id, n]));

/** Delay grows left to right so the drawing follows the request path. */
const delayFor = (x: number) => Math.round((x / 100) * 0.9 * 100) / 100;

const nodes: CanvasNode[] = topologyNodes.map((n) => ({
  id: n.id,
  label: n.label,
  sub: n.sub,
  x: n.x,
  y: n.y,
  base: n.id === 'proxmox',
  delay: delayFor(n.x),
}));

const edges: CanvasEdge[] = topologyEdges.map((e) => {
  const a = byId.get(e.from);
  const b = byId.get(e.to);
  if (!a || !b) throw new Error(`Unknown topology edge ${e.from} -> ${e.to}`);
  const d =
    e.route ??
    (a.y === b.y
      ? `M${a.x} ${a.y} H${b.x}`
      : a.x === b.x
        ? `M${a.x} ${a.y} V${b.y}`
        : `M${a.x} ${a.y} H${e.via ?? (a.x + b.x) / 2} V${b.y} H${b.x}`);
  return { d, active: e.active, delay: delayFor(a.x) };
});

/** Layers for the narrow-screen version, top to bottom. */
const layers: { name: string; ids: string[] }[] = [
  { name: 'Internet', ids: ['users'] },
  { name: 'Edge', ids: ['traefik'] },
  { name: 'Services', ids: ['auth', 'docker', 'internal', 'monitoring'] },
  { name: 'Runtime', ids: ['lxc', 'db'] },
  { name: 'Host', ids: ['proxmox'] },
];

const caption = 'Kappa Theta Pi service topology. Orange lines carry request traffic.';
const stackCaption = 'Kappa Theta Pi service topology, from the internet down to the host.';
const summary =
  'Diagram: users reach Traefik, which routes to Authentik single sign-on, Docker apps and internal tools. Monitoring watches the apps and tools. Apps run in LXC services with databases, all on a Proxmox host in an Atlanta datacenter.';

export default function FullTopology() {
  return (
    <>
      {/* Wide screens: the routed diagram. */}
      <Figure number="03" caption={caption} className="hidden xl:flex">
        <div className="px-8 pb-10 pt-14">
          <TopologyCanvas
            nodes={nodes}
            edges={edges}
            aspect={1000 / 420}
            boundary={{ x: 16, left: 'internet', right: 'private network' }}
            trigger="visible"
            label={summary}
          />
        </div>
      </Figure>

      {/* Narrow screens: the same system as stacked layers. */}
      <Figure number="03" caption={stackCaption} className="xl:hidden">
        <DrawOnView as="ol" label="Service layers, from the internet down to the host" className="relative m-0 list-none space-y-5 px-5 py-8 sm:px-8">
          <span aria-hidden className="draw-spine absolute bottom-12 left-[2.35rem] top-12 w-[2px] bg-graphite-2 sm:left-[3.1rem]" />
          {layers.map((layer) => (
            <li key={layer.name} className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-4">
              <span aria-hidden className="relative z-10 mt-3 h-3 w-3 justify-self-center border-[1.5px] border-graphite bg-sheet" />
              <div>
                <p className="m-0 font-mono text-meta text-graphite-2">{layer.name}</p>
                <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
                  {layer.ids.map((id) => {
                    const n = byId.get(id);
                    if (!n) return null;
                    return (
                      <li
                        key={id}
                        className={`border-[1.5px] border-graphite px-3 py-2 font-mono text-meta leading-tight ${id === 'proxmox' ? 'hatch' : 'bg-sheet'}`}
                      >
                        <span className="block font-medium text-graphite">{n.label}</span>
                        <span className="mt-1 block text-graphite-2">{n.sub}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}
        </DrawOnView>
      </Figure>
    </>
  );
}
