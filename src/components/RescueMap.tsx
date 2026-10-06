import { ArrowUpRight, Bike, MapPin, Store, Users } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { countdownLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { donors, listings } from "@/data/mock";
import type { FoodListing } from "@/types";

const legend = [
  { label: "Donors", icon: Store, tone: "bg-ivory" },
  { label: "Food live", icon: MapPin, tone: "bg-ember" },
  { label: "Volunteers", icon: Bike, tone: "bg-sage" },
  { label: "Community", icon: Users, tone: "bg-ivory/60" },
];

const volunteers = [
  { id: "v1", x: 38, y: 44, name: "Meera I." },
  { id: "v2", x: 66, y: 30, name: "Daniel O." },
  { id: "v3", x: 52, y: 82, name: "Priya R." },
];

/**
 * A prototype visualisation, not a live map: streets, districts and rescue
 * markers are drawn in SVG so the map belongs to the same visual language as
 * the rest of the site. Selecting a marker updates the panel and can take you
 * straight into the listing.
 */
export function RescueMap({ className }: { className?: string }) {
  const [selected, setSelected] = useState<FoodListing | null>(listings[0]);
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const mapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);

  const activeDonor = donors.find((donor) => donor.id === selected?.donorId);

  // The rescue routes activate as the map scrolls in: the dashes run along
  // each road while it fades up.
  useIsoLayoutEffect(() => {
    const root = mapRef.current;
    if (!root || reduce) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-map-route]", {
        opacity: 0,
        strokeDashoffset: 84,
        duration: 1.6,
        ease: EASE,
        stagger: 0.15,
        scrollTrigger: { trigger: root, start: "top 90%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  // The read-out crossfades whenever a different marker is chosen.
  useIsoLayoutEffect(() => {
    const el = panelRef.current;
    if (!el || reduce) return;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: EASE },
    );
    return () => {
      tween.kill();
    };
  }, [selected?.id, reduce]);

  // The active marker keeps pulsing outward.
  useIsoLayoutEffect(() => {
    const el = pulseRef.current;
    if (!el || reduce) return;
    const tween = gsap.fromTo(
      el,
      { scale: 0.4, opacity: 0.9 },
      {
        scale: 1.5,
        opacity: 0,
        duration: 1.6,
        repeat: -1,
        ease: "power2.out",
      },
    );
    return () => {
      tween.kill();
    };
  }, [selected?.id, reduce]);

  return (
    <div
      ref={mapRef}
      className={cn(
        "relative overflow-hidden rounded-sm border border-ivory/12 bg-forest-deep",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
        <svg
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <radialGradient id="map-glow" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0%" stopColor="#e2703a" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#e2703a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="450" fill="#051713" />
          <rect width="800" height="450" fill="url(#map-glow)" />

          {/* districts */}
          <g stroke="rgba(246,241,230,0.14)" fill="none">
            <path d="M0 300 Q 200 260 420 320 T 800 280" />
            <path d="M120 0 Q 150 160 60 300" />
            <path d="M0 120 H 800" />
            <path d="M0 210 H 800" />
            <path d="M240 0 V 450" />
            <path d="M420 0 V 450" />
            <path d="M600 0 V 450" />
            <path d="M500 60 L 800 200" />
            <path d="M300 420 L 620 100" />
          </g>

          {/* blocks */}
          <g fill="rgba(246,241,230,0.045)">
            <rect x="60" y="140" width="150" height="52" rx="3" />
            <rect x="270" y="230" width="120" height="60" rx="3" />
            <rect x="450" y="130" width="120" height="58" rx="3" />
            <rect x="620" y="230" width="140" height="66" rx="3" />
            <rect x="150" y="330" width="150" height="70" rx="3" />
            <rect x="640" y="60" width="120" height="52" rx="3" />
          </g>

          {/* river */}
          <path
            d="M-20 380 Q 180 330 300 380 T 560 350 T 820 400"
            fill="none"
            stroke="rgba(169,183,163,0.22)"
            strokeWidth="14"
          />

          {/* rescue routes from the centre out to kitchens */}
          {[
            "M 400 225 Q 300 180 240 130",
            "M 400 225 Q 520 200 640 150",
            "M 400 225 Q 320 300 260 350",
            "M 400 225 Q 520 300 660 320",
          ].map((route) => (
            <path
              data-map-route
              key={route}
              d={route}
              fill="none"
              stroke="rgba(226,112,58,0.5)"
              strokeWidth="1.2"
              strokeDasharray="5 7"
            />
          ))}

          <circle
            cx="400"
            cy="225"
            r="46"
            fill="none"
            stroke="rgba(226,112,58,0.35)"
          />
          <circle cx="400" cy="225" r="5" fill="#e2703a" />
        </svg>

        {/* listing markers */}
        {listings.slice(0, 9).map((listing) => {
          const isActive = selected?.id === listing.id;
          return (
            <button
              key={listing.id}
              type="button"
              onClick={() => setSelected(listing)}
              aria-label={`${listing.name} · ${listing.pickupArea}`}
              data-cursor="hover"
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${listing.coords.x}%`, top: `${listing.coords.y}%` }}
            >
              <span className="relative grid size-9 place-items-center">
                {isActive ? (
                  <span
                    ref={pulseRef}
                    aria-hidden="true"
                    className="absolute size-9 rounded-full border border-ember"
                  />
                ) : null}
                <span
                  className={cn(
                    "block rounded-full border transition-all duration-500",
                    isActive
                      ? "size-3 border-ember bg-ember"
                      : "size-2.5 border-ivory/60 bg-ivory/25 hover:bg-ivory/60",
                  )}
                />
              </span>
            </button>
          );
        })}

        {/* volunteer markers */}
        {volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${volunteer.x}%`, top: `${volunteer.y}%` }}
          >
            <span className="grid size-6 place-items-center rounded-full border border-sage/50 bg-forest-deep/70">
              <Bike className="size-3 text-sage" />
            </span>
          </div>
        ))}

        {/* panel */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-ivory/15 bg-forest-deep/70 px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.18em] text-ivory uppercase backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-ember" />
              {listings.filter((l) => l.stage === "listed").length} rescues nearby
            </span>
            <span className="rounded-full border border-ivory/15 bg-forest-deep/60 px-3 py-1.5 text-[0.6rem] font-semibold tracking-[0.16em] text-ivory/55 uppercase backdrop-blur-md">
              Prototype visualisation
            </span>
          </div>

          <div className="pointer-events-auto flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xs rounded-sm border border-ivory/15 bg-forest-deep/80 p-4 backdrop-blur-md">
              <div ref={panelRef}>
                  <p className="label-xs text-ivory/45">
                    {activeDonor?.kind ?? "Donor"} · {selected?.pickupArea}
                  </p>
                  <p className="mt-2 text-[1.05rem] font-extrabold tracking-[-0.02em] text-ivory uppercase">
                    {selected?.name}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] text-ivory/60">
                    <span>{selected?.servings} servings</span>
                    <span>{selected?.distanceKm} km</span>
                    <span className="text-ember">
                      {selected ? countdownLabel(selected.minutesLeft) : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      selected ? navigate(`/rescue/${selected.id}`) : undefined
                    }
                    data-cursor="hover"
                    className="mt-4 inline-flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.18em] text-ivory uppercase transition-colors hover:text-ember"
                  >
                    Open listing
                    <ArrowUpRight className="size-3.5" />
                  </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-sm border border-ivory/12 bg-forest-deep/55 px-4 py-3 backdrop-blur-md">
              {legend.map((item) => {
                const Icon = item.icon;
                return (
                  <span
                    key={item.label}
                    className="flex items-center gap-2 text-[0.6rem] font-semibold tracking-[0.16em] text-ivory/55 uppercase"
                  >
                    <Icon className="size-3" />
                    {item.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
