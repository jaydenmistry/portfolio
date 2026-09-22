import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/lib/data';

export const alt = `${site.name}, software engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Vendored IBM Plex (OFL, see assets/fonts/OFL.txt) so the image matches the
// site and builds without network access. The route is prerendered at build.
const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));

export default async function OpengraphImage() {
  const [sans400, sans600, mono400] = await Promise.all([
    font('ibm-plex-sans-latin-400-normal.woff'),
    font('ibm-plex-sans-latin-600-normal.woff'),
    font('ibm-plex-mono-latin-400-normal.woff'),
  ]);

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
          fontFamily: 'Plex Sans',
        }}
      >
        <div style={{ display: 'flex', fontFamily: 'Plex Mono', fontSize: 22, color: '#4A4F5A' }}>
          Software engineer · {site.education}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: 124, fontWeight: 600, letterSpacing: -5, lineHeight: 1 }}>{site.name}</div>
          <div style={{ fontSize: 44, lineHeight: 1.22, maxWidth: 1000, letterSpacing: -0.5 }}>{site.headline}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'Plex Mono', fontSize: 24 }}>
          <div style={{ width: 14, height: 14, background: '#E2531A' }} />
          {site.availability}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Plex Sans', data: sans400, weight: 400, style: 'normal' },
        { name: 'Plex Sans', data: sans600, weight: 600, style: 'normal' },
        { name: 'Plex Mono', data: mono400, weight: 400, style: 'normal' },
      ],
    },
  );
}
