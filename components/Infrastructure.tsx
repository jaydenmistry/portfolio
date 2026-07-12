'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import clsx from 'clsx';
import SectionHeader from '@/components/SectionHeader';
import Reveal from '@/components/Reveal';
import { topologyNodes, topologyEdges, solvingList, type TopologyNode } from '@/lib/data';
import { CloseIcon } from '@/components/icons';

/** Diagram coordinate space — matches the CSS aspect-[16/9] container. */
const VIEW_W = 160;
const VIEW_H = 90;

const kindStyles: Record<TopologyNode['kind'], { dot: string; ring: string; label: string }> = {
  healthy: { dot: 'bg-ok', ring: 'border-ok/50', label: 'Healthy' },
  routing: { dot: 'bg-accent', ring: 'border-accent/50', label: 'Routing / active traffic' },
  managed: { dot: 'bg-violet', ring: 'border-violet/50', label: 'Managed service' },
  support: { dot: 'bg-ink-mute', ring: 'border-line-bright', label: 'Supporting layer' },
};

const legend = [
  { color: 'bg-ok', label: 'Healthy' },
  { color: 'bg-accent', label: 'Routing / active traffic' },
  { color: 'bg-violet', label: 'Managed service' },
  { color: 'bg-ink-mute', label: 'Supporting layer' },
];

