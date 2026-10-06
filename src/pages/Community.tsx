import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FoodImage } from "@/components/FoodImage";
import { PageHero, Panel } from "@/components/PageHero";
import { communityPhoto } from "@/data/photos";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { EASE, Reveal } from "@/components/animations/text";
import { people } from "@/data/mock";
import { cn } from "@/lib/utils";

type FilterId = "all" | "donors" | "volunteers" | "organizations";

const filters: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "Everyone" },
  { id: "donors", label: "Top donors" },
  { id: "volunteers", label: "Top volunteers" },
  { id: "organizations", label: "Organizations" },
];

const badgeTone: Record<string, string> = {
  "Rescue Champion": "border-ember/40 text-ember",
  "Community Hero": "border-forest/30 text-forest",
  "Top Donor": "border-forest bg-forest text-ivory",
};

function matches(person: (typeof people)[number], filter: FilterId) {
  if (filter === "all") return true;
  if (filter === "donors") return person.role === "Donor";
  if (filter === "volunteers") return person.role === "Volunteer";
  return person.role === "Community kitchen" || person.role === "NGO";
}

export default function Community() {
  const [filter, setFilter] = useState<FilterId>("all");

  const visible = useMemo(
    () => people.filter((person) => matches(person, filter)),
    [filter],
  );

  const leaders = useMemo(
    () => [...people].sort((a, b) => b.stat.length - a.stat.length).slice(0, 3),
    [],
  );

  return (
    <>
      <PageHero
        index="—"
        label="Community"
        title={["People make", "the network."]}
        lede="Kitchens that cook, volunteers who ride, donors who list instead of binning. Recognition here is earned on delivered food — never on volume of listings alone."
      >
        <div className="flex flex-wrap items-center gap-2 border-t border-forest/12 pt-6">
          {filters.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={active}
                data-cursor="hover"
                className={cn(
                  "relative rounded-full border px-4 py-2 text-[0.68rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300",
                  active
                    ? "border-forest text-ivory"
                    : "border-forest/18 text-forest/60 hover:border-forest/40 hover:text-forest",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="community-pill"
                    className="absolute inset-0 rounded-full bg-forest"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </PageHero>

      <section className="bg-ivory pb-28">
        <div className="shell">
          <Reveal>
            <div className="relative mb-12 overflow-hidden rounded-sm">
              <div className="aspect-[16/10] sm:aspect-[21/9]">
                <FoodImage
                  photo={communityPhoto}
                  category="packaged"
                  hue={150}
                  seed={31}
                  tint={0.24}
                  sizes="100vw"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(5,23,19,0) 40%, rgba(5,23,19,0.8) 100%)",
                }}
              />
              <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4">
                <p className="max-w-md text-[0.85rem] leading-relaxed text-ivory/85 sm:text-[0.95rem]">
                  Packing the evening routes — volunteers collect inside each
                  safe window and hand the food straight to a kitchen.
                </p>
                <span className="label-xs text-ivory/50">
                  {communityPhoto.credit}
                </span>
              </div>
            </div>
          </Reveal>

          <LayoutGroup>
            <motion.div
              layout
              className="grid gap-px overflow-hidden rounded-sm border border-forest/12 bg-forest/12 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {visible.map((person, index) => (
                  <motion.article
                    key={person.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.7, ease: EASE, delay: index * 0.04 }}
                    data-cursor="hover"
                    className="group relative bg-[#fffdf8] p-6 transition-colors duration-500 hover:bg-sand/60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-14 shrink-0 place-items-center rounded-full border border-forest/20 text-[0.85rem] font-bold tracking-[0.06em] text-forest uppercase">
                        {person.initials}
                      </span>
                      {person.badge ? (
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-[0.55rem] font-semibold tracking-[0.16em] uppercase",
                            badgeTone[person.badge],
                          )}
                        >
                          {person.badge}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="mt-7 text-[1.3rem] font-extrabold tracking-[-0.025em] text-forest">
                      {person.name}
                    </h2>
                    <p className="mt-2 text-[0.72rem] font-semibold tracking-[0.16em] text-forest/45 uppercase">
                      {person.role} · {person.city}
                    </p>
                    <p className="mt-6 border-t border-forest/12 pt-4 text-[0.88rem] text-forest/65">
                      {person.stat}
                    </p>
                    <ArrowUpRight className="absolute right-6 bottom-6 size-4 -translate-x-2 text-forest/40 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {visible.length === 0 ? (
            <div className="rounded-sm border border-forest/15 bg-[#fffdf8] px-6 py-16 text-center">
              <p className="display-md text-forest">Nobody here yet.</p>
              <p className="mx-auto mt-4 max-w-md text-[0.9rem] text-forest/60">
                No profiles match this filter. Try another group, or join the
                network yourself.
              </p>
              <div className="mt-8 flex justify-center">
                <MagneticButton variant="outline" size="sm" onClick={() => setFilter("all")}>
                  Show everyone
                </MagneticButton>
              </div>
            </div>
          ) : null}

          <div className="mt-16 grid gap-6 lg:grid-cols-12">
            <Panel label="Recognition leaders" className="lg:col-span-7">
              <ul className="divide-y divide-forest/10">
                {leaders.map((person, index) => (
                  <li
                    key={person.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-5 first:pt-0"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[0.7rem] font-semibold tracking-[0.16em] text-forest/35">
                        0{index + 1}
                      </span>
                      <span className="grid size-10 place-items-center rounded-full border border-forest/20 text-[0.75rem] font-bold text-forest uppercase">
                        {person.initials}
                      </span>
                      <span>
                        <span className="block text-[0.95rem] font-semibold text-forest">
                          {person.name}
                        </span>
                        <span className="block text-[0.72rem] text-forest/50">
                          {person.role} · {person.city}
                        </span>
                      </span>
                    </div>
                    <span className="text-[0.85rem] font-semibold text-forest/70">
                      {person.stat}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-forest/12 pt-4 text-[0.78rem] leading-relaxed text-forest/55">
                Ranking weighs delivered food, consistency across months and
                verified outcomes. A single large donation does not outrank
                steady weekly rescues.
              </p>
            </Panel>

            <div className="lg:col-span-5">
              <Panel label="Badges">
                <ul className="space-y-5">
                  {[
                    {
                      badge: "Rescue Champion",
                      detail:
                        "50+ completed pickups with no missed safe windows.",
                    },
                    {
                      badge: "Community Hero",
                      detail:
                        "A kitchen or NGO serving 5,000+ rescued meals in the network.",
                    },
                    {
                      badge: "Top Donor",
                      detail:
                        "100+ verified listings with food delivered every time.",
                    },
                  ].map((item) => (
                    <li key={item.badge}>
                      <span
                        className={cn(
                          "inline-block rounded-full border px-3 py-1.5 text-[0.58rem] font-semibold tracking-[0.18em] uppercase",
                          badgeTone[item.badge],
                        )}
                      >
                        {item.badge}
                      </span>
                      <p className="mt-3 text-[0.85rem] leading-relaxed text-forest/65">
                        {item.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </Panel>

              <div className="mt-6 rounded-sm border border-forest/12 bg-sand p-6">
                <p className="text-[1rem] font-extrabold tracking-[-0.02em] text-forest uppercase">
                  Join the network
                </p>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-forest/65">
                  Cook, ride or list. Every role keeps the route open — and the
                  first rescue usually happens the same evening.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <MagneticButton to="/volunteer" size="sm">
                    Become a volunteer
                  </MagneticButton>
                  <MagneticButton to="/donate" variant="outline" size="sm">
                    Donate food
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
