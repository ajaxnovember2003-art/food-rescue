import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0.01, 0.27, 1] as const;

const lineVariants: Variants = {
  hidden: { y: "118%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 1.05, ease: EASE, delay: 0.05 * i },
  }),
};

/**
 * Masked line-by-line reveal. Each line slides up from behind a clipping mask,
 * which reads as editorial typography rather than a generic fade-in.
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
  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <span key={line + index} className="block overflow-hidden py-[0.06em]">
          <motion.span
            custom={index + delay}
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: "-12% 0px -10% 0px" }}
            className={cn("block will-change-transform", lineClassName)}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
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
  const words = text.split(" ");
  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
            whileInView={{
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
            }}
            viewport={{ once, margin: "-10% 0px" }}
            transition={{
              duration: 0.9,
              ease: EASE,
              delay: delay + index * stagger,
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
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
  return (
    <motion.div
      className={cn("h-px w-full origin-left", className)}
      style={{
        backgroundColor: dark
          ? "rgba(246,241,230,0.22)"
          : "rgba(11,43,34,0.18)",
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 1.2, ease: EASE }}
    />
  );
}
