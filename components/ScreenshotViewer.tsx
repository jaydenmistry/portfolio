'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, animate, m, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import { CloseIcon, ExpandIcon } from '@/components/icons';
import { project, spring, springBounce } from '@/lib/motion';

type Shot = { id: string; src: string; alt: string; caption: string };

const noSubscribe = () => () => {};

/**
 * A screenshot that opens full size by growing out of itself, and closes
 * back into place. While open it can be flicked away up or down: it follows
 * the finger, shrinks and lets the page show through as it goes, and
 * closes if the flick projects it far enough.
 */
export default function ScreenshotViewer({ shot }: { shot: Shot }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  const layoutId = `shot-${shot.id}`;

  function close() {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  return (
    <figure className="m-0 flex flex-col gap-4">
      <div className="reveal-zoom rounded-tile bg-surface p-2.5 md:p-4">
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`View full size: ${shot.alt}`}
          className="press group relative block w-full cursor-zoom-in overflow-hidden rounded-[1.125rem]"
        >
          {/* The capture is pre-sized, so it is served directly; fixed dimensions prevent layout shift. */}
          <m.img
            layoutId={layoutId}
            src={shot.src}
            alt={shot.alt}
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
            style={{ borderRadius: 18 }}
            className="block aspect-[16/10] h-auto w-full object-cover object-top"
          />
          <span
            aria-hidden
            className="material absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-label opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <ExpandIcon />
          </span>
        </button>
      </div>
      <figcaption className="text-center text-callout text-label-2">
        {shot.caption}{' '}
        <a className="link" href={shot.src}>
          Open image
        </a>
      </figcaption>

      {mounted
        ? createPortal(
            <AnimatePresence>{open ? <Viewer key="viewer" shot={shot} layoutId={layoutId} onClose={close} /> : null}</AnimatePresence>,
            document.body,
          )
        : null}
    </figure>
  );
}

function Viewer({ shot, layoutId, onClose }: { shot: Shot; layoutId: string; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const y = useMotionValue(0);
  const scale = useTransform(y, [-500, 0, 500], [0.8, 1, 0.8]);
  const scrimOpacity = useTransform(y, [-360, 0, 360], [0.15, 1, 0.15]);

  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // The close button is the only control, so Tab stays on it.
      if (e.key === 'Tab') {
        e.preventDefault();
        closeButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  function onPan(_: PointerEvent, info: PanInfo) {
    y.set(info.offset.y);
  }

  function onPanEnd(_: PointerEvent, info: PanInfo) {
    const velocity = info.velocity.y;
    const resting = y.get() + project(velocity);
    if (Math.abs(resting) > 200) onClose();
    else animate(y, 0, { ...(Math.abs(velocity) > 300 ? springBounce : spring), velocity });
  }

  return (
    <m.div role="dialog" aria-modal="true" aria-label={shot.alt} className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-5 p-4 md:p-12">
      <m.div
        aria-hidden
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={onClose}
      >
        <m.div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" style={{ opacity: scrimOpacity }} />
      </m.div>

      <m.div style={{ y, scale }} onPan={onPan} onPanEnd={onPanEnd} className="relative flex w-full max-w-6xl cursor-grab touch-none justify-center active:cursor-grabbing">
        <m.img
          layoutId={layoutId}
          src={shot.src}
          alt=""
          width={1600}
          height={1000}
          draggable={false}
          // Radius as a style so Motion keeps it round while the image scales.
          style={{ borderRadius: 18 }}
          className="mx-auto block h-auto max-h-[78vh] w-auto max-w-full shadow-float"
        />
      </m.div>

      <m.p
        className="surface-dark material relative m-0 max-w-xl rounded-full px-5 py-2.5 text-center text-callout"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={spring}
      >
        {shot.caption}
      </m.p>

      <m.button
        ref={closeButton}
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="surface-dark material press absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full md:right-6 md:top-6"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={spring}
      >
        <CloseIcon width={18} height={18} strokeWidth={2.25} />
      </m.button>
    </m.div>
  );
}
