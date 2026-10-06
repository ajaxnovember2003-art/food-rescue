import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/components/animations/text";
import { cn } from "@/lib/utils";

/**
 * Interior pages open with the same editorial header: an indexed label, a
 * masked display headline, a short lede and an optional slot for live controls.
 */
export function PageHero({
  index,
  label,
  title,
  lede,
  dark = false,
  children,
  className,
}: {
  index: string;
  label: string;
  title: string[];
  lede?: string;
  dark?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20",
        dark ? "bg-forest-deep text-ivory" : "bg-ivory text-forest",
        className,
      )}
    >
      {dark ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 80% 5%, rgba(226,112,58,0.18), transparent 70%)",
          }}
        />
      ) : null}

      <div className="shell relative">
        <div className="flex items-center gap-4">
          <span className={cn("label-xs", dark ? "text-ivory/45" : "text-forest/45")}>
            {index}
          </span>
          <span className={cn("label-xs", dark ? "text-ivory/75" : "text-forest/70")}>
            {label}
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1
            className={cn(
              "display-lg lg:col-span-7",
              dark ? "text-ivory" : "text-forest",
            )}
          >
            {title.map((line, lineIndex) => (
              <span key={line} className="block overflow-hidden py-[0.02em]">
                <motion.span
                  className="block will-change-transform"
                  initial={{ y: "112%", opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 1.15,
                    ease: EASE,
                    delay: 0.12 + lineIndex * 0.09,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          {lede ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.45 }}
              className={cn(
                "max-w-xl text-[1rem] leading-relaxed lg:col-span-5 lg:pb-2",
                dark ? "text-ivory/65" : "text-forest/65",
              )}
            >
              {lede}
            </motion.p>
          ) : null}
        </div>

        {children ? <div className="mt-12">{children}</div> : null}
      </div>
    </header>
  );
}

/** Simple bordered panel used across the interior pages. */
export function Panel({
  label,
  children,
  className,
  dark = false,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-sm border p-6",
        dark
          ? "border-ivory/12 bg-forest/50 text-ivory"
          : "border-forest/12 bg-[#fffdf8] text-forest",
        className,
      )}
    >
      {label ? (
        <p className={cn("label-xs", dark ? "text-ivory/45" : "text-forest/45")}>
          {label}
        </p>
      ) : null}
      <div className={label ? "mt-4" : undefined}>{children}</div>
    </div>
  );
}

/** Big single-value statistic block. */
export function StatBlock({
  value,
  label,
  dark = false,
  className,
}: {
  value: ReactNode;
  label: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-7", dark ? "bg-forest-deep" : "bg-sand", className)}>
      <p
        className={cn(
          "text-[clamp(1.6rem,3.2vw,2.4rem)] leading-none font-extrabold tracking-[-0.045em]",
          dark ? "text-ivory" : "text-forest",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "label-xs mt-3",
          dark ? "text-ivory/45" : "text-forest/45",
        )}
      >
        {label}
      </p>
    </div>
  );
}
