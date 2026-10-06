import { AnimatePresence, motion } from "framer-motion";
import { ImpactCounter } from "@/components/animations/ImpactCounter";
import { CategoryBars, ImpactRing, RescueTrendChart } from "@/components/ImpactChart";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { SectionHeading } from "@/components/SectionHeading";
import { EASE, Reveal } from "@/components/animations/text";
import { useDemo } from "@/store/demo";
import { formatNumber } from "@/lib/format";

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

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-ivory/12 bg-ivory/12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: stats.mealsRescued, label: "Meals rescued", suffix: "" },
            { value: stats.foodDivertedKg, label: "Food diverted", suffix: " kg" },
            { value: stats.peopleSupported, label: "People supported", suffix: "" },
            { value: stats.activeVolunteers, label: "Active volunteers", suffix: "" },
          ].map((counter, index) => (
            <motion.div
              key={counter.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.85, ease: EASE, delay: index * 0.07 }}
              className="bg-forest-deep px-6 py-8"
            >
              <p className="text-[clamp(1.9rem,4vw,2.9rem)] leading-none font-extrabold tracking-[-0.045em]">
                <ImpactCounter value={counter.value} />
                {counter.suffix}
              </p>
              <p className="label-xs mt-4 text-ivory/45">{counter.label}</p>
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
