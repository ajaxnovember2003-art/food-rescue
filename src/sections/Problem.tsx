import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { FoodArtwork } from "@/components/FoodArtwork";
import { EASE, Reveal } from "@/components/animations/text";
import { problemFacts } from "@/data/mock";
import type { FoodCategory } from "@/types";

const pile: Array<{
  category: FoodCategory;
  hue: number;
  label: string;
  from: { x: number; y: number; rotate: number };
}> = [
  {
    category: "meals",
    hue: 152,
    label: "Buffet surplus",
    from: { x: -2.5, y: -52, rotate: -9 },
  },
  {
    category: "bakery",
    hue: 34,
    label: "Unsold bakery",
    from: { x: 2, y: -68, rotate: 6 },
  },
  {
    category: "fruits",
    hue: 62,
    label: "Cosmetic fruit",
    from: { x: -1.5, y: -38, rotate: -5 },
  },
];

function SurplusCard({
  item,
  index,
  progress,
  gridOpacity,
  reduce,
}: {
  item: (typeof pile)[number];
  index: number;
  progress: MotionValue<number>;
  gridOpacity: MotionValue<number>;
  reduce: boolean | null;
}) {
  const y = useTransform(progress, [0, 0.7], [`${item.from.y}%`, "0%"]);
  const x = useTransform(progress, [0, 0.7], [`${item.from.x}%`, "0%"]);
  const rotate = useTransform(progress, [0, 0.7], [item.from.rotate, 0]);
  const opacity = useTransform(progress, [0, 0.25, 1], [0.4, 1, 1]);

  return (
    <motion.div
      style={reduce ? undefined : { y, x, rotate, opacity }}
      className="group relative overflow-hidden rounded-sm border border-forest/15 bg-[#fffdf8]"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <FoodArtwork category={item.category} hue={item.hue} seed={index + 3} />
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-forest/50 uppercase">
          {item.label}
        </span>
        <motion.span
          className="text-[0.68rem] font-semibold tracking-[0.16em] text-forest uppercase"
          style={{ opacity: gridOpacity }}
        >
          Listed
        </motion.span>
      </div>
    </motion.div>
  );
}

/**
 * Waste becomes opportunity in one scroll: three surplus cards drift down as
 * loose debris and then lock into a structured rescue grid with metadata
 * attached. Motion values, not state, so the scrub stays at 60fps.
 */
export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });

  const gridOpacity = useTransform(scrollYProgress, [0.45, 0.75], [0, 1]);

  return (
    <section className="relative bg-ivory py-24 md:py-32">
      <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <span className="label-xs text-forest/45">02 — The problem</span>
          </Reveal>
          <h2 className="display-lg mt-6 text-forest">
            <span className="block overflow-hidden py-[0.02em]">
              <motion.span
                className="block"
                initial={{ y: "112%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 1.1, ease: EASE }}
              >
                Every day,
              </motion.span>
            </span>
            <span className="block overflow-hidden py-[0.02em]">
              <motion.span
                className="block"
                initial={{ y: "112%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
              >
                good food
              </motion.span>
            </span>
            <span className="block overflow-hidden py-[0.02em]">
              <motion.span
                className="block text-ember"
                initial={{ y: "112%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.16 }}
              >
                becomes waste.
              </motion.span>
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
            <motion.span
              className="label-xs text-ember"
              style={{ opacity: gridOpacity }}
            >
              Rescue opportunities
            </motion.span>
          </div>

          <div className="relative mt-6 h-[420px] sm:h-[520px]">
            {/* dusty pile that settles into a grid */}
            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
              {pile.map((item, index) => (
                <SurplusCard
                  key={item.category}
                  item={item}
                  index={index}
                  progress={scrollYProgress}
                  gridOpacity={gridOpacity}
                  reduce={reduce}
                />
              ))}
              <motion.div
                style={{ opacity: gridOpacity }}
                className="relative flex flex-col justify-between overflow-hidden rounded-sm border border-forest bg-forest p-5 text-ivory"
              >
                <span className="label-xs text-ivory/50">Matched in</span>
                <span className="text-[clamp(2.2rem,5vw,3.4rem)] leading-none font-extrabold tracking-[-0.05em]">
                  24 min
                </span>
                <p className="text-[0.8rem] leading-relaxed text-ivory/60">
                  Average time from listing to a volunteer accepting the pickup
                  in our pilot cities.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
