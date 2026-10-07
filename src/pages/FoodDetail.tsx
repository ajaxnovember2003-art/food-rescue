import { Fragment, useRef, useState } from "react";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router";
import { FoodImage } from "@/components/FoodImage";
import { photoFor } from "@/data/photos";
import { FoodCard } from "@/components/FoodCard";
import { Panel } from "@/components/PageHero";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { RevealImage } from "@/components/animations/RevealImage";
import { Reveal } from "@/components/animations/text";
import { EASE, gsap, sharedImageRect, useIsoLayoutEffect } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { UrgencyBadge } from "@/components/StatusBadge";
import { countdownLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { stageOrder } from "@/data/stages";
import { useDemo } from "@/store/demo";

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
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);
  // Read once, on mount: when the visitor arrived by tapping a card, the hero
  // grows out of that card's image box instead of just fading in.
  const [cameFromCard] = useState(
    () => sharedImageRect.current?.id === id,
  );

  const listing = listings.find((item) => item.id === id);
  const currentIndex = listing ? stageOrder.indexOf(listing.stage) : -1;

  // Shared element: clip the hero open from the card's rectangle. The box is
  // cleared only once the tween finishes, so a re-mounted effect can replay it.
  useIsoLayoutEffect(() => {
    const el = heroRef.current;
    const shared = sharedImageRect.current;
    if (!el || !shared || shared.id !== id || reduce) {
      sharedImageRect.current = null;
      return;
    }
    const target = el.getBoundingClientRect();
    if (!target.width || !target.height) {
      sharedImageRect.current = null;
      return;
    }
    const clamp = (value: number) => Math.max(0, value);
    const tween = gsap.fromTo(
      el,
      {
        clipPath: `inset(${clamp(((shared.rect.top - target.top) / target.height) * 100)}% ${clamp(((target.right - shared.rect.right) / target.width) * 100)}% ${clamp(((target.bottom - shared.rect.bottom) / target.height) * 100)}% ${clamp(((shared.rect.left - target.left) / target.width) * 100)}%)`,
        scale: 1.04,
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 0.9,
        ease: EASE,
        // Waits for the route veil to start lifting, so the flight lands in
        // view instead of behind the wipe.
        delay: 0.3,
        clearProps: "clipPath,transform",
        onComplete: () => {
          sharedImageRect.current = null;
        },
      },
    );
    return () => {
      tween.kill();
    };
  }, [id, reduce]);

  // The four stage rules draw themselves in on arrival and then track the
  // listing's progress. React writes the new state into every rule's inline
  // transform before this effect runs, so only the rules whose state actually
  // changed are tweened — running a from-zero tween over all of them would
  // visibly collapse the filled rules and refill them on every stage advance.
  const previousStageRef = useRef(-1);
  useIsoLayoutEffect(() => {
    const root = stagesRef.current;
    if (!root || reduce) {
      previousStageRef.current = currentIndex;
      return;
    }
    const bars = gsap.utils.toArray<HTMLElement>("[data-stage-bar]", root);
    const previous = previousStageRef.current;
    previousStageRef.current = currentIndex;
    bars.forEach((bar, index) => {
      const from = index <= previous ? 1 : 0;
      const to = index <= currentIndex ? 1 : 0;
      if (from === to) {
        gsap.set(bar, { scaleX: to, transformOrigin: "left center" });
        return;
      }
      gsap.fromTo(
        bar,
        { scaleX: from },
        {
          scaleX: to,
          transformOrigin: "left center",
          duration: 0.8,
          ease: EASE,
          delay: Math.max(0, (index - previous - 1) * 0.12),
        },
      );
    });
    return () => {
      gsap.killTweensOf(bars);
    };
  }, [currentIndex, reduce]);

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
                reveal={!cameFromCard}
              >
                <div ref={heroRef} className="h-full w-full">
                  <FoodImage
                    photo={photoFor(listing.id, listing.category)}
                    category={listing.category}
                    hue={listing.hue}
                    seed={listing.servings}
                    eager
                    sizes="(max-width: 1024px) 92vw, 45vw"
                  />
                </div>
              </RevealImage>

              <div className="mt-5 flex flex-wrap gap-x-9 gap-y-4 border-y border-forest/12 py-4">
                {[
                  { label: "Storage", value: listing.storage },
                  { label: "Quantity", value: listing.quantityLabel },
                  { label: "Distance", value: `${listing.distanceKm} km` },
                  {
                    label: "Safe for",
                    value: countdownLabel(listing.minutesLeft),
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="label-xs text-forest/40">{item.label}</p>
                    <p className="mt-1.5 text-[0.85rem] font-semibold text-forest">
                      {item.value}
                    </p>
                  </div>
                ))}
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

              <dl className="mt-8 border-t border-forest/12">
                {[
                  { term: "Donor", detail: listing.donorName },
                  {
                    term: "Pickup",
                    detail: `${listing.pickupArea} · ${listing.pickupWindow}`,
                  },
                  { term: "Delivery", detail: listing.dropoff },
                  {
                    term: "Servings",
                    detail: `${listing.servings} · ${listing.weightKg} kg`,
                  },
                ].map((row) => (
                  <div
                    key={row.term}
                    className="flex flex-col gap-1 border-b border-forest/12 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <dt className="label-xs shrink-0 text-forest/40 sm:w-28">
                      {row.term}
                    </dt>
                    <dd className="text-[0.92rem] font-medium text-forest sm:text-right">
                      {row.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-9">
                {isDelivered ? (
                  <Reveal className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-forest bg-forest px-6 py-5 text-ivory">
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
                  </Reveal>
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

          {/* the physical route: donor → volunteer → destination, lighting up
              as the listing advances */}
          <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {[
              {
                label: "Donor",
                value: listing.donorName,
                sub: listing.pickupArea,
                reached: true,
              },
              {
                label: "Volunteer",
                value: "You · on the route",
                sub: `Pickup window ${listing.pickupWindow}`,
                reached: currentIndex >= 1,
              },
              {
                label: "Destination",
                value: listing.dropoff,
                sub: isDelivered ? "Delivered and counted" : "Awaiting delivery",
                reached: isDelivered,
              },
            ].map((stop, index) => (
              <Fragment key={stop.label}>
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="shrink-0 self-center rotate-90 text-[0.95rem] text-forest/35 sm:rotate-0"
                  >
                    →
                  </span>
                ) : null}
                <div
                  className={cn(
                    "min-w-0 flex-1 border-t-2 pt-3 transition-colors duration-700",
                    stop.reached ? "border-ember" : "border-forest/15",
                  )}
                >
                  <p
                    className={cn(
                      "label-xs transition-colors duration-500",
                      stop.reached ? "text-ember" : "text-forest/40",
                    )}
                  >
                    {stop.label}
                  </p>
                  <p className="mt-1.5 truncate text-[0.92rem] font-semibold text-forest">
                    {stop.value}
                  </p>
                  <p className="mt-0.5 text-[0.76rem] text-forest/55">
                    {stop.sub}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>

          <div
            ref={stagesRef}
            className="mt-12 grid gap-0 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stageOrder.map((stage, index) => {
              const complete = index <= currentIndex;
              return (
                <div key={stage} className="relative pb-8 pr-5 sm:pr-7">
                  <div className="absolute top-2 left-0 h-px w-full bg-forest/15" />
                  <div
                    data-stage-bar
                    className="absolute top-2 left-0 h-px origin-left bg-ember"
                    style={{
                      width: "100%",
                      transform: `scaleX(${complete ? 1 : 0})`,
                    }}
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
