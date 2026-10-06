import { Link } from "react-router";
import { cn } from "@/lib/utils";

/** FoodRescue mark: a bowl with food rising out of it into the network. */
export function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-6", className)}
    >
      <path
        d="M4.5 17.5h23a11.5 11.5 0 0 1-23 0Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M16 13.5V3.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.6 8.2 16 2.6l5.4 5.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
  compact = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  compact?: boolean;
}) {
  return (
    <Link
      to="/"
      aria-label="FoodRescue home"
      data-cursor="hover"
      className={cn(
        "group inline-flex items-center gap-2.5",
        tone === "light" ? "text-ivory" : "text-forest",
        className,
      )}
    >
      <span className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5">
        <LogoGlyph className="size-[22px]" />
      </span>
      <span className="text-[0.95rem] font-extrabold tracking-[0.2em] uppercase">
        {compact ? "FR" : "FoodRescue"}
      </span>
    </Link>
  );
}
