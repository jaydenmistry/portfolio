import type { CSSProperties } from 'react';
import TopologyCanvas, { type CanvasEdge, type CanvasNode } from '@/components/figures/TopologyCanvas';
import DrawOnView from '@/components/figures/DrawOnView';
import { topologyEdges, topologyNodes } from '@/lib/data';

const byId = new Map(topologyNodes.map((n) => [n.id, n]));

/** Delay grows left to right so the drawing follows the request path. */
const delayFor = (x: number) => Math.round((x / 100) * 0.9 * 100) / 100;

const nodes: CanvasNode[] = topologyNodes.map((n) => ({
  id: n.id,
  label: n.label,
  sub: n.sub,
  description: n.description,
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
  return { d, from: e.from, to: e.to, active: e.active, delay: delayFor(a.x) };
});

/** Layers for the narrow-screen version, top to bottom. */
const layers: { name: string; ids: string[] }[] = [
  { name: 'Internet', ids: ['users'] },
  { name: 'Edge', ids: ['traefik'] },
  { name: 'Services', ids: ['auth', 'docker', 'internal', 'monitoring'] },
  { name: 'Runtime', ids: ['lxc', 'db'] },
  { name: 'Host', ids: ['proxmox'] },
];

const summary =
  'Diagram: users reach Traefik, which routes to Authentik single sign-on, Docker apps and internal tools. Monitoring watches the apps and tools. Apps run in LXC services with databases, all on a Proxmox host in an Atlanta datacenter.';

export default function FullTopology() {
  return (
    <figure className="reveal-zoom m-0 flex flex-col gap-4">
      {/* Wide screens: the routed diagram. */}
      <div className="hidden rounded-tile bg-surface px-10 pb-12 pt-14 xl:block">
        <TopologyCanvas
          nodes={nodes}
          edges={edges}
          aspect={1000 / 420}
          boundary={{ x: 16, left: 'Internet', right: 'Private network' }}
          label={summary}
        />
      </div>

      {/* Narrow screens: the same system as stacked layers. */}
      <div className="rounded-tile bg-surface xl:hidden">
        <DrawOnView as="ol" label="Service layers, from the internet down to the host" className="relative m-0 list-none space-y-6 px-5 py-8 sm:px-8">
          <span aria-hidden className="draw-spine absolute bottom-12 left-[2.35rem] top-12 w-0.5 rounded-full bg-accent/40 sm:left-[3.1rem]" />
          <span
            aria-hidden
            className="traffic-packet absolute left-[2.1rem] h-2.5 w-2.5 rounded-full bg-accent sm:left-[2.85rem]"
            style={{ '--packet-from': '2.75rem', '--packet-to': '3.375rem' } as CSSProperties}
          />
          {layers.map((layer) => (
            <li key={layer.name} className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-4">
              <span aria-hidden className="relative z-10 mt-1.5 h-3 w-3 justify-self-center rounded-full border-2 border-accent bg-surface" />
              <div>
                <p className="m-0 text-callout font-medium text-label-2">{layer.name}</p>
                <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
                  {layer.ids.map((id) => {
                    const n = byId.get(id);
                    if (!n) return null;
                    return (
                      <li key={id} className={`rounded-card px-4 py-2.5 ${id === 'proxmox' ? 'bg-fill' : 'bg-elevated'}`}>
                        <span className="block text-callout font-semibold text-label">{n.label}</span>
                        <span className="block text-caption text-label-2">{n.sub}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}
        </DrawOnView>
      </div>
      <figcaption className="text-center text-callout text-label-2">
        Kappa Theta Pi service topology. Blue lines carry request traffic.
        <span className="hidden xl:inline"> Point at a service to see what it does.</span>
      </figcaption>
    </figure>
  );
}
