import { MapPin, ShieldCheck, Timer } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FoodImage } from "@/components/FoodImage";
import { photoFor } from "@/data/photos";
import { UrgencyBadge } from "@/components/StatusBadge";
import { EASE, gsap, sharedImageRect, useIsoLayoutEffect } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { countdownLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FoodListing } from "@/types";

export type FoodCardSize = "feature" | "tall" | "wide" | "compact";

const aspect: Record<FoodCardSize, string> = {
  feature: "aspect-[4/3] sm:aspect-[16/10]",
  tall: "aspect-[4/5]",
  wide: "aspect-[16/9]",
  compact: "aspect-[5/4]",
};

const titleSize: Record<FoodCardSize, string> = {
  feature: "text-[clamp(1.4rem,2.6vw,2.3rem)]",
  tall: "text-[clamp(1.25rem,2vw,1.7rem)]",
  wide: "text-[clamp(1.2rem,1.9vw,1.65rem)]",
  compact: "text-[1.05rem]",
};

/**
 * Listings are presented like editorial spreads rather than product tiles:
 * a numbered frame, a large drawn still life, and metadata that unfolds on
 * hover instead of shouting all at once.
 */
export function FoodCard({
  listing,
  size = "compact",
  index,
  className,
}: {
  listing: FoodListing;
  size?: FoodCardSize;
  index?: number;
  className?: string;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<gsap.core.Timeline | null>(null);
  const reduce = useReducedMotion();

  // Entrance: the card lifts into place as it scrolls in, once.
  useIsoLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || reduce) return;
    const ctx = gsap.context(() => {
      gsap.from(card, {
        opacity: 0,
        y: 22,
        duration: 0.75,
        ease: EASE,
        delay: (index ?? 0) * 0.05,
        scrollTrigger: { trigger: card, start: "top 92%", once: true },
      });
    }, card);
    return () => ctx.revert();
  }, [index, reduce]);

  // Hover: one paused timeline the pointer plays and reverses.
  useIsoLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || reduce) return;
    const ctx = gsap.context(() => {
      hoverRef.current = gsap
        .timeline({ paused: true, defaults: { ease: EASE } })
        .to(card, { y: -6, duration: 0.45, overwrite: "auto" }, 0)
        .to("[data-card-image]", { scale: 1.06, duration: 0.7 }, 0)
        .to(
          "[data-card-area]",
          { opacity: 0.45, y: -2, duration: 0.45 },
          0,
        )
        .to("[data-card-cta]", { opacity: 1, x: 0, duration: 0.45 }, 0)
        .to("[data-card-rule]", { width: 26, duration: 0.5 }, 0);
    }, card);
    return () => {
      hoverRef.current = null;
      ctx.revert();
    };
  }, [reduce]);

  useIsoLayoutEffect(() => {
    const tl = hoverRef.current;
    if (!tl) return;
    if (hovered) tl.timeScale(1).play();
    else tl.timeScale(1.6).reverse();
  }, [hovered]);

  const open = () => {
    const frame = frameRef.current;
    if (frame) {
      sharedImageRect.current = {
        rect: frame.getBoundingClientRect(),
        id: listing.id,
      };
    }
    navigate(`/rescue/${listing.id}`);
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      data-cursor="label"
      data-cursor-label="RESCUE"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-sm border border-forest/12 bg-[#fffdf8] transition-colors duration-500 hover:border-forest/30",
        className,
      )}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`${listing.name} from ${listing.donorName}, ${listing.servings} servings, ${countdownLabel(listing.minutesLeft)}`}
    >
      <div ref={frameRef} className={cn("relative overflow-hidden", aspect[size])}>
        <div data-card-image className="absolute inset-0">
          <FoodImage
            photo={photoFor(listing.id, listing.category)}
            category={listing.category}
            hue={listing.hue}
            seed={listing.servings}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 40vw"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,23,19,0.36) 0%, rgba(5,23,19,0) 42%, rgba(5,23,19,0.62) 100%)",
          }}
        />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <UrgencyBadge minutes={listing.minutesLeft} />
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-ivory/25 bg-forest-deep/45 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-ivory/90 uppercase backdrop-blur-sm">
          <MapPin className="size-3" />
          {listing.distanceKm} km
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[0.6rem] font-semibold tracking-[0.16em] text-ivory/85 uppercase">
          <span>{listing.quantityLabel}</span>
          <span className="h-px w-6 bg-ivory/40" />
          <span className="flex items-center gap-1">
            <Timer className="size-3" />
            {countdownLabel(listing.minutesLeft)}
          </span>
        </div>

        {index !== undefined ? (
          <span className="absolute right-3 bottom-3 text-[0.6rem] font-semibold tracking-[0.16em] text-ivory/60 uppercase">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3
          className={cn(
            "font-extrabold tracking-[-0.03em] text-forest uppercase",
            titleSize[size],
          )}
        >
          {listing.name}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.72rem] text-forest/60">
          <span className="flex items-center gap-1.5 font-medium text-forest/75">
            {listing.donorName}
            {listing.verified ? (
              <ShieldCheck className="size-3.5 text-forest/50" />
            ) : null}
          </span>
          <span>{listing.servings} servings</span>
          <span>{listing.weightKg} kg</span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-forest/10 pt-3">
            <span
              data-card-area
              className="text-[0.62rem] font-semibold tracking-[0.18em] text-forest/50 uppercase"
            >
              {listing.pickupArea}
            </span>
            {/* The hidden rest state only exists while motion is allowed: the
                tween that reveals it is skipped under reduced motion, so
                hiding it would leave this label permanently invisible. */}
            <span
              data-card-cta
              className="flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.18em] text-forest uppercase"
              style={
                reduce
                  ? undefined
                  : { opacity: 0, transform: "translateX(10px)" }
              }
            >
              Rescue
              <span
                data-card-rule
                className="block h-px bg-ember"
                style={{ width: reduce ? 24 : 10 }}
              />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
