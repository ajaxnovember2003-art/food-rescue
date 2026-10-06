import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { SectionHeading } from "@/components/SectionHeading";
import { EASE, Reveal } from "@/components/animations/text";
import { people } from "@/data/mock";
import { cn } from "@/lib/utils";

const badgeTone: Record<string, string> = {
  "Rescue Champion": "border-ember/40 text-ember",
  "Community Hero": "border-forest/30 text-forest",
  "Top Donor": "border-forest bg-forest text-ivory",
};

/**
 * The network is people, not software. Profiles are presented like editorial
 * contributor cards: initials, role, what they actually moved, and one badge.
 */
export function CommunitySection() {
  const featured = people.slice(0, 6);

  return (
    <section className="relative bg-ivory py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          index="11"
          label="Community"
          title={["People make", "the network."]}
          lede="Volunteers, donors, kitchens and NGOs keep the route open every evening. Recognition here is quiet and earned — a badge, a number, a record of what moved."
          align="between"
          action={
            <MagneticButton to="/community" variant="outline" size="sm">
              Meet the network
            </MagneticButton>
          }
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm border border-forest/12 bg-forest/12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((person, index) => (
            <motion.article
              key={person.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.8, ease: EASE, delay: index * 0.06 }}
              data-cursor="hover"
              className="group relative bg-[#fffdf8] p-6 transition-colors duration-500 hover:bg-sand/60"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-full border text-[0.8rem] font-bold tracking-[0.06em] uppercase transition-colors duration-500",
                    person.badge
                      ? "border-forest/25 text-forest"
                      : "border-forest/15 text-forest/60",
                  )}
                >
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

              <h3 className="mt-6 text-[1.15rem] font-extrabold tracking-[-0.02em] text-forest">
                {person.name}
              </h3>
              <p className="mt-1 text-[0.72rem] font-semibold tracking-[0.16em] text-forest/45 uppercase">
                {person.role} · {person.city}
              </p>
              <p className="mt-5 border-t border-forest/12 pt-4 text-[0.85rem] text-forest/65">
                {person.stat}
              </p>

              <ArrowUpRight className="absolute right-6 bottom-6 size-4 -translate-x-2 text-forest/40 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-8">
          <div className="flex flex-col gap-6 rounded-sm border border-forest/12 bg-sand p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[0.95rem] leading-relaxed text-forest/70">
              Badges are awarded on verified outcomes, never on volume alone:
              rescues completed, food actually delivered, and consistency across
              months.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Rescue Champion", "Community Hero", "Top Donor"].map((badge) => (
                <span
                  key={badge}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[0.58rem] font-semibold tracking-[0.18em] uppercase",
                    badgeTone[badge],
                  )}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
