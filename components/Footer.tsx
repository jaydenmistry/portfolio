import { site } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="space-y-1 text-sm text-ink-mute">
          <p>Designed and engineered by {site.name}.</p>
          <p>
            Built with Next.js, TypeScript, and Tailwind CSS. © 2026 {site.name}.
          </p>
        </div>
        <p className="flex items-center gap-2 font-mono text-xs text-ink-dim">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
          System status: operational
        </p>
      </div>
    </footer>
  );
}
