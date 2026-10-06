import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

/**
 * The seam between the dark hero and the editorial half of the page. The
 * forest environment warms into ivory while the rescue route completes itself:
 * an ember line draws downward as you scroll and the food parcel rides its end,
 * so the background change reads as the journey continuing rather than a colour
 * switch. Purely decorative — hidden from assistive tech.
 */
export function HeroBridge() {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const parcelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const section = ref.current;
    const fill = fillRef.current;
    const parcel = parcelRef.current;
    if (!section || !fill || !parcel) return;

    if (reduce) {
      gsap.set(fill, { scaleY: 1 });
      gsap.set(parcel, { top: "100%" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "bottom 60%",
            scrub: 0.4,
          },
        })
        .fromTo(
          fill,
          { scaleY: 0, transformOrigin: "50% 0%" },
          { scaleY: 1, ease: "none" },
          0,
        )
        .fromTo(parcel, { top: "0%" }, { top: "100%", ease: "none" }, 0);
    }, section);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative h-[22vh] max-h-[220px] min-h-[140px] overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #051713 0%, #0b2b22 26%, #2e3b2c 48%, #8a7f63 74%, #e9dfcc 93%, #f6f1e6 100%)",
      }}
    >
      {/* the hero's grid pattern, dissolving as the page warms */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        style={{
          maskImage: "linear-gradient(180deg, black 0%, transparent 72%)",
          WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 72%)",
        }}
      >
        <defs>
          <pattern
            id="bridge-grid"
            width="96"
            height="96"
            patternUnits="userSpaceOnUse"
          >
            <path d="M96 0H0v96" fill="none" stroke="#f6f1e6" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bridge-grid)" />
      </svg>

      {/* the route completing itself */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-ivory/15" />
      <div
        ref={fillRef}
        className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-ember"
      />
      <div ref={parcelRef} className="absolute left-1/2 -translate-x-1/2">
        <div className="-mt-2 h-4 w-5 rounded-[2px] border border-forest/25 bg-ivory">
          <div className="mt-1.5 h-px w-full bg-forest/30" />
          <div className="mx-auto mt-1 size-[3px] rounded-full bg-ember" />
        </div>
      </div>
    </div>
  );
}
