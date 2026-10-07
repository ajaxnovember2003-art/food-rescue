import type { RefObject } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

export interface FloatOptions {
  /** Peak travel in pixels, upward from the resting position. */
  distance?: number;
  /** Seconds for one full up-and-back cycle. */
  duration?: number;
  /** Seconds to wait before the first rise. */
  delay?: number;
}

/**
 * A slow, continuous hover: the element rises `distance` pixels off its resting
 * position and settles back on a sine curve, forever. Meant for ambient
 * decoration — background light, a travelling parcel, a small marker — rather
 * than for content that carries meaning.
 *
 * Three rules make it safe to drop onto existing markup:
 *  - it only ever writes `y`, so it composes with the rest of the motion system
 *    instead of fighting it. A sibling timeline can keep owning `top`, `left`,
 *    `scale` and `yPercent` on the same element, or `x`/`y` on an ancestor
 *    without either tween stomping the other;
 *  - it never runs under reduced motion, and it writes the resting offset back
 *    so a preference change mid-session cannot strand an element mid-hover;
 *  - the tween is torn down while the element is off screen, so an idle page
 *    costs nothing.
 */
export function useFloat(
  ref: RefObject<Element | null>,
  options: FloatOptions = {},
) {
  const { distance = 8, duration = 3.6, delay = 0 } = options;
  const reduce = useReducedMotion();
  const visible = useInView(ref, { margin: "10% 0px" });

  useIsoLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (reduce || !visible) {
      gsap.set(element, { y: 0 });
      return;
    }

    const tween = gsap.to(element, {
      y: -distance,
      // Half a cycle each way; `yoyo` plays it back down.
      duration: duration / 2,
      delay,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tween.kill();
      gsap.set(element, { y: 0 });
    };
  }, [ref, reduce, visible, distance, duration, delay]);
}
