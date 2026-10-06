import { motion } from "framer-motion";
import { ArrowRight, ClipboardCheck, PackageCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { PageHero, Panel, StatBlock } from "@/components/PageHero";
import { CategoryBars, RescueTrendChart } from "@/components/ImpactChart";
import { ImpactCounter } from "@/components/animations/ImpactCounter";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { EASE } from "@/components/animations/text";
import { StageBadge, UrgencyBadge } from "@/components/StatusBadge";
import { kitchenRequests } from "@/data/mock";
import { countdownLabel, formatNumber } from "@/lib/format";
import { useDemo } from "@/store/demo";

const stageLabel = {
  listed: "Awaiting volunteer",
  claimed: "Volunteer assigned",
  picked_up: "In transit",
  delivered: "Received",
} as const;

export default function Organization() {
  const { listings, stats, advanceStage } = useDemo();

  const incoming = listings.filter((item) => item.stage === "listed");
  const deliveries = listings.filter(
    (item) => item.stage === "claimed" || item.stage === "picked_up",
  );
  const received = listings.filter((item) => item.stage === "delivered");

  return (
    <>
      <PageHero
        index="—"
        label="Organization workspace"
        title={["Tonight's rescue", "command centre."]}
        lede="Hope Community Kitchen receives food from the FoodRescue network every evening. This is the view your coordinator works from: what is coming, what is needed and what has already been served."
      >
        <div className="grid gap-px overflow-hidden rounded-sm border border-forest/12 bg-forest/12 sm:grid-cols-2 lg:grid-cols-4">
          <StatBlock value={incoming.length} label="Incoming listings" />
          <StatBlock value={deliveries.length} label="Active deliveries" />
          <StatBlock
            value={kitchenRequests.reduce((sum, request) => sum + request.servings, 0)}
            label="Servings requested tonight"
          />
          <StatBlock
            value={<ImpactCounter value={stats.peopleSupported} />}
            label="People supported"
          />
        </div>
      </PageHero>

      <section className="bg-ivory pb-28">
        <div className="shell grid gap-6 lg:grid-cols-12">
          <Panel label="Incoming food" className="lg:col-span-7">
            <ul className="divide-y divide-forest/10">
              {incoming.slice(0, 5).map((listing) => (
                <li
                  key={listing.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="text-[0.95rem] font-semibold text-forest">
                      {listing.name}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-forest/55">
                      <span>{listing.donorName}</span>
                      <span>{listing.servings} servings</span>
                      <span>{listing.weightKg} kg</span>
                      <UrgencyBadge minutes={listing.minutesLeft} />
                    </p>
                  </div>
                  <button
                    type="button"
                    data-cursor="hover"
                    onClick={() => {
                      advanceStage(listing.id, "claimed");
                      toast.success("Volunteer assigned", {
                        description: `${listing.name} is on its way to your kitchen.`,
                      });
                    }}
                    className="group inline-flex items-center gap-2 text-[0.66rem] font-semibold tracking-[0.18em] text-forest uppercase transition-colors hover:text-ember"
                  >
                    Assign volunteer
                    <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </li>
              ))}
              {incoming.length === 0 ? (
                <li className="py-6 text-[0.9rem] text-forest/60">
                  No new listings right now. The network notifies you the moment
                  surplus appears nearby.
                </li>
              ) : null}
            </ul>
          </Panel>

          <Panel label="Kitchen requests" className="lg:col-span-5">
            <ul className="space-y-5">
              {kitchenRequests.map((request, index) => {
                const progress = request.matched / request.servings;
                return (
                  <li key={request.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[0.88rem] font-semibold text-forest">
                        {request.need}
                      </p>
                      <p className="text-[0.7rem] text-forest/50">{request.by}</p>
                    </div>
                    <p className="mt-1 text-[0.72rem] text-forest/50">
                      {request.kitchen} · {request.area}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-forest/12">
                        <motion.div
                          className="h-full origin-left rounded-full bg-ember"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: progress }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1,
                            ease: EASE,
                            delay: index * 0.08,
                          }}
                        />
                      </div>
                      <span className="text-[0.7rem] font-semibold text-forest/60">
                        {request.matched}/{request.servings}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 border-t border-forest/12 pt-4 text-[0.75rem] leading-relaxed text-forest/55">
              Requests are matched against nearby listings automatically; the
              coordinator can override any match.
            </p>
          </Panel>

          <Panel label="Active deliveries" className="lg:col-span-7">
            <ul className="space-y-3">
              {deliveries.map((listing) => (
                <li
                  key={listing.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-forest/12 px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-[0.92rem] font-semibold text-forest">
                      {listing.name}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.74rem] text-forest/55">
                      <StageBadge
                        stage={listing.stage}
                        label={stageLabel[listing.stage]}
                      />
                      <span className="flex items-center gap-1.5">
                        <Truck className="size-3" />
                        {listing.donorName} → {listing.dropoff}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {listing.stage === "claimed" ? (
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => advanceStage(listing.id, "picked_up")}
                        className="inline-flex items-center gap-2 text-[0.64rem] font-semibold tracking-[0.16em] text-forest uppercase transition-colors hover:text-ember"
                      >
                        <PackageCheck className="size-3.5" />
                        Confirm pickup
                      </button>
                    ) : null}
                    {listing.stage === "picked_up" ? (
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => {
                          advanceStage(listing.id, "delivered");
                          toast.success("Delivery received", {
                            description: `${listing.name} is now counted as impact.`,
                          });
                        }}
                        className="inline-flex items-center gap-2 text-[0.64rem] font-semibold tracking-[0.16em] text-forest uppercase transition-colors hover:text-ember"
                      >
                        <ClipboardCheck className="size-3.5" />
                        Receive delivery
                      </button>
                    ) : null}
                    <span className="text-[0.68rem] text-forest/45">
                      {countdownLabel(listing.minutesLeft)}
                    </span>
                  </div>
                </li>
              ))}
              {deliveries.length === 0 ? (
                <li className="py-6 text-[0.9rem] text-forest/60">
                  No deliveries in progress. Assign a volunteer to an incoming
                  listing above.
                </li>
              ) : null}
            </ul>

            <div className="mt-8 border-t border-forest/12 pt-6">
              <p className="label-xs text-forest/45">
                Received today ·{" "}
                {formatNumber(
                  received.reduce((sum, item) => sum + item.servings, 0),
                )}{" "}
                servings
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {received.slice(0, 6).map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full border border-forest/15 px-3 py-1.5 text-[0.68rem] text-forest/60"
                  >
                    {item.name}
                  </span>
                ))}
                {received.length === 0 ? (
                  <span className="text-[0.78rem] text-forest/50">
                    Nothing received yet — complete a delivery to see it here.
                  </span>
                ) : null}
              </div>
            </div>
          </Panel>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-sm border border-ivory/12 bg-forest-deep p-6 text-ivory">
              <p className="label-xs text-ivory/45">Community impact</p>
              <p className="mt-3 text-[1.1rem] font-semibold">
                Meals served by this kitchen
              </p>
              <p className="mt-6 text-[clamp(2rem,4vw,2.8rem)] leading-none font-extrabold tracking-[-0.045em]">
                <ImpactCounter value={9120} />
              </p>
              <p className="label-xs mt-3 text-ivory/45">Since joining</p>
              <div className="mt-8">
                <CategoryBars />
              </div>
              <div className="mt-10 border-t border-ivory/12 pt-6">
                <p className="label-xs text-ivory/45">
                  Network trend · meals rescued
                </p>
                <RescueTrendChart className="mt-4" />
              </div>
            </div>

            <div className="mt-6">
              <MagneticButton to="/volunteer" variant="outline" size="sm">
                Open volunteer mission view
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
