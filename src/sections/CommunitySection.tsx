import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { FoodImage } from "@/components/FoodImage";
import { communityPhoto } from "@/data/photos";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { SectionHeading } from "@/components/SectionHeading";
import { EASE, Reveal } from "@/components/animations/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
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
  const gridRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || reduce) return;
    const cards = grid.querySelectorAll<HTMLElement>("[data-person]");
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 22,
        duration: 0.8,
        ease: EASE,
        stagger: 0.06,
        scrollTrigger: { trigger: grid, start: "top 85%", once: true },
      });
    }, grid);
    return () => ctx.revert();
  }, [reduce]);

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

        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-sm">
            <div className="aspect-[16/9] sm:aspect-[21/9]">
              <FoodImage
                photo={communityPhoto}
                category="packaged"
                hue={150}
                seed={21}
                tint={0.24}
                sizes="100vw"
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5,23,19,0) 38%, rgba(5,23,19,0.82) 100%)",
              }}
            />
            <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4">
              <p className="max-w-md text-[0.85rem] leading-relaxed text-ivory/85 sm:text-[0.95rem]">
                Volunteers packing the evening routes in Riverside — 128 riders
                keep the network moving after service closes.
              </p>
              <span className="label-xs text-ivory/50">
                {communityPhoto.credit}
              </span>
            </div>
          </div>
        </Reveal>

        <div
          ref={gridRef}
          className="mt-8 grid gap-px overflow-hidden rounded-sm border border-forest/12 bg-forest/12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((person) => (
            <article
              key={person.id}
              data-person
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
            </article>
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
