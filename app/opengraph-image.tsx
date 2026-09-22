import { ImageResponse } from 'next/og';

export const alt = 'Jayden Mistry, software engineer';
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
          background: '#F3F0E8',
          backgroundImage:
            'linear-gradient(#E7E2D7 1px, transparent 1px), linear-gradient(90deg, #E7E2D7 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          color: '#16181D',
        }}
      >
        <div style={{ display: 'flex', fontFamily: 'monospace', fontSize: 24, color: '#4A4F5A' }}>
          Software engineer · Computer Science, University of Georgia
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>Jayden Mistry</div>
          <div style={{ fontSize: 44, lineHeight: 1.2, maxWidth: 980 }}>
            I build full-stack products, and I run the infrastructure they ship on.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'monospace', fontSize: 24 }}>
          <div style={{ width: 14, height: 14, background: '#E2531A' }} />
          Open to software engineering internships
        </div>
      </div>
    ),
    size,
  );
}
