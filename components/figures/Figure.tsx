import clsx from 'clsx';
import type { ReactNode } from 'react';

/** A drafted figure: grid sheet, corner registration marks, numbered caption. */
export default function Figure({
  number,
  caption,
  children,
  className,
  sheetClassName,
}: {
  number: string;
  caption: string;
  children: ReactNode;
  className?: string;
  sheetClassName?: string;
}) {
  return (
    <figure className={clsx('m-0 flex flex-col gap-3', className)}>
      <div className={clsx('blueprint-grid relative border border-rule', sheetClassName)}>
        <span aria-hidden className="corner left-2 top-2 border-l border-t" />
        <span aria-hidden className="corner right-2 top-2 border-r border-t" />
        <span aria-hidden className="corner bottom-2 left-2 border-b border-l" />
        <span aria-hidden className="corner bottom-2 right-2 border-b border-r" />
        {children}
      </div>
      <figcaption className="font-mono text-meta text-graphite-2">
        fig. {number}. {caption}
      </figcaption>
    </figure>
  );
}
