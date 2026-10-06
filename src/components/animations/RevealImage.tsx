import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Premium image reveal: the frame is clipped open while the artwork inside
 * settles from a slight overscale. Used for every large visual on the site —
 * gsap applies the start state before first paint so nothing flashes.
 */
export function RevealImage({
  children,
  className,
  innerClassName,
  delay = 0,
  parallax = 0,
  reveal = true,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  /** Vertical parallax travel in pixels across the viewport. */
  parallax?: number;
  /** Disable the clip-open reveal (used when a shared element flies in). */
  reveal?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner || reduce) return;

    const ctx = gsap.context(() => {
      if (reveal) {
        gsap.from(inner, {
          clipPath: "inset(14% 10% 14% 10%)",
          scale: 1.08,
          opacity: 0.4,
          duration: 1.35,
          ease: EASE,
          delay,
          scrollTrigger: { trigger: frame, start: "top 88%", once: true },
        });
      }
      if (parallax) {
        gsap.fromTo(
          inner,
          { y: parallax * 0.5 },
          {
            y: -parallax * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, frame);
    return () => ctx.revert();
  }, [delay, parallax, reduce, reveal]);

  return (
    <div ref={frameRef} className={cn("relative overflow-hidden", className)}>
      <div ref={innerRef} className={cn("h-full w-full", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
