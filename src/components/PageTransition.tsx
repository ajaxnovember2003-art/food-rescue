import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE, ScrollTrigger, gsap, useIsoLayoutEffect } from "@/lib/gsap";

/**
 * The wipe veil: a forest panel that is already covering the viewport before
 * the first paint of a new route (set in a layout effect, so the old page never
 * flashes), holds for a beat while the wordmark fades, then lifts away and
 * hands the page over — refreshing ScrollTrigger once the layout has settled.
 */
function RouteVeil() {
  const veilRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const veil = veilRef.current;
    if (!veil) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        labelRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: EASE },
        0.08,
      )
        .to(
          veil,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: EASE },
          0.45,
        )
        .to(labelRef.current, { opacity: 0, duration: 0.3, ease: EASE }, 0.62)
        .call(() => ScrollTrigger.refresh());
    }, veil);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={veilRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[150] bg-forest-deep"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <span
          ref={labelRef}
          className="text-[0.62rem] font-semibold tracking-[0.42em] text-ivory/60 uppercase"
        >
          FoodRescue
        </span>
      </div>
    </div>
  );
}

/**
 * The routed page itself. Keyed by pathname so each route mounts fresh; the
 * enter tween clears its transform on completion so the wrapper can never
 * become the containing block for GSAP's pinned sections.
 */
function TransitionMain() {
  const mainRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    if (reduce) {
      gsap.fromTo(
        main,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.2,
          onComplete: () => main.style.removeProperty("opacity"),
        },
      );
      ScrollTrigger.refresh();
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(main, {
        opacity: 0,
        y: 18,
        duration: 0.55,
        ease: EASE,
        clearProps: "transform,opacity",
      });
    }, main);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <main ref={mainRef}>
      <Outlet />
    </main>
  );
}

/**
 * Every route change gets the same move: the forest veil is already covering
 * the swap, then lifts away while the new page settles in underneath. Kept
 * short so navigation never feels gated.
 */
export function PageTransition() {
  const location = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (v: number, o?: object) => void };
      }
    ).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <>
      {reduce ? null : <RouteVeil key={`veil-${location.key}`} />}
      <TransitionMain key={location.pathname} />
    </>
  );
}
