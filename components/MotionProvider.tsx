'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';
import { spring } from '@/lib/motion';

const loadFeatures = () => import('@/lib/motion-features').then((mod) => mod.default);

/**
 * Motion for the whole page: features load after hydration, every animation
 * defaults to the house spring, and reduced motion is honored automatically
 * (transform animations are skipped; opacity still crossfades).
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig transition={spring} reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
