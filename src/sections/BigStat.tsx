import { useRef } from "react";
import { AnimatedWords, EASE, Reveal } from "@/components/animations/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

/**
 * A single enormous number, then one quiet line to let it land. Deliberately
 * sparse so the typography carries the section — the live counters live in the
 * impact chapter, not here.
 */
export function BigStat() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.from(labelRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: EASE,
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });
      }
      const number = numberRef.current;
      if (!number) return;
      gsap.from(number, {
        opacity: 0,
        scale: 0.94,
        duration: 1.4,
        ease: EASE,
        scrollTrigger: { trigger: section, start: "top 72%", once: true },
      });
      if (!reduce) {
        gsap.fromTo(
          number,
          { yPercent: 12 },
          {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, section);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-forest/12 bg-sand py-24 md:py-32"
    >
      <div className="shell">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span ref={labelRef} className="label-xs text-forest/45">
              03 — The scale
            </span>
            <div className="mt-6 flex items-start gap-6">
              <span
                ref={numberRef}
                className="display-num inline-block text-forest"
              >
                40<span className="text-ember">%</span>
              </span>
            </div>
            <h2 className="mt-10 max-w-xl text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.05] font-extrabold tracking-[-0.04em] text-forest uppercase">
              <AnimatedWords
                text="Of produced food can be lost or wasted"
                as="span"
                className="block"
              />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-md text-[0.9rem] leading-relaxed text-forest/60">
                Roughly a third to forty percent of food produced worldwide is
                lost or wasted. The number on this page is a demo placeholder —
                in a real deployment FoodRescue reads its figures from verified
                supply partners.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="lg:max-w-sm">
            <div className="rounded-sm border border-forest/15 bg-[#fffdf8]/70 p-6">
              <p className="label-xs text-forest/45">Where it goes</p>
              <ul className="mt-5 space-y-3 text-[0.85rem] text-forest/70">
                {[
                  "Perfectly edible surplus rejected for shape or size",
                  "Kitchens over-preparing against uncertain demand",
                  "Events ending with untouched trays",
                  "Households buying more than they can cook",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
