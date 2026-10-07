import { useEffect, useRef } from "react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Reveal } from "@/components/animations/text";
import { useFloat } from "@/hooks/use-float";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useRise } from "@/hooks/use-rise";
import { gsap } from "@/lib/gsap";
import { useDemo } from "@/store/demo";

const words = ["One meal", "can make", "a difference."];

/**
 * The closing statement: minimal, centred, and carried entirely by type. The
 * rescue box drifts along the baseline so the motif closes the story.
 */
export function FinalCTA() {
  const reduce = useReducedMotion();
  const { stats } = useDemo();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const diamondRef = useRef<HTMLSpanElement>(null);

  useRise(headingRef, { stagger: 0.1, yPercent: 112, start: "top 90%" });

  // The marker drifts on `y` while the baseline tween below drives `left`, so
  // the two never share a transform channel.
  useFloat(diamondRef, { distance: 4, duration: 3.2 });

  // The ember marker runs the baseline forever — unless motion is reduced.
  useEffect(() => {
    const diamond = diamondRef.current;
    if (!diamond || reduce) return;
    const tween = gsap.to(diamond, {
      left: "100%",
      duration: 9,
      repeat: -1,
      ease: "none",
    });
    return () => {
      tween.kill();
    };
  }, [reduce]);

  return (
    <section className="relative overflow-hidden bg-forest py-28 text-ivory md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 0%, rgba(226,112,58,0.18), transparent 70%)",
        }}
      />

      <div className="shell relative text-center">
        <span className="label-xs text-ivory/45">12 — Join in</span>

        <h2 ref={headingRef} className="display-xl mt-8 text-ivory">
          {words.map((line, index) => (
            <span key={line} className="block overflow-hidden py-[0.02em]">
              <span data-rise className="block">
                {index === 2 ? (
                  <>
                    a difference<span className="text-ember">.</span>
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h2>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-lg text-[1.02rem] leading-relaxed text-ivory/65">
            Join the network turning surplus into support — one tray, one
            pickup, one served plate at a time.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton to="/donate" variant="ember" size="lg">
              Donate food
            </MagneticButton>
            <MagneticButton
              to="/volunteer"
              variant="outline"
              size="lg"
              className="border-ivory/30 text-ivory hover:border-ivory/70"
            >
              Join the rescue network
            </MagneticButton>
          </div>
        </Reveal>

        <div className="relative mt-20 h-px w-full bg-ivory/12">
          {/* The rotation lives on the inner square, keeping the floated
              element free of any CSS transform of its own. */}
          <span
            ref={diamondRef}
            className="absolute -top-[5px] left-0 block size-3"
          >
            <span className="block size-3 rotate-45 bg-ember" />
          </span>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-[0.78rem] text-ivory/45">
            {stats.mealsRescued.toLocaleString("en-US")} meals rescued so far ·
            demo figures update as you use the prototype
          </p>
        </Reveal>
      </div>
    </section>
  );
}
