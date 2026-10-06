import { useEffect, useState, type RefObject } from "react";

/**
 * Native intersection gate for the places that pause work while off-screen
 * (the network's frame loop, counters that count on entry). Same signature
 * style as the framer hook it replaces: `margin` maps to IntersectionObserver
 * rootMargin.
 */
export function useInView(
  ref: RefObject<Element | null>,
  options: { margin?: string; once?: boolean } = {},
): boolean {
  const { margin = "0px", once = false } = options;
  // Environments without IntersectionObserver start visible instead of hiding
  // content behind an animation that can never trigger.
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin: margin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, margin, once]);

  return inView;
}
