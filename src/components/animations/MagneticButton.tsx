import { ArrowRight } from "lucide-react";
import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "light" | "ember";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest text-ivory hover:bg-forest-deep border border-transparent",
  outline:
    "bg-transparent text-forest border border-forest/25 hover:border-forest/60",
  light: "bg-ivory text-forest border border-transparent hover:bg-white",
  ember: "bg-ember text-[#241007] border border-transparent hover:bg-ember/90",
};

interface MagneticButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  size?: "sm" | "md" | "lg";
  strength?: number;
  cursorLabel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Buttons are the product's handshake: a small magnetic pull toward the cursor,
 * a sliding arrow and a soft ink fill. Deliberately restrained — no bounces.
 * The pull runs through gsap quickTo, which gives it the springy settle that
 * used to come from a motion-value spring.
 */
export function MagneticButton({
  children,
  to,
  onClick,
  variant = "primary",
  className,
  arrow = true,
  size = "md",
  strength = 12,
  cursorLabel,
  type = "button",
  disabled,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const movers = useRef<{
    x: (value: number) => void;
    y: (value: number) => void;
  } | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      // The pull is decoration; reduced motion keeps the button still (and
      // clears any offset left over if the preference changes mid-session).
      gsap.set(node, { x: 0, y: 0 });
      return;
    }
    movers.current = {
      x: gsap.quickTo(node, "x", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(node, "y", { duration: 0.5, ease: "power3.out" }),
    };
    return () => {
      movers.current = null;
    };
  }, [reduce]);

  const handleMove = (event: ReactMouseEvent) => {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    movers.current?.x((offsetX / rect.width) * strength * 2);
    movers.current?.y((offsetY / rect.height) * strength * 1.4);
  };

  const reset = () => {
    movers.current?.x(0);
    movers.current?.y(0);
  };

  const sizeClass =
    size === "lg"
      ? "px-8 py-4 text-[0.95rem]"
      : size === "sm"
        ? "px-4 py-2.5 text-[0.7rem]"
        : "px-6 py-3.5 text-[0.8rem]";

  const content = (
    <span
      className={cn(
        "group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full font-semibold tracking-[0.14em] uppercase transition-colors duration-500",
        variant === "outline" && "group-hover/btn:text-ivory",
        sizeClass,
        variants[variant],
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      {arrow ? (
        <span className="relative z-10 grid size-4 place-items-center overflow-hidden">
          <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-5" />
          <ArrowRight className="absolute size-4 -translate-x-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0" />
        </span>
      ) : null}
      {variant === "outline" ? (
        <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-forest transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-y-100" />
      ) : null}
    </span>
  );

  const inner = (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="inline-flex"
      data-cursor={cursorLabel ? "label" : "hover"}
      data-cursor-label={cursorLabel}
    >
      {content}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        aria-label={ariaLabel}
        className="inline-flex rounded-full outline-offset-4"
        onClick={onClick}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex rounded-full outline-offset-4"
    >
      {inner}
    </button>
  );
}

/** Sublabel variant used on dark cinematic sections. */
export function TextLink({
  children,
  to,
  className,
  onClick,
}: {
  children: ReactNode;
  to?: string;
  className?: string;
  onClick?: () => void;
}) {
  const classes = cn(
    "group/btn inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] uppercase",
    className,
  );
  if (to) {
    return (
      <Link to={to} className={classes} data-cursor="hover">
        <span className="link-underline">{children}</span>
        <ArrowRight className="size-3.5 transition-transform duration-500 group-hover/btn:translate-x-1" />
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes} data-cursor="hover">
      <span className="link-underline">{children}</span>
      <ArrowRight className="size-3.5 transition-transform duration-500 group-hover/btn:translate-x-1" />
    </button>
  );
}
