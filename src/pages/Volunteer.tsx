import { useRef } from "react";
import {
  Bike,
  Check,
  Clock,
  MapPin,
  Store,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { FoodImage } from "@/components/FoodImage";
import { photoFor } from "@/data/photos";
import { PageHero, Panel } from "@/components/PageHero";
import { ImpactCounter } from "@/components/animations/ImpactCounter";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Reveal } from "@/components/animations/text";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { StageBadge, UrgencyBadge } from "@/components/StatusBadge";
import { countdownLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { stageOrder } from "@/data/stages";
import { useDemo } from "@/store/demo";

const actions = [
  {
    stage: "claimed" as const,
    label: "Accept pickup",
    done: "Pickup accepted",
    icon: Check,
  },
  {
    stage: "picked_up" as const,
    label: "Mark as picked up",
    done: "Picked up",
    icon: Store,
  },
  {
    stage: "delivered" as const,
    label: "Mark as delivered",
    done: "Delivered",
    icon: Truck,
  },
];

export default function Volunteer() {
  const {
    listings,
    activeMission,
    missionId,
    setMission,
    advanceStage,
    personal,
    lastDelta,
  } = useDemo();

  const mission = activeMission;
  const openListings = listings.filter((item) => item.stage !== "delivered");
  const currentIndex = mission ? stageOrder.indexOf(mission.stage) : -1;
  const barRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const stageProgress = mission
    ? mission.stage === "listed"
      ? 0
      : currentIndex / (stageOrder.length - 1)
    : 0;

  // The mission rule fills as each stage completes.
  useIsoLayoutEffect(() => {
    const el = barRef.current;
    if (!el || !mission || reduce) return;
    const tween = gsap.to(el, {
      scaleX: stageProgress,
      transformOrigin: "left center",
      duration: 0.9,
      ease: EASE,
    });
    return () => {
      tween.kill();
    };
  }, [mission, stageProgress, reduce]);

  const handle = (stage: "claimed" | "picked_up" | "delivered") => {
    if (!mission) return;
    advanceStage(mission.id, stage);
    const copy = {
      claimed: ["Pickup accepted", "You are the rescue volunteer for this listing."],
      picked_up: ["Pickup confirmed", "Cold chain verified at the donor door."],
      delivered: [
        "Delivery confirmed",
        "Impact updated — the rescued meals are counted.",
      ],
    }[stage];
    toast[stage === "delivered" ? "success" : "info"](copy[0], {
      description: copy[1],
    });
  };

  return (
    <>
      <PageHero
        index="—"
        label="Volunteer"
        title={["Rescue is just", "a pickup away."]}
        lede="Accept a mission, collect inside the safe window and hand it to a community kitchen. Three taps from surplus to served — and the impact counters move with you."
      />

      <section className="bg-ivory pb-28">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {mission ? (
              <div className="overflow-hidden rounded-sm border border-forest/12 bg-[#fffdf8]">
                <div className="relative aspect-[16/9]">
                  <FoodImage
                    photo={photoFor(mission.id, mission.category)}
                    category={mission.category}
                    hue={mission.hue}
                    seed={mission.servings}
                    eager
                    sizes="(max-width: 1024px) 92vw, 55vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 p-5">
                    <UrgencyBadge minutes={mission.minutesLeft} />
                    <StageBadge
                      stage={mission.stage}
                      label={
                        {
                          listed: "Waiting",
                          claimed: "Claimed",
                          picked_up: "In transit",
                          delivered: "Delivered",
                        }[mission.stage]
                      }
                    />
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <span className="label-xs text-forest/45">
                    Current mission · {mission.postedAt}
                  </span>
                  <h2 className="mt-4 text-[clamp(1.5rem,2.8vw,2.2rem)] font-extrabold tracking-[-0.035em] text-forest uppercase">
                    {mission.name}
                  </h2>

                  <div className="mt-6 grid gap-px overflow-hidden rounded-sm border border-forest/12 bg-forest/12 sm:grid-cols-2">
                    {[
                      {
                        icon: Store,
                        term: "Pickup",
                        detail: `${mission.donorName} · ${mission.pickupArea}`,
                      },
                      {
                        icon: UtensilsCrossed,
                        term: "Delivery",
                        detail: mission.dropoff,
                      },
                      {
                        icon: Bike,
                        term: "Route",
                        detail: `${mission.distanceKm} km · ~14 min ride`,
                      },
                      {
                        icon: Clock,
                        term: "Safe window",
                        detail: `${mission.pickupWindow} · until ${mission.safeUntil}`,
                      },
                    ].map((row) => {
                      const Icon = row.icon;
                      return (
                        <div key={row.term} className="bg-[#fffdf8] px-5 py-5">
                          <span className="flex items-center gap-2">
                            <Icon className="size-3.5 text-forest/40" />
                            <span className="label-xs text-forest/40">
                              {row.term}
                            </span>
                          </span>
                          <p className="mt-2 text-[0.88rem] font-medium text-forest">
                            {row.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8">
                    <div className="flex items-center justify-between gap-4">
                      <span className="label-xs text-forest/45">
                        Mission progress
                      </span>
                      <span className="text-[0.7rem] text-forest/45">
                        {countdownLabel(mission.minutesLeft)} to collect
                      </span>
                    </div>

                    <div className="relative mt-5">
                      <div className="absolute top-2 left-0 h-px w-full bg-forest/15" />
                      <div
                        ref={barRef}
                        className="absolute top-2 left-0 h-px origin-left bg-ember"
                        style={{
                          width: "100%",
                          transform: `scaleX(${stageProgress})`,
                        }}
                      />
                      <div className="relative grid grid-cols-4 gap-4">
                        {stageOrder.map((stage, index) => (
                          <div key={stage}>
                            <span
                              className={cn(
                                "grid size-4 place-items-center rounded-full border transition-colors duration-500",
                                index <= currentIndex
                                  ? "border-ember bg-ember text-[#241007]"
                                  : "border-forest/25 bg-ivory",
                              )}
                            >
                              {index < currentIndex ? (
                                <Check className="size-2.5" />
                              ) : null}
                            </span>
                            <p
                              className={cn(
                                "mt-3 text-[0.6rem] font-semibold tracking-[0.16em] uppercase",
                                index <= currentIndex
                                  ? "text-forest"
                                  : "text-forest/35",
                              )}
                            >
                              {stage === "picked_up"
                                ? "Picked up"
                                : stage.charAt(0).toUpperCase() + stage.slice(1)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    {actions.map((action, index) => {
                      const actionIndex = stageOrder.indexOf(action.stage);
                      const unlocked =
                        currentIndex === actionIndex - 1 &&
                        mission.stage !== "delivered";
                      const done = currentIndex >= actionIndex;
                      if (done && action.stage !== "delivered") return null;
                      return (
                        <MagneticButton
                          key={action.stage}
                          size="sm"
                          variant={index === 0 ? "primary" : "outline"}
                          disabled={!unlocked}
                          cursorLabel={unlocked ? "GO" : undefined}
                          onClick={() => handle(action.stage)}
                        >
                          {done ? action.done : action.label}
                        </MagneticButton>
                      );
                    })}

                    {mission.stage === "delivered" ? (
                      <Reveal
                        y={10}
                        className="w-full rounded-sm border border-forest bg-forest px-6 py-5 text-ivory"
                      >
                          <p className="text-[1rem] font-extrabold tracking-[-0.02em] uppercase">
                            Rescue complete
                          </p>
                          <p className="mt-2 text-[0.85rem] text-ivory/65">
                            {lastDelta
                              ? `+${lastDelta.meals} meals and +${lastDelta.kg} kg added to the network impact.`
                              : "The rescued meals are now counted in the network impact."}
                          </p>
                          <div className="mt-5 flex flex-wrap gap-3">
                            <MagneticButton to="/impact" variant="ember" size="sm">
                              See updated impact
                            </MagneticButton>
                            <MagneticButton
                              to="/rescue"
                              variant="outline"
                              size="sm"
                              className="border-ivory/30 text-ivory hover:border-ivory/70"
                            >
                              Take another rescue
                            </MagneticButton>
                          </div>
                        </Reveal>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <Panel label="No mission selected">
                <p className="text-[0.95rem] leading-relaxed text-forest/70">
                  Every listing has been delivered. Populate the demo data from
                  the footer controls or list surplus food to start a new rescue.
                </p>
                <div className="mt-5 flex gap-3">
                  <MagneticButton to="/donate" size="sm">
                    Donate food
                  </MagneticButton>
                  <MagneticButton to="/rescue" variant="outline" size="sm">
                    Browse marketplace
                  </MagneticButton>
                </div>
              </Panel>
            )}
          </div>

          <div className="space-y-6 lg:col-span-5">
            <Panel label="Choose a mission">
              <ul className="space-y-3">
                {openListings.map((listing) => {
                  const active = listing.id === missionId;
                  return (
                    <li key={listing.id}>
                      <button
                        type="button"
                        onClick={() => setMission(listing.id)}
                        data-cursor="hover"
                        className={cn(
                          "flex w-full items-center justify-between gap-4 rounded-sm border px-4 py-3 text-left transition-colors duration-300",
                          active
                            ? "border-forest bg-forest/5"
                            : "border-forest/12 hover:border-forest/30",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[0.88rem] font-semibold text-forest">
                            {listing.name}
                          </span>
                          <span className="mt-1 flex items-center gap-2 text-[0.72rem] text-forest/55">
                            <MapPin className="size-3" />
                            {listing.pickupArea} · {listing.distanceKm} km
                          </span>
                        </span>
                        <span className="shrink-0 text-[0.68rem] font-semibold tracking-[0.12em] text-ember uppercase">
                          {countdownLabel(listing.minutesLeft)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel label="Your rescue record">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[1.7rem] leading-none font-extrabold tracking-[-0.04em] text-forest">
                    <ImpactCounter value={personal.mealsRescued} />
                  </p>
                  <p className="label-xs mt-2 text-forest/45">Meals rescued</p>
                </div>
                <div>
                  <p className="text-[1.7rem] leading-none font-extrabold tracking-[-0.04em] text-forest">
                    <ImpactCounter value={personal.foodDivertedKg} />
                  </p>
                  <p className="label-xs mt-2 text-forest/45">Kg diverted</p>
                </div>
                <div>
                  <p className="text-[1.7rem] leading-none font-extrabold tracking-[-0.04em] text-forest">
                    <ImpactCounter value={personal.deliveries} />
                  </p>
                  <p className="label-xs mt-2 text-forest/45">Deliveries</p>
                </div>
                <div>
                  <p className="text-[1.7rem] leading-none font-extrabold tracking-[-0.04em] text-forest">
                    <ImpactCounter value={personal.impactPoints} />
                  </p>
                  <p className="label-xs mt-2 text-forest/45">Impact points</p>
                </div>
              </div>
              <p className="mt-6 border-t border-forest/12 pt-4 text-[0.78rem] leading-relaxed text-forest/55">
                Points are awarded on delivered rescues only — accepting a pickup
                alone does not score.
              </p>
            </Panel>

            <Panel label="Volunteer briefing">
              <ul className="space-y-4 text-[0.85rem] leading-relaxed text-forest/70">
                {[
                  "Arrive within the safe window — if it has passed, report it in the app.",
                  "Check the seal and temperature at the door before loading.",
                  "Use insulated bags for anything hot or refrigerated.",
                  "Scan at the kitchen door to close the rescue and record impact.",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" />
                    {line}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </section>
    </>
  );
}
