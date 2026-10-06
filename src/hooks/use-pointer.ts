import { useEffect, useRef, useState, type RefObject } from "react";

export interface PointerParallax {
  /**
   * Subscribers receive normalised pointer offsets inside the container
   * (-0.5 → 0.5 on both axes). Each subscriber applies its own multiplier
   * through a springy gsap quickTo, which keeps the depth parallax smooth
   * without any animation library values. Disabled on touch devices.
   */
  subscribe(fn: (x: number, y: number) => void): () => void;
}

export function usePointerParallax(
  containerRef: RefObject<HTMLElement | null>,
): PointerParallax {
  const subscribers = useRef(new Set<(x: number, y: number) => void>());

  // The public handle is created once and never read from a ref during render;
  // the subscriber set it closes over lives in a ref.
  const [pointer] = useState<PointerParallax>(() => ({
    subscribe(fn) {
      subscribers.current.add(fn);
      return () => {
        subscribers.current.delete(fn);
      };
    },
  }));

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const notify = (x: number, y: number) => {
      for (const fn of subscribers.current) fn(x, y);
    };
    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      notify(
        (event.clientX - rect.left) / rect.width - 0.5,
        (event.clientY - rect.top) / rect.height - 0.5,
      );
    };
    const onLeave = () => notify(0, 0);

    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);
    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef]);

  return pointer;
}
