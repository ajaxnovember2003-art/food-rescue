import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DrawRule, Reveal, RevealLines } from "@/components/animations/text";

/**
 * The editorial section header used across the site: an indexed label, a
 * hairline rule and a masked headline. Keeps every section on the same grid.
 */
export function SectionHeading({
  index,
  label,
  title,
  lede,
  dark = false,
  align = "left",
  className,
  action,
}: {
  index: string;
  label: string;
  title: string[];
  lede?: string;
  dark?: boolean;
  align?: "left" | "between";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-4",
          align === "between" && "justify-between",
        )}
      >
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "label-xs",
              dark ? "text-ivory/50" : "text-forest/45",
            )}
          >
            {index}
          </span>
          <span
            className={cn(
              "label-xs",
              dark ? "text-ivory/80" : "text-forest/70",
            )}
          >
            {label}
          </span>
        </div>
        {action ? <div className="hidden md:block">{action}</div> : null}
      </div>
      <DrawRule dark={dark} className="mt-4" />
      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
        <RevealLines
          as="h2"
          lines={title}
          className={cn(
            "display-lg lg:col-span-7",
            dark ? "text-ivory" : "text-forest",
          )}
        />
        {lede ? (
          <Reveal className="lg:col-span-5 lg:pb-2" delay={0.15}>
            <p
              className={cn(
                "max-w-xl text-[1.02rem] leading-relaxed",
                dark ? "text-ivory/70" : "text-forest/70",
              )}
            >
              {lede}
            </p>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
