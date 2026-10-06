import { useRef, type ElementType, type ReactNode, type Ref } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useRise } from "@/hooks/use-rise";
import {
  EASE as GSAP_EASE,
  EASE_IN_OUT as GSAP_EASE_IN_OUT,
  gsap,
  useIsoLayoutEffect,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Public easing constants (gsap ease strings), stable import path. */
export const EASE: "expo.out" = GSAP_EASE;
export const EASE_IN_OUT: "power3.inOut" = GSAP_EASE_IN_OUT;

/** Props a polymorphic tag must accept for the masked primitives. */
type TagProps = {
  className?: string;
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
};

/**
 * Masked line-by-line reveal. Each line slides up from behind a clipping mask,
 * which reads as editorial typography rather than a generic fade-in — now
 * driven by a gsap from-tween + ScrollTrigger.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  as: Tag = "h2",
  delay = 0,
  once = true,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  as?: ElementType;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useRise(ref, {
    delay: delay * 0.05,
    stagger: 0.05,
    duration: 1.05,
    yPercent: 118,
    start: "top 88%",
    once,
  });
  const Polymorphic = Tag as ElementType<TagProps>;
  return (
    <Polymorphic className={className} ref={ref}>
      {lines.map((line, index) => (
        <span key={line + index} className="block overflow-hidden py-[0.06em]">
          <span
            data-rise
            className={cn("block will-change-transform", lineClassName)}
          >
            {line}
          </span>
        </span>
      ))}
    </Polymorphic>
  );
}

/**
 * Word-staggered reveal for smaller headings. Words rise with a slight blur so
 * the text sharpens into place instead of simply appearing.
 */
export function AnimatedWords({
  text,
  className,
  as: Tag = "p",
  delay = 0,
  stagger = 0.045,
  once = true,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useRise(ref, {
    delay,
    stagger,
    duration: 0.9,
    yPercent: 110,
    blur: 8,
    start: "top 90%",
    once,
  });
  const Polymorphic = Tag as ElementType<TagProps>;
  const words = text.split(" ");
  return (
    <Polymorphic className={className} ref={ref}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <span data-rise className="inline-block will-change-transform">
            {word}
          </span>
          {index < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </Polymorphic>
  );
}

/** Generic scroll reveal for blocks of content. */
export function Reveal({
  children,
  className,
  y = 28,
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const element = ref.current;
    if (!element || reduce) return;
    const ctx = gsap.context(() => {
      gsap.from(element, {
        opacity: 0,
        y,
        duration: 0.95,
        ease: EASE,
        delay,
        scrollTrigger: { trigger: element, start: "top 92%", once },
      });
    }, element);
    return () => ctx.revert();
  }, [y, delay, once, reduce]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Hairline rule that draws itself in as it enters the viewport. */
export function DrawRule({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const element = ref.current;
    if (!element || reduce) return;
    const ctx = gsap.context(() => {
      gsap.from(element, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: EASE,
        scrollTrigger: { trigger: element, start: "top 95%", once: true },
      });
    }, element);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div
      ref={ref}
      className={cn("h-px w-full origin-left", className)}
      style={{
        backgroundColor: dark
          ? "rgba(246,241,230,0.22)"
          : "rgba(11,43,34,0.18)",
      }}
    />
  );
}
