import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * The site's easing vocabulary: a strong editorial deceleration
 * (≈ cubic-bezier(0.16, 1, 0.3, 1)) and its in-out counterpart. Every tween
 * that used to carry framer's `EASE` array now uses these gsap ease strings.
 */
export const EASE = "expo.out";
export const EASE_IN_OUT = "power3.inOut";

/**
 * Layout effect on the client, plain effect during SSR. Used for every GSAP
 * setup so `from()` start states are applied before the first paint and the
 * page never flashes content it is about to animate.
 */
export const useIsoLayoutEffect: typeof useEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Shared rect for the food card → detail shared-element transition: the card
 * stores its image box (plus the listing it belongs to) right before
 * navigating, and the detail page grows its hero image out of that box. The id
 * guards against a stale box being replayed on an unrelated listing.
 */
export const sharedImageRect: {
  current: { rect: DOMRect; id: string } | null;
} = { current: null };

/**
 * Minimal manual FLIP (first → last → invert → play): records every child's
 * rectangle, runs `mutate` (a React state update), then animates the children
 * that survived the re-render back from their previous positions. Used where
 * framer's `layout` prop used to handle grid reflow.
 */
export function flipChildren(
  container: HTMLElement,
  mutate: () => void,
  options: { duration?: number } = {},
) {
  const { duration = 0.55 } = options;
  const before = new Map<Element, DOMRect>();
  for (const child of Array.from(container.children)) {
    before.set(child, child.getBoundingClientRect());
  }

  mutate();

  // Discrete React updates commit before the next frame, so one rAF is enough
  // to measure the new layout.
  requestAnimationFrame(() => {
    if (!container.isConnected) return;
    for (const child of Array.from(container.children)) {
      const element = child as HTMLElement;
      const first = before.get(element);
      const last = element.getBoundingClientRect();
      if (!first) {
        gsap.fromTo(
          element,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration, ease: "expo.out", overwrite: "auto" },
        );
        continue;
      }
      // A card whose scroll entrance never fired still sits at opacity 0, so
      // every survivor is explicitly settled to its resting state.
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        gsap.set(element, { opacity: 1 });
        continue;
      }
      gsap.fromTo(
        element,
        { x: dx, y: dy },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration,
          ease: "expo.out",
          clearProps: "transform",
          overwrite: "auto",
        },
      );
    }
  });
}