function nodeById(id: string) {
  const node = topologyNodes.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown topology node: ${id}`);
  return node;
}

/** Convert a node's percentage position into diagram coordinates. */
function toView(node: TopologyNode) {
  return { x: (node.x / 100) * VIEW_W, y: (node.y / 100) * VIEW_H };
}

function edgePath(fromId: string, toId: string) {
  const from = toView(nodeById(fromId));
  const to = toView(nodeById(toId));
  const midX = (from.x + to.x) / 2;
  return `M${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
}

export default function Infrastructure() {
  const [selected, setSelected] = useState<TopologyNode | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const edgesRef = useRef<SVGSVGElement>(null);

  // Subtle mouse-follow drift on the connection layer (desktop, motion allowed).
  useEffect(() => {
    const diagram = diagramRef.current;
    const edges = edgesRef.current;
    if (!diagram || !edges) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = diagram.getBoundingClientRect();
        const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 5;
        edges.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      edges.style.transform = '';
    };
    diagram.addEventListener('mousemove', onMove, { passive: true });
    diagram.addEventListener('mouseleave', onLeave);
    return () => {
      diagram.removeEventListener('mousemove', onMove);
      diagram.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Close the detail panel on escape.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <section id="infrastructure" className="border-y border-line bg-raised/40">
      <div className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
        <SectionHeader
          index="03"
          label="Infrastructure"
          title="Beyond the application layer."
          lede="Great software does not stop at a pull request. I’m interested in how systems are deployed, secured, observed, maintained, and improved over time."
        />

        {/* ---------- Desktop diagram ---------- */}
        <Reveal>
          <div
            ref={diagramRef}
            className="card relative hidden aspect-[16/9] overflow-hidden lg:block"
            role="group"
            aria-label="Interactive service architecture diagram. Use tab to move between nodes; press enter to open details."
          >
            {/* Topology grid background */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(#1e2534 1px, transparent 1px), linear-gradient(90deg, #1e2534 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              }}
            />

            {/* Connection layer */}
            <svg
              ref={edgesRef}
              aria-hidden
              className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
              fill="none"
            >
              {topologyEdges.map((edge) => (
                <g key={`${edge.from}-${edge.to}`}>
                  <path d={edgePath(edge.from, edge.to)} stroke="#2a3348" strokeWidth="0.35" />
                  {edge.active ? (
                    <path
                      d={edgePath(edge.from, edge.to)}
                      stroke="#54c1ff"
                      strokeOpacity="0.45"
                      strokeWidth="0.35"
                      strokeDasharray="1 2.4"
                      className="dash-flow-slow"
                    />
                  ) : null}
                </g>
              ))}
              {/* Packets along active routes */}
              {topologyEdges
                .filter((edge) => edge.active)
                .map((edge, i) => (
                  <circle
                    key={`packet-${edge.from}-${edge.to}`}
                    r="0.8"
                    fill="#54c1ff"
                    className="packet"
                    style={
                      {
                        offsetPath: `path("${edgePath(edge.from, edge.to)}")`,
                        '--packet-duration': '4s',
                        '--packet-delay': `${i * 1.1}s`,
                      } as CSSProperties
                    }
                  />
                ))}
            </svg>

            {/* Nodes */}
            {topologyNodes.map((node) => {
              const style = kindStyles[node.kind];
              const isSelected = selected?.id === node.id;
              return (
                <div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(isSelected ? null : node)}
                    aria-expanded={isSelected}
                    aria-label={`${node.label}: ${node.description}`}
                    className={clsx(
                      'group relative flex items-center gap-2 whitespace-nowrap rounded-lg border bg-panel px-3.5 py-2.5 font-mono text-xs text-ink shadow-lg shadow-black/30 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-overlay',
                      isSelected ? style.ring : 'border-line hover:border-line-bright',
                    )}
                  >
                    <span className={clsx('h-1.5 w-1.5 rounded-full', style.dot, node.kind !== 'support' && 'pulse-dot')} aria-hidden />
                    {node.label}
                    {/* Hover / focus tooltip; alignment flips near the diagram edges */}
                    <span
                      aria-hidden
                      className={clsx(
                        'pointer-events-none absolute bottom-full z-10 mb-2 w-56 whitespace-normal rounded-lg border border-line bg-overlay p-3 text-left text-[11px] leading-relaxed text-ink-dim opacity-0 shadow-xl shadow-black/40 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100',
                        node.x < 15 ? 'left-0' : node.x > 85 ? 'right-0' : 'left-1/2 -translate-x-1/2',
                      )}
                    >
                      {node.description}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ---------- Mobile / tablet stacked architecture ---------- */}
        <Reveal className="lg:hidden">
          <ol className="card divide-y divide-line" aria-label="Service architecture, listed from external traffic inward">
            {topologyNodes.map((node) => {
              const style = kindStyles[node.kind];
              const isSelected = selected?.id === node.id;
              return (
                <li key={node.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(isSelected ? null : node)}
                    aria-expanded={isSelected}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left font-mono text-sm text-ink transition-colors hover:bg-panel"
                  >
                    <span className={clsx('h-2 w-2 shrink-0 rounded-full', style.dot)} aria-hidden />
                    <span className="flex-1">{node.label}</span>
                    <span className="text-xs text-ink-mute">{isSelected ? '−' : '+'}</span>
                  </button>
                  {isSelected ? (
                    <p className="px-5 pb-4 pl-10 text-sm leading-relaxed text-ink-dim">{node.description}</p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </Reveal>

        {/* ---------- Detail panel (desktop selection) ---------- */}
        <div aria-live="polite" className="hidden lg:block">
          {selected ? (
            <div className="card mt-5 flex items-start justify-between gap-6 border-line-bright p-6">
              <div>
                <p className="flex items-center gap-2.5 font-mono text-sm text-ink">
                  <span className={clsx('h-2 w-2 rounded-full', kindStyles[selected.kind].dot)} aria-hidden />
                  {selected.label}
                  <span className="text-xs text-ink-mute">· {kindStyles[selected.kind].label}</span>
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-dim">{selected.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="btn-ghost shrink-0 !p-2"
                aria-label="Close node details"
              >
                <CloseIcon width={18} height={18} />
              </button>
            </div>
          ) : null}
        </div>

        {/* ---------- Legend ---------- */}
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-ink-mute" aria-label="Diagram legend">
          {legend.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span className={clsx('h-1.5 w-1.5 rounded-full', item.color)} aria-hidden />
              {item.label}
            </li>
          ))}
        </ul>

        {/* ---------- What I enjoy solving ---------- */}
        <div className="mt-16 grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
              What I enjoy solving
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">
              The problems between “it works on my machine” and “people rely on it.”
            </p>
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2">
            {solvingList.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 80}>
                <div className="flex h-full items-start gap-3 rounded-lg border border-line bg-panel p-4 text-sm leading-relaxed text-ink-dim transition-colors duration-200 hover:border-line-bright hover:text-ink">
                  <span className="mt-0.5 font-mono text-accent" aria-hidden>
                    ❯
                  </span>
                  {item}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
