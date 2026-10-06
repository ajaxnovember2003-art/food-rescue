import { useMemo, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FoodCard, type FoodCardSize } from "@/components/FoodCard";
import { PageHero } from "@/components/PageHero";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Reveal } from "@/components/animations/text";
import { flipChildren } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSlidingPill } from "@/hooks/use-sliding-pill";
import { useDemo } from "@/store/demo";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FoodCategory } from "@/types";

type FilterId = "all" | FoodCategory | "urgent";

const filters: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "meals", label: "Meals" },
  { id: "bakery", label: "Bakery" },
  { id: "fruits", label: "Fruits" },
  { id: "vegetables", label: "Vegetables" },
  { id: "packaged", label: "Packaged" },
  { id: "urgent", label: "Urgent" },
];

/** Asymmetric rhythm: lead features, wide band, then compact supports. */
function shapeFor(index: number): { size: FoodCardSize; span: string } {
  const slot = index % 5;
  if (slot === 0) return { size: "feature", span: "lg:col-span-2" };
  if (slot === 3) return { size: "wide", span: "lg:col-span-2" };
  return { size: "compact", span: "" };
}

export default function Rescue() {
  const { listings } = useDemo();
  const [filter, setFilter] = useState<FilterId>("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { groupRef, pillRef } = useSlidingPill(filter);

  const filtered = useMemo(() => {
    if (filter === "all") return listings;
    if (filter === "urgent")
      return [...listings].sort((a, b) => a.minutesLeft - b.minutesLeft)
        .slice(0, 6);
    return listings.filter((listing) => listing.category === filter);
  }, [listings, filter]);

  const totalServings = filtered.reduce((sum, item) => sum + item.servings, 0);

  // Changing the filter reflows the grid: gsap FLIPs the surviving cards into
  // their new slots while new ones rise in, replacing framer's layout group.
  const changeFilter = (next: FilterId) => {
    const grid = gridRef.current;
    if (!grid || reduce) {
      setFilter(next);
      return;
    }
    flipChildren(grid, () => setFilter(next));
  };

  return (
    <>
      <PageHero
        index="—"
        label="Rescue marketplace"
        title={["Food waiting", "to be rescued."]}
        lede={`${filtered.length} listings open · ${formatNumber(totalServings)} servings available. Filter to find what your kitchen can serve tonight, then open a listing to claim the pickup.`}
      >
        <div className="flex flex-col gap-6 border-t border-forest/12 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div
            ref={groupRef}
            className="relative flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter listings"
          >
            <span
              ref={pillRef}
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 rounded-full bg-forest"
              style={{ opacity: 0 }}
            />
            <span className="mr-2 hidden items-center gap-2 text-forest/40 sm:flex">
              <SlidersHorizontal className="size-3.5" />
            </span>
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-pill={item.id}
                  onClick={() => changeFilter(item.id)}
                  aria-pressed={active}
                  data-cursor="hover"
                  className={cn(
                    "relative rounded-full border px-4 py-2.5 text-[0.68rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300",
                    active
                      ? "border-forest text-ivory"
                      : "border-forest/18 text-forest/60 hover:border-forest/40 hover:text-forest",
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          <p className="label-xs text-forest/45">
            {filter === "all"
              ? "Showing the full rescue pool"
              : filter === "urgent"
                ? "Sorted by shortest safe window"
                : `Filtered to ${filter}`}
          </p>
        </div>
      </PageHero>

      <section className="bg-ivory pb-28">
        <div className="shell">
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((listing, index) => {
              const shape = shapeFor(index);
              return (
                <FoodCard
                  key={listing.id}
                  listing={listing}
                  size={shape.size}
                  index={index}
                  className={shape.span}
                />
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <Reveal className="rounded-sm border border-forest/15 bg-[#fffdf8] px-6 py-16 text-center">
              <p className="display-md text-forest">Nothing in this category yet.</p>
              <p className="mx-auto mt-4 max-w-md text-[0.9rem] leading-relaxed text-forest/60">
                Every listing in the pilot network has been matched. Clear the
                filter to see the full pool, or list surplus food yourself.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <MagneticButton
                  variant="outline"
                  size="sm"
                  onClick={() => changeFilter("all")}
                >
                  Show all listings
                </MagneticButton>
                <MagneticButton to="/donate" size="sm">
                  Donate food
                </MagneticButton>
              </div>
            </Reveal>
          ) : null}

          <div className="mt-14 flex flex-col gap-6 border-t border-forest/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[0.88rem] leading-relaxed text-forest/60">
              Can't travel tonight? Claiming a listing assigns it to the
              volunteer nearest the pickup window — someone else can collect it.
            </p>
            <MagneticButton to="/volunteer" variant="outline" size="sm">
              Open volunteer flow
            </MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
}
