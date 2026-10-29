import type { CSSProperties } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main className="container-content flex min-h-screen flex-col items-center justify-center gap-5 text-center">
      <p className="hero-in m-0 text-headline font-semibold text-accent">404</p>
      <h1 className="hero-in m-0 text-title-1 text-label" style={{ '--i': 1 } as CSSProperties}>
        Page not found
      </h1>
      <p className="hero-in m-0 text-headline text-label-2" style={{ '--i': 2 } as CSSProperties}>
        That page doesn&apos;t exist or has moved.
      </p>
      <div className="hero-in pt-3" style={{ '--i': 3 } as CSSProperties}>
        <Link href="/" className="button-filled min-h-12 px-7 text-[1.0625rem]">
          Back to home
        </Link>
      </div>
    </main>
  );
}
