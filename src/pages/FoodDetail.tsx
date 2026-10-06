import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  MapPin,
  Package,
  ShieldCheck,
  Snowflake,
  Timer,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router";
import { FoodArtwork } from "@/components/FoodArtwork";
import { FoodCard } from "@/components/FoodCard";
import { Panel } from "@/components/PageHero";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { RevealImage } from "@/components/animations/RevealImage";
import { EASE } from "@/components/animations/text";
import { UrgencyBadge } from "@/components/StatusBadge";
import { countdownLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { stageOrder, useDemo } from "@/store/demo";

const stageCopy: Record<string, string> = {
  listed: "Waiting for a volunteer",
  claimed: "Volunteer assigned",
  picked_up: "In transit",
  delivered: "Delivered and counted",
};

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, claimListing, advanceStage, stageLabelFor, missionId } =
    useDemo();

  const listing = listings.find((item) => item.id === id);

  if (!listing) {
    return (
      <section className="min-h-[70vh] bg-ivory pt-40 pb-24">
        <div className="shell max-w-2xl">
          <p className="label-xs text-forest/45">Listing not found</p>
          <h1 className="display-lg mt-6 text-forest">
            This rescue has already closed.
          </h1>
          <p className="mt-6 max-w-lg text-[1rem] leading-relaxed text-forest/65">
            Listings disappear from the marketplace once they are delivered and
            counted. Head back to the rescue pool to find food waiting now.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <MagneticButton to="/rescue">Back to marketplace</MagneticButton>
            <MagneticButton to="/" variant="outline">
              Return home
            </MagneticButton>
          </div>
        </div>
      </section>
    );
  }

  const currentIndex = stageOrder.indexOf(listing.stage);
  const isDelivered = listing.stage === "delivered";
  const isMission = missionId === listing.id;
  const related = listings
    .filter((item) => item.id !== listing.id && item.stage === "listed")
    .slice(0, 3);

  const handleClaim = () => {
    claimListing(listing.id);
    toast.success("Pickup assigned", {
      description: `${listing.name} is now on your route.`,
    });
  };

  const handleAdvance = (next: "picked_up" | "delivered") => {
    advanceStage(listing.id, next);
    toast[next === "picked_up" ? "info" : "success"](
      next === "picked_up" ? "Pickup confirmed" : "Food delivered",
      {
        description:
          next === "picked_up"
            ? "Cold chain checked at the donor door."
            : "Impact updated — the rescued meals are now counted.",
      },
    );
  };

  return (
    <>
      <section className="bg-ivory pt-28 pb-16 md:pt-36">
        <div className="shell">
          <Link
            to="/rescue"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.18em] text-forest/50 uppercase transition-colors hover:text-forest"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1" />
            All rescues
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <RevealImage
                className="aspect-[4/5] w-full rounded-sm sm:aspect-[16/12] lg:aspect-[4/5]"
                innerClassName="h-full w-full"
                parallax={18}
              >
                <motion.div
                  layoutId={`food-card-${listing.id}`}
                  className="h-full w-full"
                >
                  <FoodArtwork
                    category={listing.category}
                    hue={listing.hue}
                    seed={listing.servings}
                  />
                </motion.div>
              </RevealImage>

              <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-forest/12 bg-forest/12 sm:grid-cols-4">
                {[
                  { label: "Storage", value: listing.storage, icon: Snowflake },
                  { label: "Quantity", value: listing.quantityLabel, icon: Package },
                  { label: "Distance", value: `${listing.distanceKm} km`, icon: MapPin },
                  { label: "Safe for", value: countdownLabel(listing.minutesLeft), icon: Timer },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-[#fffdf8] px-4 py-4">
                      <Icon className="size-3.5 text-forest/40" />
                      <p className="mt-3 text-[0.8rem] font-semibold text-forest">
                        {item.value}
                      </p>
                      <p className="label-xs mt-1 text-forest/40">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="flex flex-wrap items-center gap-3">
                <UrgencyBadge minutes={listing.minutesLeft} />
                {listing.verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-forest/70 uppercase">
                    <ShieldCheck className="size-3.5" />
                    Verified donor
                  </span>
                ) : (
                  <span className="rounded-full border border-forest/15 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-forest/50 uppercase">
                    Community listing
                  </span>
                )}
                <span className="rounded-full border border-forest/15 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-forest/50 uppercase">
                  {listing.postedAt}
                </span>
              </div>

              <h1 className="display-lg mt-7 text-forest">{listing.name}</h1>

              <p className="mt-6 text-[1rem] leading-relaxed text-forest/70">
                {listing.notes}
              </p>

              <dl className="mt-9 grid gap-px overflow-hidden rounded-sm border border-forest/12 bg-forest/12 sm:grid-cols-2">
                {[
                  { term: "Donor", detail: listing.donorName },
                  { term: "Pickup", detail: `${listing.pickupArea} · ${listing.pickupWindow}` },
                  { term: "Delivery", detail: listing.dropoff },
                  { term: "Servings", detail: `${listing.servings} · ${listing.weightKg} kg` },
                ].map((row) => (
                  <div key={row.term} className="bg-[#fffdf8] px-5 py-5">
                    <dt className="label-xs text-forest/40">{row.term}</dt>
                    <dd className="mt-2 text-[0.9rem] font-medium text-forest">
                      {row.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-9">
                {isDelivered ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-forest bg-forest px-6 py-5 text-ivory"
                  >
                    <div>
                      <p className="text-[1.05rem] font-extrabold tracking-[-0.02em] uppercase">
                        Delivered and counted
                      </p>
                      <p className="mt-1 text-[0.82rem] text-ivory/60">
                        +{listing.servings} meals and +{listing.weightKg} kg added
                        to the network impact.
                      </p>
                    </div>
                    <MagneticButton to="/impact" variant="ember" size="sm">
                      See impact
                    </MagneticButton>
                  </motion.div>
                ) : listing.stage === "listed" ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <MagneticButton onClick={handleClaim} cursorLabel="ACCEPT">
                      Rescue this food
                    </MagneticButton>
                    <span className="text-[0.78rem] text-forest/55">
                      Assigns the pickup to you and opens the volunteer flow.
                    </span>
                  </div>
                ) : (
                  <div className="rounded-sm border border-forest/15 bg-[#fffdf8] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="label-xs text-forest/45">Your mission</p>
                        <p className="mt-2 text-[0.95rem] font-semibold text-forest">
                          {stageCopy[listing.stage]}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {listing.stage === "claimed" ? (
                          <MagneticButton
                            size="sm"
                            onClick={() => handleAdvance("picked_up")}
                          >
                            Mark as picked up
                          </MagneticButton>
                        ) : null}
                        {listing.stage === "picked_up" ? (
                          <MagneticButton
                            size="sm"
                            onClick={() => handleAdvance("delivered")}
                          >
                            Mark as delivered
                          </MagneticButton>
                        ) : null}
                        {isMission ? (
                          <MagneticButton
                            to="/volunteer"
                            variant="outline"
                            size="sm"
                          >
                            Open mission view
                          </MagneticButton>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-forest/12 bg-sand py-16">
        <div className="shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="label-xs text-forest/45">Rescue timeline</span>
              <h2 className="display-md mt-4 text-forest">
                Where this food is now.
              </h2>
            </div>
            <p className="label-xs text-forest/50">
              {stageCopy[listing.stage]}
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stageOrder.map((stage, index) => {
              const complete = index <= currentIndex;
              return (
                <div key={stage} className="relative">
                  <div className="absolute top-2 left-0 h-px w-full bg-forest/15" />
                  <motion.div
                    className="absolute top-2 left-0 h-px origin-left bg-ember"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: complete ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: index * 0.12 }}
                    style={{ width: "100%" }}
                  />
                  <span
                    className={cn(
                      "relative z-10 grid size-4 place-items-center rounded-full border transition-colors duration-500",
                      complete
                        ? "border-ember bg-ember text-[#241007]"
                        : "border-forest/25 bg-sand",
                    )}
                  >
                    {complete && index < currentIndex ? (
                      <Check className="size-2.5" />
                    ) : null}
                  </span>
                  <p
                    className={cn(
                      "mt-5 text-[0.62rem] font-semibold tracking-[0.2em] uppercase",
                      complete ? "text-ember" : "text-forest/35",
                    )}
                  >
                    0{index + 1}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-[1.1rem] font-extrabold tracking-[-0.02em] uppercase",
                      complete ? "text-forest" : "text-forest/40",
                    )}
                  >
                    {stageLabelFor(stage)}
                  </p>
                  <p className="mt-2 max-w-[16rem] text-[0.82rem] leading-relaxed text-forest/55">
                    {stage === "listed"
                      ? "Surplus food described and published with its safe window."
                      : stage === "claimed"
                        ? "A volunteer accepted the route and is heading to the pickup."
                        : stage === "picked_up"
                          ? "Collected with insulated transport, cold chain verified."
                          : "Handed to the community kitchen and counted as impact."}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-sm border border-forest/15 bg-[#fffdf8] px-5 py-4">
              <Truck className="size-4 text-forest/50" />
              <p className="text-[0.82rem] text-forest/70">
                Delivery target: <strong className="text-forest">{listing.dropoff}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/rescue")}
              data-cursor="hover"
              className="text-[0.68rem] font-semibold tracking-[0.18em] text-forest/50 uppercase transition-colors hover:text-forest"
            >
              Find another rescue →
            </button>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="bg-ivory py-20">
          <div className="shell">
            <div className="flex items-end justify-between gap-6">
              <h2 className="display-md text-forest">Also waiting nearby</h2>
              <MagneticButton to="/rescue" variant="outline" size="sm">
                See all
              </MagneticButton>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <FoodCard
                  key={item.id}
                  listing={item}
                  index={index}
                  size={index === 0 ? "wide" : "compact"}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-ivory py-20">
          <div className="shell">
            <Panel label="Network status">
              <p className="text-[0.95rem] leading-relaxed text-forest/70">
                Every other listing is currently claimed or delivered. List your
                own surplus and it will appear here instantly.
              </p>
              <div className="mt-5">
                <MagneticButton to="/donate" size="sm">
                  Donate food
                </MagneticButton>
              </div>
            </Panel>
          </div>
        </section>
      )}
    </>
  );
}
