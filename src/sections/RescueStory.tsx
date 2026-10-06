import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { EASE, Reveal } from "@/components/animations/text";
import { rescueJourney } from "@/data/mock";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const stations = ["Donor", "Match", "Volunteer", "Community", "Impact"];

/**
 * The centrepiece: a pinned, scroll-scrubbed sequence where a food box travels
 * from donor to impact while the four stages of a rescue light up. Pinning only
 * happens on large screens with motion allowed; everywhere else the stages
 * become a plain editorial list.
 */
export function RescueStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const track = trackRef.current;
        const box = boxRef.current;
        const fill = fillRef.current;
        const section = sectionRef.current;
        if (!track || !box || !fill || !section) return;

        const distance = () => Math.max(0, track.clientWidth - 52);

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=260%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = Math.min(
                rescueJourney.length - 1,
                Math.floor(self.progress * rescueJourney.length),
              );
              if (next !== stageRef.current) {
                stageRef.current = next;
                setStage(next);
              }
            },
          },
        });

        timeline.fromTo(
          box,
          { x: 0 },
          { x: distance, ease: "none", duration: 1 },
          0,
        );
        timeline.fromTo(
          fill,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", duration: 1 },
          0,
        );

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-forest py-24 text-ivory lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 45% at 78% 12%, rgba(226,112,58,0.16), transparent 70%)",
        }}
      />

      <div className="shell relative w-full">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="label-xs text-ivory/45">04 — The rescue story</span>
            <h2 className="display-lg mt-6 text-ivory">
              <span className="block overflow-hidden py-[0.02em]">
                <motion.span
                  className="block"
                  initial={{ y: "112%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1.1, ease: EASE }}
                >
                  From surplus
                </motion.span>
              </span>
              <span className="block overflow-hidden py-[0.02em]">
                <motion.span
                  className="block"
                  initial={{ y: "112%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
                >
                  to support<span className="text-ember">.</span>
                </motion.span>
              </span>
            </h2>
          </div>
          <Reveal delay={0.2} className="hidden lg:block">
            <div className="text-right">
              <p className="display-md text-ivory">
                0{stage + 1}
                <span className="text-ivory/30">/0{rescueJourney.length}</span>
              </p>
              <p className="label-xs mt-2 text-ivory/45">
                {rescueJourney[stage].title}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Desktop: scrubbed track */}
        <div className="mt-16 hidden lg:block">
          <div ref={trackRef} className="relative h-24">
            <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-ivory/12" />
            <div
              ref={fillRef}
              className="absolute top-1/2 left-0 h-px w-full origin-left -translate-y-1/2 bg-ember"
            />
            {stations.map((station, index) => (
              <div
                key={station}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(index / (stations.length - 1)) * 100}%` }}
              >
                <span
                  className={cn(
                    "block size-1.5 rounded-full transition-colors duration-500",
                    index <= stage ? "bg-ember" : "bg-ivory/30",
                  )}
                />
                <span className="label-xs mt-3 block -translate-x-1/2 text-center whitespace-nowrap text-ivory/45">
                  {station}
                </span>
              </div>
            ))}
            <div ref={boxRef} className="absolute top-1/2 left-0">
              <div className="flex size-[52px] -translate-y-1/2 items-center justify-center rounded-sm border border-ivory/25 bg-forest-deep/80 backdrop-blur-sm">
                <div className="relative size-7">
                  <span className="absolute inset-x-0 bottom-0 h-3.5 rounded-b-[3px] bg-ivory/90" />
                  <span className="absolute inset-x-1.5 bottom-1 h-px bg-forest/30" />
                  <span className="absolute top-0.5 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-ember" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-4 gap-6 border-t border-ivory/12 pt-8">
            {rescueJourney.map((item, index) => {
              const active = index === stage;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStage(index)}
                  data-cursor="hover"
                  className="text-left"
                >
                  <span
                    className={cn(
                      "block h-px w-full origin-left transition-transform duration-700",
                      active ? "scale-x-100 bg-ember" : "scale-x-100 bg-ivory/15",
                    )}
                  />
                  <span
                    className={cn(
                      "mt-5 block text-[0.62rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-500",
                      active ? "text-ember" : "text-ivory/35",
                    )}
                  >
                    {item.index}
                  </span>
                  <span
                    className={cn(
                      "mt-2 block text-[1.35rem] font-extrabold tracking-[-0.03em] uppercase transition-colors duration-500",
                      active ? "text-ivory" : "text-ivory/40",
                    )}
                  >
                    {item.title}
                  </span>
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: active ? 1 : 0.35,
                      height: active ? "auto" : 0,
                    }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="block overflow-hidden"
                  >
                    <span className="mt-3 block text-[0.82rem] leading-relaxed text-ivory/65">
                      {item.body}
                    </span>
                  </motion.span>
                  <span className="mt-3 block text-[0.72rem] text-ivory/40">
                    {item.kicker}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile / tablet: stacked story */}
        <div className="mt-12 space-y-10 lg:hidden">
          {rescueJourney.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <div className="border-t border-ivory/12 pt-5">
                <div className="flex items-baseline gap-4">
                  <span className="label-xs text-ember">{item.index}</span>
                  <h3 className="text-[1.6rem] font-extrabold tracking-[-0.03em] uppercase">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-ivory/65">
                  {item.body}
                </p>
                <p className="label-xs mt-3 text-ivory/40">{item.kicker}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
