import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLocation, Outlet } from "react-router";
import { EASE } from "@/components/animations/text";

/**
 * Every route change gets the same three-beat move: a forest panel wipes up
 * over the old page, the panel lifts away, and the new page's content settles
 * in from below. Kept short so navigation never feels gated.
 */
export function PageTransition() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const mainRef = useRef<HTMLElement>(null);

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
      {reduce ? null : (
        <motion.div
          key={`veil-${location.key}`}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[150] bg-forest-deep"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{
            clipPath: [
              "inset(100% 0% 0% 0%)",
              "inset(0% 0% 0% 0%)",
              "inset(0% 0% 100% 0%)",
            ],
          }}
          transition={{ duration: 0.9, ease: EASE, times: [0, 0.42, 1] }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <motion.span
              className="text-[0.62rem] font-semibold tracking-[0.42em] text-ivory/60 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, times: [0, 0.4, 0.9] }}
            >
              FoodRescue
            </motion.span>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          ref={mainRef}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: reduce ? 0.2 : 0.55, ease: EASE }}
          onAnimationComplete={() => {
            // A lingering transform on this wrapper would make it the
            // containing block for GSAP's pinned sections, so once the enter
            // animation settles we hand positioning back to the viewport.
            mainRef.current?.style.removeProperty("transform");
          }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </>
  );
}
