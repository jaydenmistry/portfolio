'use client';

import Link from 'next/link';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="container-content flex min-h-screen flex-col items-center justify-center gap-5 text-center">
      <h1 className="m-0 text-title-1 text-label">Something went wrong</h1>
      <p className="m-0 text-headline text-label-2">Try again, or head back to the homepage.</p>
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 pt-3">
        <button type="button" onClick={reset} className="button-filled min-h-12 px-7 text-[1.0625rem]">
          Try again
        </button>
        <Link href="/" className="link-chevron text-[1.0625rem]">
          Back to home
        </Link>
      </div>
    </main>
  );
}
