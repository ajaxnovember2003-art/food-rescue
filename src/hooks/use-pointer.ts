import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useEffect, type RefObject } from "react";

export interface PointerParallax {
  /** Normalised pointer position, -0.5 → 0.5 on both axes. */
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * Tracks the pointer inside a container and returns two smoothed motion values.
 * Layers pick their own multiplier, which is how the cursor parallax gets depth
 * without the page ever moving aggressively. Disabled on touch devices.
 */
export function usePointerParallax(
  containerRef: RefObject<HTMLElement | null>,
  { stiffness = 90, damping = 20 } = {},
): PointerParallax {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness, damping, mass: 0.6 });
  const y = useSpring(rawY, { stiffness, damping, mass: 0.6 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      rawX.set((event.clientX - rect.left) / rect.width - 0.5);
      rawY.set((event.clientY - rect.top) / rect.height - 0.5);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);
    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef, rawX, rawY]);

  return { x, y };
}
