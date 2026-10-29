import type { Transition } from 'motion/react';

/**
 * Apple's spring parameters (DESIGN.md, Motion). Motion's `bounce` is
 * 1 − damping ratio, and `visualDuration` plays the part of response.
 */
export const spring: Transition = { type: 'spring', bounce: 0, visualDuration: 0.35 };

/** Only after a gesture that carried momentum, such as a flick. */
export const springBounce: Transition = { type: 'spring', bounce: 0.2, visualDuration: 0.4 };

/**
 * Where a flick would come to rest, using the same exponential deceleration
 * as scrolling (from Apple's Designing Fluid Interfaces sample code).
 * `velocity` is in px/s; the result is a distance in px.
 */
export function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive resistance past a boundary: the further the drag goes, the
 * less the surface follows. `dimension` is the size of the dragged surface.
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  const sign = Math.sign(overshoot);
  const distance = Math.abs(overshoot);
  return (sign * (distance * dimension * constant)) / (dimension + constant * distance);
}
