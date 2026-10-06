import { useState } from "react";
import { FoodArtwork } from "@/components/FoodArtwork";
import { cn } from "@/lib/utils";
import type { FoodPhoto } from "@/data/photos";
import type { FoodCategory } from "@/types";

/**
 * Real photography with a consistent editorial grade.
 *
 * The drawn artwork sits underneath as a permanent fallback, so a slow or
 * blocked network degrades to the vector still life instead of a broken image.
 * The photo fades in over it and a soft forest tint ties every frame — whatever
 * its original lighting — into the same palette.
 */
export function FoodImage({
  photo,
  category,
  hue = 150,
  seed = 1,
  className,
  eager = false,
  tint = 0.16,
  sizes,
}: {
  photo: FoodPhoto;
  category: FoodCategory;
  hue?: number;
  seed?: number;
  className?: string;
  eager?: boolean;
  /** Strength of the unifying tint overlay, 0 – 1. */
  tint?: number;
  sizes?: string;
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "failed">(
    "loading",
  );

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-forest-deep",
        className,
      )}
    >
      <FoodArtwork
        category={category}
        hue={hue}
        seed={seed}
        animateContents={false}
        className="absolute inset-0"
      />

      {status !== "failed" ? (
        <img
          src={photo.src}
          alt={photo.alt}
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("failed")}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
            status === "ready" ? "opacity-100" : "opacity-0",
          )}
          style={{ filter: "contrast(1.06) saturate(0.95) brightness(0.97)" }}
        />
      ) : null}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundColor: `rgba(11, 43, 34, ${tint})`,
          mixBlendMode: "multiply",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          background:
            "linear-gradient(160deg, rgba(226,112,58,0.35) 0%, rgba(226,112,58,0) 55%)",
        }}
      />
    </div>
  );
}
