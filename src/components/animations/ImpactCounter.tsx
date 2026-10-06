import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE, gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

/**
 * Numbers tick up with an ease-out curve when they scroll into view. State is
 * only written from the animation callback, and a ref keeps the origin so later
 * increases (a completed rescue) continue from the number already on screen
 * instead of restarting at zero.
 */
export function ImpactCounter({
  value,
  className,
  duration = 1.8,
  prefix = "",
  suffix = "",
  decimals = 0,
  once = true,
}: {
  value: number;
  className?: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shownRef = useRef(0);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px", once });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Reduced motion renders the final value directly (see `current` below),
    // so no state needs to be written here.
    if (reduce) {
      shownRef.current = value;
      return;
    }
    const proxy = { current: shownRef.current };
    const tween = gsap.to(proxy, {
      current: value,
      duration,
      ease: EASE,
      onUpdate: () => {
        shownRef.current = proxy.current;
        setDisplay(proxy.current);
      },
    });
    return () => {
      tween.kill();
    };
  }, [inView, value, duration, reduce]);

  const current = reduce ? value : display;
  const formatted =
    decimals > 0
      ? current.toFixed(decimals)
      : formatNumber(Number.isFinite(current) ? current : 0);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
