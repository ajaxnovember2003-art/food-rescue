import { useRef } from "react";
import { FoodImage } from "@/components/FoodImage";
import { photoAt, type FoodPhoto } from "@/data/photos";
import { Reveal } from "@/components/animations/text";
import { useRise } from "@/hooks/use-rise";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { problemFacts } from "@/data/mock";
import type { FoodCategory } from "@/types";

const pile: Array<{
  category: FoodCategory;
  hue: number;
  label: string;
  photo: FoodPhoto;
  from: { x: number; y: number; rotate: number };
}> = [
  {
    category: "meals",
    hue: 152,
    label: "Buffet surplus",
    photo: photoAt("meals", 1),
    from: { x: -1.5, y: -14, rotate: -4 },
  },
  {
    category: "bakery",
    hue: 34,
    label: "Unsold bakery",
    photo: photoAt("bakery", 1),
    from: { x: 1.5, y: -19, rotate: 3 },
  },
  {
    category: "fruits",
    hue: 62,
    label: "Cosmetic fruit",
    photo: photoAt("fruits", 2),
    from: { x: -1, y: -13, rotate: -2 },
  },
];

function SurplusCard({
  item,
  index,
}: {
  item: (typeof pile)[number];
  index: number;
}) {
  return (
    <div
      data-surplus-card
      className="group relative overflow-hidden rounded-sm border border-forest/15 bg-[#fffdf8]"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <FoodImage
          photo={item.photo}
          category={item.category}
          hue={item.hue}
          seed={index + 3}
          sizes="(max-width: 1024px) 92vw, 30vw"
        />
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-forest/50 uppercase">
          {item.label}
        </span>
        <span
          data-problem-signal
          className="text-[0.68rem] font-semibold tracking-[0.16em] text-forest uppercase"
        >
          Listed
        </span>
      </div>
    </div>
  );
}

/**
 * Waste becomes opportunity in one scroll: three surplus photos drift down as
 * loose debris and then lock into a structured rescue grid with metadata
 * attached. One gsap scrub timeline drives the settle; motion values stay off
 * the React render path.
 */
export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  useRise(headingRef, { stagger: 0.08, yPercent: 112, start: "top 88%" });

  useIsoLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const signals = container.querySelectorAll("[data-problem-signal]");
      // Metadata labels + the matched-in card fade up as the grid locks in.
      gsap.fromTo(
        signals,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 55%",
            end: "bottom 70%",
            scrub: 0.4,
          },
        },
      );

      if (reduce) return;
      const cards = container.querySelectorAll<HTMLElement>("[data-surplus-card]");
      pile.forEach((item, index) => {
        const card = cards[index];
        if (!card) return;
        gsap.fromTo(
          card,
          {
            xPercent: item.from.x,
            yPercent: item.from.y,
            rotate: item.from.rotate,
            opacity: 0.4,
          },
          {
            xPercent: 0,
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          },
        );
      });
    }, container);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section className="relative bg-ivory py-24 md:py-32">
      <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <span className="label-xs text-forest/45">02 — The problem</span>
          </Reveal>
          <h2 ref={headingRef} className="display-lg mt-6 text-forest">
            <span className="block overflow-hidden py-[0.02em]">
              <span data-rise className="block">
                Every day,
              </span>
            </span>
            <span className="block overflow-hidden py-[0.02em]">
              <span data-rise className="block">
                good food
              </span>
            </span>
            <span className="block overflow-hidden py-[0.02em]">
              <span data-rise className="block text-ember">
                becomes waste.
              </span>
            </span>
          </h2>

          <Reveal delay={0.2} className="mt-9">
            <p className="max-w-md text-[1.02rem] leading-relaxed text-forest/70">
              Perfectly good meals are thrown away every night — not because
              anyone wants to waste them, but because there is no fast way to
              move them somewhere useful. The food is fine. The logistics are
              missing.
            </p>
          </Reveal>

          <div className="mt-12 space-y-6">
            {problemFacts.map((fact, index) => (
              <Reveal key={fact.value} delay={0.1 * index}>
                <div className="flex items-baseline gap-6 border-t border-forest/12 pt-5">
                  <span className="text-[clamp(1.7rem,3vw,2.4rem)] font-extrabold tracking-[-0.04em] text-forest">
                    {fact.value}
                  </span>
                  <span className="max-w-[16rem] text-[0.82rem] leading-relaxed text-forest/60">
                    {fact.label}
                    <span className="block text-forest/35">
                      Illustrative demo data
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div ref={ref} className="relative lg:col-span-7">
          <div className="flex items-end justify-between">
            <span className="label-xs text-forest/45">Surplus today</span>
            <span data-problem-signal className="label-xs text-ember">
              Rescue opportunities
            </span>
          </div>

          {/* loose photos that settle into a structured rescue grid — the
              container is content-sized so nothing can overflow on phones */}
          <div className="relative mt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pile.map((item, index) => (
                <SurplusCard key={item.category} item={item} index={index} />
              ))}
              <div
                data-problem-signal
                className="relative flex flex-col justify-between overflow-hidden rounded-sm border border-forest bg-forest p-5 text-ivory opacity-0"
              >
                <span className="label-xs text-ivory/50">Matched in</span>
                <span className="text-[clamp(2.2rem,5vw,3.4rem)] leading-none font-extrabold tracking-[-0.05em]">
                  24 min
                </span>
                <p className="text-[0.8rem] leading-relaxed text-ivory/60">
                  Average time from listing to a volunteer accepting the pickup
                  in our pilot cities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
