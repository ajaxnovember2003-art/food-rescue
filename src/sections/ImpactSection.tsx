import { AnimatePresence, motion } from "framer-motion";
import { ImpactCounter } from "@/components/animations/ImpactCounter";
import { CategoryBars, ImpactRing, RescueTrendChart } from "@/components/ImpactChart";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { SectionHeading } from "@/components/SectionHeading";
import { EASE, Reveal } from "@/components/animations/text";
import { useDemo } from "@/store/demo";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The impact chapter: a deep green panel where every number is driven by demo
 * state, so completing a rescue visibly moves the counters upward.
 */
export function ImpactSection() {
  const { stats, personal, lastDelta, rescuesThisSession } = useDemo();

  return (
    <section className="relative overflow-hidden bg-forest-deep py-24 text-ivory md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(50% 40% at 12% 8%, rgba(109,143,106,0.22), transparent 70%), radial-gradient(45% 40% at 88% 82%, rgba(226,112,58,0.16), transparent 70%)",
        }}
      />
      <div className="shell relative">
        <SectionHeading
          index="10"
          label="Impact"
          dark
          title={["Every rescue", "creates impact."]}
          lede="Meals served, kilograms diverted and emissions avoided are recorded the moment a delivery is confirmed. This is the tally for the pilot network this month."
        />

        {/* The payoff: three enormous numbers, alternating sides, each one
            counting up as it enters the viewport. */}
        <div className="mt-16 border-t border-ivory/15">
          {[
            {
              value: stats.mealsRescued,
              suffix: "+",
              label: "Meals rescued",
              note: "Portions served from surplus that would have been thrown away.",
            },
            {
              value: stats.foodDivertedKg,
              suffix: " kg",
              label: "Food diverted",
              note: "Kept out of waste streams across the pilot districts.",
            },
            {
              value: stats.peopleSupported,
              suffix: "",
              label: "People supported",
              note: "Reached through community kitchens, shelters and shared fridges.",
            },
          ].map((row, index) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.9, ease: EASE, delay: index * 0.06 }}
              className={cn(
                "flex flex-col gap-5 border-b border-ivory/12 py-9 md:flex-row md:items-end md:justify-between md:gap-12",
                index % 2 === 1 && "md:flex-row-reverse md:text-right",
              )}
            >
              <p className="text-[clamp(3rem,8.5vw,7rem)] leading-[0.85] font-extrabold tracking-[-0.05em] tabular-nums">
                <ImpactCounter value={row.value} />
                <span
                  className={row.suffix === "+" ? "text-ember" : "uppercase"}
                >
                  {row.suffix}
                </span>
              </p>
              <div className="md:max-w-xs">
                <p className="label-xs text-ivory/85">{row.label}</p>
                <p
                  className={cn(
                    "mt-2 text-[0.82rem] leading-relaxed text-ivory/50",
                    index % 2 === 1 && "md:ml-auto",
                  )}
                >
                  {row.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative mt-6 h-6">
          <AnimatePresence>
            {lastDelta ? (
              <motion.p
                key={lastDelta.at}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="label-xs absolute left-0 text-ember"
              >
                + {formatNumber(lastDelta.meals)} meals · +{lastDelta.kg} kg
                diverted from your last rescue
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="h-full rounded-sm border border-ivory/12 bg-forest/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-xs text-ivory/45">Rescue trend</p>
                  <p className="mt-2 text-[1.05rem] font-semibold">
                    Meals rescued per week
                  </p>
                </div>
                <p className="label-xs text-ivory/40">Last 12 weeks</p>
              </div>
              <RescueTrendChart className="mt-6" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-sm border border-ivory/12 bg-forest/60 p-6">
              <div>
                <p className="label-xs text-ivory/45">What we rescue</p>
                <p className="mt-2 text-[1.05rem] font-semibold">
                  Share of listings by category
                </p>
              </div>
              <CategoryBars className="mt-8" />
              <p className="mt-8 border-t border-ivory/12 pt-4 text-[0.75rem] leading-relaxed text-ivory/45">
                Illustrative distribution from the demo dataset.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-6">
          <div className="grid gap-8 rounded-sm border border-ivory/12 bg-forest/60 p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="label-xs text-ivory/45">Your impact</p>
              <p className="mt-3 text-[1.4rem] font-extrabold tracking-[-0.03em] uppercase">
                What one volunteer moved
              </p>
              <p className="mt-4 max-w-sm text-[0.88rem] leading-relaxed text-ivory/60">
                Every accepted pickup adds to your personal record. Complete the
                volunteer flow and this ring fills in real time.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                <div>
                  <p className="text-[1.7rem] leading-none font-extrabold tracking-[-0.04em]">
                    <ImpactCounter value={personal.foodDivertedKg} /> kg
                  </p>
                  <p className="label-xs mt-2 text-ivory/45">Food diverted</p>
                </div>
                <div>
                  <p className="text-[1.7rem] leading-none font-extrabold tracking-[-0.04em]">
                    <ImpactCounter value={personal.deliveries} />
                  </p>
                  <p className="label-xs mt-2 text-ivory/45">Deliveries</p>
                </div>
                <div>
                  <p className="text-[1.7rem] leading-none font-extrabold tracking-[-0.04em]">
                    <ImpactCounter value={personal.impactPoints} />
                  </p>
                  <p className="label-xs mt-2 text-ivory/45">Impact points</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 lg:col-span-4">
              <ImpactRing
                value={personal.mealsRescued}
                max={800}
                label="Meals rescued"
                sublabel={`Level ${personal.level} rescuer`}
              />
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-sm border border-ivory/12 p-5">
                <p className="label-xs text-ivory/45">This session</p>                  <p className="mt-3 text-[1.6rem] leading-none font-extrabold tracking-[-0.04em]">
                  <ImpactCounter value={rescuesThisSession} />
                </p>
                <p className="mt-2 text-[0.78rem] text-ivory/50">
                  Rescues completed in this demo
                </p>
                <div className="mt-6">
                  <MagneticButton
                    to="/impact"
                    variant="outline"
                    size="sm"
                    className="border-ivory/30 text-ivory hover:border-ivory/70"
                  >
                    Full impact report
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
