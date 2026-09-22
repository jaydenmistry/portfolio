'use client';

import Link from 'next/link';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-sheet flex-col justify-center gap-6 px-5 md:px-12 xl:px-24">
      <h1 className="m-0 text-[2.75rem] font-semibold leading-[0.98] tracking-display text-graphite md:text-[4.5rem]">
        Something went wrong
      </h1>
      <p className="m-0 text-body text-graphite-2 md:text-body-lg">Try again, or head back to the homepage.</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn-dark">
          Try again
        </button>
        <Link href="/" className="btn-line">
          Back to home
        </Link>
      </div>
    </main>
  );
}
