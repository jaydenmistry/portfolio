'use client';

import { useState, useSyncExternalStore, type CSSProperties } from 'react';
import { AnimatePresence, m } from 'motion/react';
import clsx from 'clsx';
import { useDrawOnView } from '@/components/figures/DrawOnView';
import { spring } from '@/lib/motion';

export type CanvasNode = {
  id: string;
  label: string;
  sub?: string;
  /** Shown in a popover when the node is pointed at or tapped. */
  description?: string;
  /** Center position, percent of the canvas. */
  x: number;
  y: number;
  /** Fixed width as a percent of the canvas, for base layers. */
  w?: number;
  base?: boolean;
  /** Seconds after the drawing starts. */
  delay: number;
};

export type CanvasEdge = {
  /** Path in percent coordinates, e.g. "M11 46 H36". */
  d: string;
  from: string;
  to: string;
  active?: boolean;
  delay: number;
};

type Props = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  /** Width / height of the drawing area. */
  aspect: number;
  /** Vertical dashed boundary at this x (percent), with labels either side. */
  boundary?: { x: number; left: string; right: string };
  label: string;
  className?: string;
};

const VIEW_W = 1000;
const PACKET_SECONDS = 2.6;

/** Scale a percent-coordinate path into the SVG's viewBox units. */
function scalePath(d: string, viewH: number) {
  return d.replace(/([MHVL])\s*([\d.]+)(?:\s+([\d.]+))?/g, (_, cmd: string, a: string, b?: string) => {
    const n = (v: string, axis: 'x' | 'y') => ((parseFloat(v) / 100) * (axis === 'x' ? VIEW_W : viewH)).toFixed(1);
    if (cmd === 'H') return `H${n(a, 'x')}`;
    if (cmd === 'V') return `V${n(a, 'y')}`;
    return `${cmd}${n(a, 'x')} ${n(b ?? '0', 'y')}`;
  });
}

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
/** True once the client knows motion is welcome; false on the server. */
function useMotionAllowed() {
  return useSyncExternalStore(subscribeMotion, () => !window.matchMedia(motionQuery).matches, () => false);
}

/**
 * Service diagram. Lines are SVG and draw themselves in when scrolled into
 * view, then packets travel the request path. Node labels are HTML so their
 * type stays at real sizes. Pointing at (or tapping) a node highlights its
 * connections and opens its description beside it.
 */
export default function TopologyCanvas({ nodes, edges, aspect, boundary, label, className }: Props) {
  const ref = useDrawOnView<HTMLDivElement>();
  const motionAllowed = useMotionAllowed();
  const [focus, setFocus] = useState<string | null>(null);
  const viewH = VIEW_W / aspect;

  const linked = (edge: CanvasEdge) => focus !== null && (edge.from === focus || edge.to === focus);
  const neighbours = new Set(edges.filter(linked).flatMap((e) => [e.from, e.to]));
  const focused = nodes.find((n) => n.id === focus);

  return (
    <div ref={ref} className={clsx('relative', className)} style={{ aspectRatio: String(aspect) }} onPointerLeave={() => setFocus(null)}>
      <div role="img" aria-label={label} className="absolute inset-0">
        <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${VIEW_W} ${viewH}`} fill="none">
          {boundary ? (
            <line
              x1={(boundary.x / 100) * VIEW_W}
              x2={(boundary.x / 100) * VIEW_W}
              y1={viewH * 0.1}
              y2={viewH}
              className="stroke-separator"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              strokeLinecap="round"
            />
          ) : null}
          {edges.map((edge) => (
            <path
              key={edge.d}
              d={scalePath(edge.d, viewH)}
              pathLength={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={clsx(
                'draw-line topology-edge',
                edge.active ? 'stroke-accent' : 'stroke-label-2/40',
                focus && (linked(edge) ? 'is-linked' : 'is-dimmed'),
              )}
              strokeWidth={edge.active ? 3 : 2}
              style={{ '--draw-delay': `${edge.delay}s` } as CSSProperties}
            />
          ))}
          {motionAllowed
            ? edges
                .filter((edge) => edge.active)
                .map((edge, i) => (
                  <circle key={`packet-${edge.d}`} r="5" className="topology-packet fill-accent" opacity="0">
                    <animateMotion
                      dur={`${PACKET_SECONDS}s`}
                      begin={`${1.2 + edge.delay + i * 0.15}s`}
                      repeatCount="indefinite"
                      path={scalePath(edge.d, viewH)}
                      calcMode="spline"
                      keyPoints="0;1"
                      keyTimes="0;1"
                      keySplines="0.45 0 0.55 1"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.15;0.8;1"
                      dur={`${PACKET_SECONDS}s`}
                      begin={`${1.2 + edge.delay + i * 0.15}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))
            : null}
        </svg>

        {boundary ? (
          <div aria-hidden className="absolute inset-x-0 top-0 text-caption text-label-2">
            <span className="absolute top-0 whitespace-nowrap pr-4" style={{ right: `${100 - boundary.x}%` }}>
              {boundary.left}
            </span>
            <span className="absolute top-0 whitespace-nowrap pl-4" style={{ left: `${boundary.x}%` }}>
              {boundary.right}
            </span>
          </div>
        ) : null}

        {nodes.map((node) => (
          <div
            key={node.id}
            aria-hidden
            onPointerEnter={(e) => e.pointerType === 'mouse' && setFocus(node.id)}
            onClick={() => setFocus((current) => (current === node.id ? null : node.id))}
            className={clsx(
              'draw-node topology-node absolute -translate-x-1/2 -translate-y-1/2 cursor-default select-none rounded-card px-4 py-2.5',
              node.base ? 'bg-fill' : 'bg-elevated',
              focus === node.id && 'is-focused',
              focus && focus !== node.id && !neighbours.has(node.id) && 'is-dimmed',
            )}
            style={
              {
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: node.w ? `${node.w}%` : undefined,
                '--draw-delay': `${node.delay}s`,
              } as CSSProperties
            }
          >
            <span className="block whitespace-nowrap text-callout font-semibold text-label">{node.label}</span>
            {node.sub ? <span className="block whitespace-nowrap text-caption text-label-2">{node.sub}</span> : null}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {focused?.description ? (
          <m.div
            key={focused.id}
            aria-hidden
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
            transition={spring}
            className="material-thick pointer-events-none absolute z-20 w-72 rounded-card p-4 text-left shadow-float"
            style={{
              left: `clamp(0%, calc(${focused.x}% - 9rem), calc(100% - 18rem))`,
              ...(focused.y > 55
                ? { bottom: `calc(${100 - focused.y}% + 2.75rem)`, transformOrigin: '50% 100%' }
                : { top: `calc(${focused.y}% + 2.75rem)`, transformOrigin: '50% 0%' }),
            }}
          >
            <p className="m-0 text-callout font-semibold text-label">{focused.label}</p>
            <p className="m-0 mt-1 text-callout text-label-2">{focused.description}</p>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
