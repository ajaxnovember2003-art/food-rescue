import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/animations/text";

/**
 * Premium image reveal: the frame is clipped open while the artwork inside
 * settles from a slight overscale. Used for every large visual on the site.
 */
export function RevealImage({
  children,
  className,
  innerClassName,
  delay = 0,
  parallax = 0,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  /** Vertical parallax travel in pixels across the viewport. */
  parallax?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce || !parallax ? [0, 0] : [parallax * 0.5, -parallax * 0.5],
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className={cn("h-full w-full", innerClassName)}
        initial={
          reduce
            ? { opacity: 0 }
            : { clipPath: "inset(14% 10% 14% 10%)", scale: 1.08, opacity: 0.4 }
        }
        whileInView={
          reduce
            ? { opacity: 1 }
            : { clipPath: "inset(0% 0% 0% 0%)", scale: 1, opacity: 1 }
        }
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1.35, ease: EASE, delay }}
        style={{ y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
