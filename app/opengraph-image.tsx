import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/lib/data';

export const alt = `${site.name}, software engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Vendored IBM Plex Sans (OFL, see assets/fonts/OFL.txt): SF Pro's licence does
// not allow bundling it, and the image must build without network access. The
// route is prerendered at build.
const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));

export default async function OpengraphImage() {
  const [sans400, sans600] = await Promise.all([
    font('ibm-plex-sans-latin-400-normal.woff'),
    font('ibm-plex-sans-latin-600-normal.woff'),
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
          background: '#FFFFFF',
          color: '#1D1D1F',
          fontFamily: 'Plex Sans',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#6E6E73' }}>Software engineer · {site.education}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 132, fontWeight: 600, letterSpacing: -5, lineHeight: 1 }}>{site.name}</div>
          <div style={{ fontSize: 46, fontWeight: 600, lineHeight: 1.15, maxWidth: 980, letterSpacing: -1, color: '#1D1D1F' }}>
            {site.headline}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, color: '#6E6E73' }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#34C759' }} />
            {site.availability}
          </div>
          <div
            style={{
              display: 'flex',
              padding: '14px 30px',
              borderRadius: 999,
              background: '#0071E3',
              color: '#FFFFFF',
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            jmistry.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Plex Sans', data: sans400, weight: 400, style: 'normal' },
        { name: 'Plex Sans', data: sans600, weight: 600, style: 'normal' },
      ],
    },
  );
}
