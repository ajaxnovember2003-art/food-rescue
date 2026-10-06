import { useRef } from "react";
import { EASE } from "@/components/animations/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { howItWorks } from "@/data/mock";

/**
 * The practical answer to "how does this actually work", kept deliberately
 * short. No icon grid — each step hangs off its own hairline with a marker on
 * the route, and the line draws ember on hover.
 */
export function HowItWorks() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || reduce) return;
    const steps = grid.querySelectorAll<HTMLElement>("[data-step]");
    const ctx = gsap.context(() => {
      gsap.from(steps, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: { trigger: grid, start: "top 85%", once: true },
      });
    }, grid);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      id="how-it-works"
      className="relative border-y border-forest/12 bg-sand py-20 md:py-24"
    >
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-xs text-forest/45">06 — How it works</span>
            <h2 className="display-md mt-5 max-w-xl text-forest">
              Four steps, and the food still gets eaten today.
            </h2>
          </div>
          <p className="max-w-sm text-[0.88rem] leading-relaxed text-forest/60">
            No storage, no overnight holding. If a listing cannot be collected
            inside its safe window, the network reroutes it or returns it to the
            donor's compost cycle.
          </p>
        </div>

        <div className="mt-14">
          <div ref={gridRef} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {howItWorks.map((step, index) => (
              <div
                key={step.title}
                data-step
                data-cursor="hover"
                className="group relative border-t border-forest/15 pt-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-700 ease-out group-hover:scale-x-100"
                />
                <span
                  aria-hidden="true"
                  className="absolute -top-1 left-0 size-1.5 -translate-x-1/2 rounded-full bg-forest/30 transition-colors duration-500 group-hover:bg-ember"
                />
                <span className="label-xs block text-ember">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-[1.1rem] font-extrabold tracking-[-0.02em] text-forest uppercase">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-[0.85rem] leading-relaxed text-forest/65">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
