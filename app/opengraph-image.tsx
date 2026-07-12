import { ImageResponse } from 'next/og';

export const alt = 'Jayden Mistry — Software Engineer & Infrastructure Builder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#0b0e14',
          backgroundImage: 'radial-gradient(circle at 25% 30%, rgba(84,193,255,0.14) 0%, transparent 55%)',
          color: '#e7eaf1',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ color: '#54c1ff', fontSize: 34, fontWeight: 700 }}>JM_</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid #1e2534',
              borderRadius: 999,
              padding: '8px 20px',
              color: '#9aa5b6',
              fontSize: 20,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 999, background: '#41cf8e' }} />
            Open to Software Engineering Internships
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: '#54c1ff', fontSize: 22, letterSpacing: 6 }}>
            SOFTWARE ENGINEER / INFRASTRUCTURE
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>
            I build products, platforms, and the systems that keep them running.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5f6b7e', fontSize: 22 }}>
          <div>Jayden Mistry</div>
          <div>TypeScript · Go · Docker · Linux</div>
        </div>
      </div>
    ),
    size,
  );
}
