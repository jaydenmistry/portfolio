'use client';

import { type CSSProperties } from 'react';
import { useDrawOnView } from '@/components/figures/DrawOnView';
import clsx from 'clsx';

export type CanvasNode = {
  id: string;
  label: string;
  sub?: string;
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
  /** `load` draws on first paint; `visible` waits until scrolled into view. */
  trigger?: 'load' | 'visible';
  label: string;
  className?: string;
};

const VIEW_W = 1000;

/** Scale a percent-coordinate path into the SVG's viewBox units. */
function scalePath(d: string, viewH: number) {
  return d.replace(/([MHVL])\s*([\d.]+)(?:\s+([\d.]+))?/g, (_, cmd: string, a: string, b?: string) => {
    const n = (v: string, axis: 'x' | 'y') => ((parseFloat(v) / 100) * (axis === 'x' ? VIEW_W : viewH)).toFixed(1);
    if (cmd === 'H') return `H${n(a, 'x')}`;
    if (cmd === 'V') return `V${n(a, 'y')}`;
    return `${cmd}${n(a, 'x')} ${n(b ?? '0', 'y')}`;
  });
}

/**
 * Blueprint diagram. Lines are SVG and draw themselves; node labels are HTML
 * so their type stays at real pixel sizes at every width. Lines run
 * center-to-center underneath the opaque node boxes.
 */
export default function TopologyCanvas({
  nodes,
  edges,
  aspect,
  boundary,
  trigger = 'load',
  label,
  className,
}: Props) {
  const ref = useDrawOnView<HTMLDivElement>(trigger === 'visible');
  const viewH = VIEW_W / aspect;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={clsx('draw-scope relative', trigger === 'load' && 'draw-go', className)}
      style={{ aspectRatio: String(aspect) }}
    >
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${VIEW_W} ${viewH}`}
        fill="none"
      >
        {boundary ? (
          <line
            x1={(boundary.x / 100) * VIEW_W}
            x2={(boundary.x / 100) * VIEW_W}
            y1={viewH * 0.1}
            y2={viewH}
            className="stroke-rule-strong"
            strokeWidth="1.5"
            strokeDasharray="5 7"
          />
        ) : null}
        {edges.map((edge) => (
          <path
            key={edge.d}
            d={scalePath(edge.d, viewH)}
            pathLength={1}
            className={clsx('draw-line', edge.active ? 'stroke-signal' : 'stroke-graphite-2')}
            strokeWidth={edge.active ? 3 : 2}
            style={{ '--draw-delay': `${edge.delay}s` } as CSSProperties}
          />
        ))}
      </svg>

      {boundary ? (
        <div aria-hidden className="absolute inset-x-0 top-0 font-mono text-meta text-graphite-2">
          <span className="absolute top-0 whitespace-nowrap pr-3" style={{ right: `${100 - boundary.x}%` }}>
            {boundary.left}
          </span>
          <span className="absolute top-0 whitespace-nowrap pl-3" style={{ left: `${boundary.x}%` }}>
            {boundary.right}
          </span>
        </div>
      ) : null}

      {nodes.map((node) => (
        <div
          key={node.id}
          aria-hidden
          className={clsx(
            'draw-node absolute -translate-x-1/2 -translate-y-1/2 border-[1.5px] border-graphite px-3 py-2 font-mono text-meta leading-tight',
            node.base ? 'hatch' : 'bg-sheet',
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
          <span className="block whitespace-nowrap font-medium text-graphite">{node.label}</span>
          {node.sub ? <span className="mt-1 block whitespace-nowrap text-graphite-2">{node.sub}</span> : null}
        </div>
      ))}
    </div>
  );
}
