import { motion } from "framer-motion";
import { Leaf, TrendingUp, Users, Utensils } from "lucide-react";
import { PageHero, Panel, StatBlock } from "@/components/PageHero";
import {
  CategoryBars,
  ImpactRing,
  RescueTrendChart,
} from "@/components/ImpactChart";
import { ImpactCounter } from "@/components/animations/ImpactCounter";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { EASE, Reveal } from "@/components/animations/text";
import { formatNumber } from "@/lib/format";
import { useDemo } from "@/store/demo";

const milestones = [
  {
    period: "Month 01",
    title: "The first route",
    detail:
      "One hotel kitchen, two volunteers and a community fridge three streets away.",
    value: "1,040 meals",
  },
  {
    period: "Month 04",
    title: "Evening collections",
    detail:
      "Restaurants joined with after-service windows, doubling nightly volume.",
    value: "4,880 meals",
  },
  {
    period: "Month 08",
    title: "Event scale",
    detail:
      "Wedding and conference halls began listing trays by the hundred.",
    value: "9,120 meals",
  },
  {
    period: "Month 12",
    title: "A standing network",
    detail:
      "46 receiving kitchens, 128 active volunteers and daily routes in four districts.",
    value: "12,480 meals",
  },
];

export default function Impact() {
  const { stats, personal, rescuesThisSession, lastDelta } = useDemo();

  const counters = [
    { value: stats.mealsRescued, label: "Meals rescued", icon: Utensils },
    { value: stats.foodDivertedKg, label: "Food diverted (kg)", icon: Leaf },
    { value: stats.peopleSupported, label: "People supported", icon: Users },
    { value: stats.activeVolunteers, label: "Active volunteers", icon: TrendingUp },
  ];

  return (
    <>
      <PageHero
        index="—"
        label="Impact report"
        dark
        title={["Every rescue", "creates impact."]}
        lede="Each confirmed delivery is measured in meals served, kilograms diverted and emissions avoided. These are the live counters for the pilot network — and the same numbers move when you complete a rescue in this demo."
      >
        <div className="grid gap-px overflow-hidden rounded-sm border border-ivory/12 bg-ivory/12 sm:grid-cols-2 lg:grid-cols-4">
          <StatBlock
            dark
            value={<ImpactCounter value={stats.mealsRescued} />}
            label="Meals rescued"
          />
          <StatBlock
            dark
            value={
              <>
                <ImpactCounter value={stats.foodDivertedKg} /> kg
              </>
            }
            label="Food diverted"
          />
          <StatBlock
            dark
            value={<ImpactCounter value={stats.peopleSupported} />}
            label="People supported"
          />
          <StatBlock
            dark
            value={
              <>
                <ImpactCounter value={stats.co2AvoidedKg} /> kg
              </>
            }
            label="CO₂ avoided"
          />
        </div>
      </PageHero>

      <section className="bg-forest-deep pb-24 text-ivory md:pb-32">
        <div className="shell">
          {lastDelta ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-ember/40 bg-ember/10 px-6 py-5"
            >
              <p className="text-[0.95rem] font-semibold">
                Your last rescue added {formatNumber(lastDelta.meals)} meals and{" "}
                {lastDelta.kg} kg diverted.
              </p>
              <span className="label-xs text-ember">
                Live demo state
              </span>
            </motion.div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <div className="h-full rounded-sm border border-ivory/12 bg-forest/50 p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="label-xs text-ivory/45">Rescue trend</p>
                    <p className="mt-2 text-[1.1rem] font-semibold">
                      Meals rescued and kilograms diverted
                    </p>
                  </div>
                  <div className="flex items-center gap-5 text-[0.7rem] text-ivory/55">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-ember" />
                      Meals
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-sage" />
                      Kilograms
                    </span>
                  </div>
                </div>
                <RescueTrendChart className="mt-8 h-[320px]" />
                <p className="mt-6 border-t border-ivory/12 pt-4 text-[0.75rem] text-ivory/45">
                  Twelve-week view · illustrative demo dataset
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-4">
              <div className="flex h-full flex-col gap-6">
                <div className="rounded-sm border border-ivory/12 bg-forest/50 p-6">
                  <p className="label-xs text-ivory/45">Where it comes from</p>
                  <CategoryBars className="mt-6" />
                </div>
                <div className="rounded-sm border border-ivory/12 bg-forest/50 p-6">
                  <p className="label-xs text-ivory/45">Conversion</p>
                  <p className="mt-4 text-[0.9rem] leading-relaxed text-ivory/65">
                    Every 10 kilograms of rescued food becomes roughly 36 meals
                    and keeps about 30 kilograms of CO₂ out of the atmosphere.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-ivory/12 bg-ivory/12 sm:grid-cols-2 lg:grid-cols-4">
            {counters.map((counter, index) => {
              const Icon = counter.icon;
              return (
                <motion.div
                  key={counter.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.8, ease: EASE, delay: index * 0.06 }}
                  className="bg-forest-deep px-6 py-8"
                >
                  <Icon className="size-4 text-ember" />
                  <p className="mt-5 text-[clamp(1.6rem,3.4vw,2.4rem)] leading-none font-extrabold tracking-[-0.045em]">
                    <ImpactCounter value={counter.value} />
                  </p>
                  <p className="label-xs mt-3 text-ivory/45">{counter.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* impact timeline */}
          <div className="mt-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="label-xs text-ivory/45">Impact timeline</span>
                <h2 className="display-md mt-4">How the network grew.</h2>
              </div>
              <p className="max-w-sm text-[0.85rem] leading-relaxed text-ivory/55">
                A year of rescues, recorded as milestones rather than dashboard
                rows.
              </p>
            </div>

            <div className="relative mt-12">
              <div className="absolute top-2 left-0 h-px w-full bg-ivory/12" />
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.period}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-6% 0px" }}
                    transition={{ duration: 0.8, ease: EASE, delay: index * 0.08 }}
                  >
                    <span className="block size-4 rounded-full border border-ember bg-forest-deep" />
                    <p className="label-xs mt-5 text-ember">{milestone.period}</p>
                    <p className="mt-3 text-[1.15rem] font-extrabold tracking-[-0.02em] uppercase">
                      {milestone.title}
                    </p>
                    <p className="mt-3 text-[0.85rem] leading-relaxed text-ivory/60">
                      {milestone.detail}
                    </p>
                    <p className="mt-4 text-[0.85rem] font-semibold text-ivory/80">
                      {milestone.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* personal impact */}
          <div className="mt-20 grid gap-6 rounded-sm border border-ivory/12 bg-forest/50 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="label-xs text-ivory/45">Personal impact</span>
              <h2 className="display-md mt-5">Your impact.</h2>
              <p className="mt-5 max-w-md text-[0.92rem] leading-relaxed text-ivory/65">
                Rescues you completed through the volunteer flow. Levels rise
                with delivered food, not with listings claimed.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[1.8rem] leading-none font-extrabold tracking-[-0.04em]">
                    <ImpactCounter value={personal.foodDivertedKg} /> kg
                  </p>
                  <p className="label-xs mt-2 text-ivory/45">Food diverted</p>
                </div>
                <div>
                  <p className="text-[1.8rem] leading-none font-extrabold tracking-[-0.04em]">
                    <ImpactCounter value={personal.deliveries} />
                  </p>
                  <p className="label-xs mt-2 text-ivory/45">
                    Community deliveries
                  </p>
                </div>
                <div>
                  <p className="text-[1.8rem] leading-none font-extrabold tracking-[-0.04em]">
                    <ImpactCounter value={personal.impactPoints} />
                  </p>
                  <p className="label-xs mt-2 text-ivory/45">Impact points</p>
                </div>
                <div>
                  <p className="text-[1.8rem] leading-none font-extrabold tracking-[-0.04em]">
                    <ImpactCounter value={rescuesThisSession} />
                  </p>
                  <p className="label-xs mt-2 text-ivory/45">This session</p>
                </div>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <MagneticButton to="/volunteer" variant="ember" size="sm">
                  Take a rescue now
                </MagneticButton>
                <MagneticButton
                  to="/organization"
                  variant="outline"
                  size="sm"
                  className="border-ivory/30 text-ivory hover:border-ivory/70"
                >
                  Organization view
                </MagneticButton>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-4">
              <ImpactRing
                value={personal.mealsRescued}
                max={800}
                label="Meals rescued"
                sublabel={`Level ${personal.level} rescuer`}
                size={250}
              />
            </div>

            <div className="lg:col-span-3">
              <Panel
                dark
                label="What one more rescue adds"
                className="border-ivory/12 bg-forest-deep"
              >
                <ul className="space-y-3 text-[0.85rem] text-ivory/70">
                  {[
                    "40 meals served",
                    "11 kg diverted",
                    "25 people reached",
                    "33 kg CO₂ avoided",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" />
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-ivory/12 pt-4 text-[0.75rem] text-ivory/45">
                  Based on a 40-serving listing — prototype estimate.
                </p>
              </Panel>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
