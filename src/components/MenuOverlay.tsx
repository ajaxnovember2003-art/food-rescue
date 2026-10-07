import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { Logo } from "@/components/Logo";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { primaryNav, workspaceNav } from "@/data/nav";
import { useDemo } from "@/store/demo";
import { formatNumber } from "@/lib/format";

/**
 * The cinematic mobile menu. GSAP plays the open choreography (clip wipe +
 * staggered link rise) and its own close choreography. The panel stays mounted
 * and hidden with `autoAlpha`, so the exit timeline can run to completion — the
 * manual replacement for AnimatePresence exits.
 */
export function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { stats } = useDemo();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // One choreography, played in whichever direction `open` asks for and
  // restartable mid-flight (a reopen never leaves the panel half-lifted).
  useIsoLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const items = gsap.utils.toArray<HTMLElement>("[data-menu-item]", panel);

    timelineRef.current?.kill();

    if (reduce) {
      gsap.set(panel, { autoAlpha: open ? 1 : 0 });
      gsap.set(panel, {
        clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      });
      return;
    }

    const timeline = gsap.timeline();
    timelineRef.current = timeline;

    if (open) {
      timeline
        .set(panel, { autoAlpha: 1 })
        .fromTo(
          panel,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE },
        )
        .fromTo(
          items,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: EASE,
            stagger: 0.06,
          },
          0.24,
        );
    } else {
      timeline
        .to(
          items,
          {
            yPercent: -40,
            opacity: 0,
            duration: 0.4,
            ease: EASE,
            stagger: { each: 0.03, from: "end" },
          },
          0,
        )
        .to(
          panel,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: EASE },
          0.15,
        )
        .set(panel, { autoAlpha: 0 });
    }

    return () => {
      timeline.kill();
    };
  }, [open, reduce]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      aria-hidden={!open}
      className="fixed inset-0 z-[120] overflow-y-auto bg-forest-deep text-ivory"
      style={{
        clipPath: "inset(0% 0% 100% 0%)",
        visibility: "hidden",
        opacity: 0,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(70% 60% at 20% 0%, rgba(226,112,58,0.18), transparent 65%)",
        }}
      />
      <div className="relative flex min-h-full flex-col px-5 pt-5 pb-10 md:px-10">
        <div className="flex items-center justify-between">
          <Logo tone="light" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-10 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors hover:bg-ivory/10"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="mt-14 flex flex-1 flex-col justify-center gap-1"
        >
          {primaryNav.map((nav, index) => (
            <div key={nav.label} className="overflow-hidden py-1">
              <Link
                data-menu-item
                to={nav.to}
                onClick={onClose}
                className="group flex items-baseline gap-4 py-1"
              >
                <span className="w-8 text-[0.6rem] font-semibold tracking-[0.2em] text-ivory/35">
                  0{index + 1}
                </span>
                <span className="display-md text-ivory transition-colors duration-500 group-hover:text-ember">
                  {nav.label}
                </span>
                <ArrowUpRight className="size-5 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </div>
          ))}
        </nav>

        <div className="mt-12 grid gap-8 border-t border-ivory/12 pt-8 md:grid-cols-2">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {workspaceNav.map((nav) => (
              <Link
                key={nav.label}
                to={nav.to}
                onClick={onClose}
                className="text-[0.72rem] font-semibold tracking-[0.16em] text-ivory/60 uppercase transition-colors hover:text-ember"
              >
                {nav.label}
              </Link>
            ))}
          </div>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="display-md text-ivory">
                {formatNumber(stats.mealsRescued)}
              </p>
              <p className="label-xs mt-2 text-ivory/50">
                Meals rescued this month
              </p>
            </div>
            <MagneticButton
              to="/donate"
              variant="ember"
              size="sm"
              onClick={onClose}
            >
              Donate food
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}
