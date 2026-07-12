import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function GitHubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden {...props}>
      <path d="M12 1.75C6.06 1.75 1.25 6.56 1.25 12.5c0 4.75 3.08 8.78 7.35 10.2.54.1.74-.23.74-.52 0-.26-.01-1.11-.02-2.01-2.99.65-3.62-1.27-3.62-1.27-.49-1.24-1.2-1.57-1.2-1.57-.97-.67.08-.65.08-.65 1.08.07 1.65 1.11 1.65 1.11.96 1.64 2.51 1.17 3.12.9.1-.7.37-1.17.68-1.44-2.39-.27-4.9-1.19-4.9-5.31 0-1.18.42-2.14 1.1-2.89-.11-.27-.48-1.36.11-2.84 0 0 .9-.29 2.95 1.1a10.3 10.3 0 0 1 5.38 0c2.05-1.39 2.95-1.1 2.95-1.1.59 1.48.22 2.57.11 2.84.69.75 1.1 1.71 1.1 2.89 0 4.13-2.52 5.04-4.92 5.3.39.34.73.99.73 2 0 1.44-.01 2.6-.01 2.96 0 .29.19.63.75.52a10.76 10.76 0 0 0 7.33-10.2c0-5.94-4.81-10.75-10.75-10.75Z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.53V9h3.57v11.45Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...props}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M4.5 19.5h15" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12.5 9 5 9-5" opacity={0.55} />
      <path d="m3 17 9 5 9-5" opacity={0.3} />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8 7.5 9.5 4.3-1.5 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m9 11.5 2.2 2.2L15.5 9.5" />
    </svg>
  );
}

export function TerminalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="m7 9.5 3 2.5-3 2.5M12.5 14.5H17" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
