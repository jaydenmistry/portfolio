import Link from 'next/link';
import { site } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="container-content">
      <div className="flex flex-col gap-4 border-t border-separator py-8 text-caption text-label-2 md:flex-row md:items-center md:justify-between">
        <p className="m-0">© 2026 {site.name}. Designed and built by me with Next.js.</p>
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
          <li>
            <a className="link text-label-2 hover:text-label" href={site.github}>
              GitHub
            </a>
          </li>
          <li>
            <a className="link text-label-2 hover:text-label" href={site.linkedin}>
              LinkedIn
            </a>
          </li>
          <li>
            <Link href="/privacy" className="link text-label-2 hover:text-label">
              Privacy
            </Link>
          </li>
          <li>
            <a href="#top" className="link text-label-2 hover:text-label">
              Back to top
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
