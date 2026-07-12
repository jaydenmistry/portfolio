'use client';

import { useEffect, useRef } from 'react';

/**
 * Decorative hero backdrop: fine dot grid, slow-flowing network paths, and a
 * few drifting nodes. The whole layer parallaxes very slightly with the
 * pointer on desktop; static under prefers-reduced-motion.
 */
export default function HeroBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 14;
        const dy = (e.clientY / window.innerHeight - 0.5) * 10;
        layer.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Fine dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, #2a3348 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Soft radial glow behind the headline */}
      <div
        className="absolute -left-40 top-1/4 h-[32rem] w-[42rem] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: 'radial-gradient(ellipse, #54c1ff 0%, transparent 70%)' }}
      />
      {/* Parallax layer: network paths + drifting nodes */}
      <div ref={layerRef} className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <g stroke="#2a3348" strokeWidth="1">
            <path d="M-40 620 C 240 560, 380 700, 660 620 S 1080 520, 1260 600" />
            <path d="M-40 180 C 200 240, 420 120, 700 190 S 1060 280, 1260 200" />
            <path d="M900 -40 C 860 200, 1020 380, 960 640 S 900 760, 920 860" />
          </g>
          <g stroke="#54c1ff" strokeOpacity="0.35" strokeWidth="1">
            <path className="dash-flow-slow" d="M-40 620 C 240 560, 380 700, 660 620 S 1080 520, 1260 600" />
            <path className="dash-flow-slow" style={{ animationDelay: '-1.4s' }} d="M-40 180 C 200 240, 420 120, 700 190 S 1060 280, 1260 200" />
          </g>
          <g className="drift">
            <circle cx="660" cy="620" r="3" fill="#54c1ff" fillOpacity="0.6" />
            <circle cx="700" cy="190" r="3" fill="#a08cff" fillOpacity="0.5" />
          </g>
          <g className="drift" style={{ '--drift-delay': '-7s' } as React.CSSProperties}>
            <circle cx="960" cy="420" r="2.5" fill="#41cf8e" fillOpacity="0.5" />
            <circle cx="240" cy="560" r="2" fill="#54c1ff" fillOpacity="0.4" />
          </g>
        </svg>
      </div>
      {/* Bottom fade into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-base" />
    </div>
  );
}
