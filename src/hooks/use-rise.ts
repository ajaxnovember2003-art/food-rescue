import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import type { RefObject } from "react";

export interface RiseOptions {
  /** Play immediately on mount instead of when scrolled into view. */
  immediate?: boolean;
  /** Base delay before the first line. */
  delay?: number;
  /** Per-line stagger in seconds. */
  stagger?: number;
  duration?: number;
  /** How far the masked line travels, in percent of its own height. */
  yPercent?: number;
  /** Optional blur the text sharpens out of. */
  blur?: number;
  /** ScrollTrigger start position, e.g. "top 88%". */
  start?: string;
  once?: boolean;
}

/**
 * The masked line-rise used by every large heading: child spans marked with
 * `data-rise` sit inside an `overflow-hidden` mask and slide up into place.
 * The `from()` start state is applied in a layout effect, so there is no
 * flash of un-animated text.
 */
export function useRise(ref: RefObject<HTMLElement | null>, options: RiseOptions = {}) {
  const {
    immediate = false,
    delay = 0,
    stagger = 0.1,
    duration = 1.1,
    yPercent = 112,
    blur = 0,
    start = "top 88%",
    once = true,
  } = options;
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const element = ref.current;
    if (!element || reduce) return;
    const targets = element.querySelectorAll<HTMLElement>("[data-rise]");
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        yPercent,
        opacity: 0,
        ...(blur ? { filter: `blur(${blur}px)` } : {}),
        duration,
        ease: EASE,
        delay,
        stagger,
        scrollTrigger: immediate
          ? undefined
          : { trigger: element, start, once },
      });
    }, element);
    return () => ctx.revert();
  }, [ref, immediate, delay, stagger, duration, yPercent, blur, start, once, reduce]);
}
