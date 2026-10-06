import { motion, type TargetAndTransition } from "framer-motion";
import { MapPin, ShieldCheck, Timer } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { FoodImage } from "@/components/FoodImage";
import { photoFor } from "@/data/photos";
import { UrgencyBadge } from "@/components/StatusBadge";
import { EASE } from "@/components/animations/text";
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
  exit,
}: {
  listing: FoodListing;
  size?: FoodCardSize;
  index?: number;
  className?: string;
  exit?: TargetAndTransition;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      layout
      layoutId={`food-card-${listing.id}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      exit={exit}
      transition={{ duration: 0.75, ease: EASE, delay: (index ?? 0) * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.45, ease: EASE, delay: 0 } }}
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
      onClick={() => navigate(`/rescue/${listing.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/rescue/${listing.id}`);
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`${listing.name} from ${listing.donorName}, ${listing.servings} servings, ${countdownLabel(listing.minutesLeft)}`}
    >
      <div className={cn("relative overflow-hidden", aspect[size])}>
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <FoodImage
            photo={photoFor(listing.id, listing.category)}
            category={listing.category}
            hue={listing.hue}
            seed={listing.servings}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 40vw"
          />
        </motion.div>

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
            <motion.span
              className="text-[0.62rem] font-semibold tracking-[0.18em] text-forest/50 uppercase"
              initial={false}
              animate={{ opacity: hovered ? 0.45 : 1, y: hovered ? -2 : 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {listing.pickupArea}
            </motion.span>
            <motion.span
              className="flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.18em] text-forest uppercase"
              initial={false}
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              Rescue
              <motion.span
                className="block h-px bg-ember"
                initial={false}
                animate={{ width: hovered ? 26 : 10 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </motion.span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
