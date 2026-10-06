import { useRef } from "react";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Slides a single pill behind whichever button is active, replacing framer's
 * shared `layoutId`. The pill is one element: gsap moves it to the active
 * button's box, re-measuring on resize so wrapping and font shifts stay
 * accurate. Returns the refs the group and pill elements must carry.
 */
export function useSlidingPill(activeKey: string) {
  const groupRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const firstRef = useRef(true);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const group = groupRef.current;
    const pill = pillRef.current;
    if (!group || !pill) return;

    const place = (animate: boolean) => {
      const button = group.querySelector<HTMLElement>(
        `[data-pill="${activeKey}"]`,
      );
      if (!button) return;
      const groupBox = group.getBoundingClientRect();
      const box = button.getBoundingClientRect();
      const vars = {
        x: box.left - groupBox.left,
        y: box.top - groupBox.top,
        width: box.width,
        height: box.height,
        opacity: 1,
      };
      if (animate && !reduce) {
        gsap.to(pill, { ...vars, duration: 0.5, ease: EASE });
      } else {
        gsap.set(pill, vars);
      }
    };

    const animate = !firstRef.current;
    firstRef.current = false;
    place(animate);

    // Web fonts land after the first measure and change the button widths, so
    // the pill takes one instant correction once they are ready.
    if (document.fonts) {
      document.fonts.ready
        .then(() => {
          if (group.isConnected) place(false);
        })
        .catch(() => undefined);
    }

    // Resizing re-measures instantly — the pill should already be in place.
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeKey, reduce]);

  return { groupRef, pillRef };
}
