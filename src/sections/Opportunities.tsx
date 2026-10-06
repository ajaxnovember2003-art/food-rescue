import { FoodCard } from "@/components/FoodCard";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { SectionHeading } from "@/components/SectionHeading";
import { useDemo } from "@/store/demo";
import { formatNumber } from "@/lib/format";
import { Reveal } from "@/components/animations/text";

/**
 * A preview of the marketplace in an asymmetric editorial grid: one lead
 * listing, two supports and a tall panel that keeps the rhythm irregular.
 */
export function Opportunities() {
  const { listings, stats } = useDemo();
  const preview = listings.slice(0, 3);

  return (
    <section className="relative bg-ivory py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          index="07"
          label="Live opportunities"
          title={["Food waiting", "to be rescued."]}
          lede={`${stats.activeRescues} listings are open right now across our pilot districts. Each one carries a safe window, a verified donor and a route a volunteer can take this evening.`}
          align="between"
          action={
            <MagneticButton to="/rescue" variant="outline" size="sm">
              Open marketplace
            </MagneticButton>
          }
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {preview[0] ? (
            <FoodCard
              listing={preview[0]}
              size="feature"
              index={0}
              className="lg:col-span-7"
            />
          ) : null}

          <div className="flex flex-col gap-6 lg:col-span-5">
            {preview[1] ? (
              <FoodCard listing={preview[1]} size="wide" index={1} />
            ) : null}

            <Reveal className="flex-1">
              <div className="flex h-full flex-col justify-between rounded-sm border border-forest/12 bg-sand p-6">
                <div>
                  <span className="label-xs text-forest/45">
                    Tonight's network
                  </span>
                  <p className="display-num mt-4 text-forest">
                    {formatNumber(
                      listings.reduce((sum, item) => sum + item.servings, 0),
                    )}
                  </p>
                  <p className="label-xs mt-3 text-forest/50">
                    Servings listed for rescue
                  </p>
                </div>
                <div className="mt-8 space-y-3 border-t border-forest/12 pt-5 text-[0.8rem] text-forest/65">
                  <p className="flex items-center justify-between">
                    <span>Open listings</span>
                    <span className="font-semibold text-forest">
                      {listings.filter((item) => item.stage === "listed").length}
                    </span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>In delivery now</span>
                    <span className="font-semibold text-forest">
                      {
                        listings.filter((item) => item.stage === "picked_up")
                          .length
                      }
                    </span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Delivered today</span>
                    <span className="font-semibold text-forest">
                      {
                        listings.filter((item) => item.stage === "delivered")
                          .length
                      }
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {preview[2] ? (
            <FoodCard
              listing={preview[2]}
              size="wide"
              index={2}
              className="lg:col-span-12"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
