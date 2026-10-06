import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  const inView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(shownRef.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        shownRef.current = latest;
        setDisplay(latest);
      },
    });
    return () => controls.stop();
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
