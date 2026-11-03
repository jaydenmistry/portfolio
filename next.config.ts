import type { NextConfig } from 'next';

// Umami runs beside the site on the homelab (see deploy/umami). Its tracker
// and event endpoint are proxied under /stats on this origin, so visitors
// never need to reach the analytics hostname, which stays private.
const umamiUpstream = process.env.UMAMI_UPSTREAM;

// A tracker loaded from another origin has to be allowed by the CSP.
const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
const umamiOrigin = umamiSrc?.startsWith('http') ? new URL(umamiSrc).origin : '';

const csp = [
  "default-src 'self'",
  // Next.js streams page data in inline scripts, and the theme script has to
  // run inline before first paint. Dev mode also needs eval for fast refresh.
  `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval' " : ''}https://assets.calendly.com ${umamiOrigin}`,
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' https://formspree.io ${umamiOrigin}`,
  'frame-src https://calendly.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .map((directive) => directive.trim())
  .join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // No includeSubDomains: other jmistry.com hosts are managed separately.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), usb=()' },
];

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async rewrites() {
    if (!umamiUpstream) return [];
    return [
      { source: '/stats/script.js', destination: `${umamiUpstream}/script.js` },
      { source: '/stats/api/send', destination: `${umamiUpstream}/api/send` },
    ];
  },
};

export default nextConfig;
