import { site } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-sheet flex-col gap-3 px-5 py-10 font-mono text-meta text-graphite-2 md:flex-row md:items-center md:justify-between md:px-12 xl:px-24">
        <p className="m-0">
          © 2026 {site.name}. Built with Next.js and Tailwind CSS.
        </p>
        <a href="#top" className="ulink text-graphite">
          Back to top
        </a>
      </div>
    </footer>
  );
}
