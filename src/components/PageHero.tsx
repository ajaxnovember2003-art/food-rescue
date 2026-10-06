import { useRef, type ReactNode } from "react";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { useRise } from "@/hooks/use-rise";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
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
  const reduce = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);

  // The masked headline lines rise in on arrival; they sit above the fold, so
  // this plays immediately rather than waiting on a scroll trigger.
  useRise(headerRef, {
    immediate: true,
    delay: 0.12,
    stagger: 0.09,
    yPercent: 112,
    blur: 10,
  });

  useIsoLayoutEffect(() => {
    const el = ledeRef.current;
    if (!el || reduce) return;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1, ease: EASE, delay: 0.45 },
    );
    return () => {
      tween.kill();
    };
  }, [reduce]);

  return (
    <header
      ref={headerRef}
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
            {title.map((line) => (
              <span key={line} className="block overflow-hidden py-[0.02em]">
                <span data-rise className="block will-change-transform">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {lede ? (
            <p
              ref={ledeRef}
              className={cn(
                "max-w-xl text-[1rem] leading-relaxed lg:col-span-5 lg:pb-2",
                dark ? "text-ivory/65" : "text-forest/65",
              )}
            >
              {lede}
            </p>
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
