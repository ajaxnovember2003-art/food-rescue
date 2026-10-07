import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { FoodImage } from "@/components/FoodImage";
import { heroPhoto } from "@/data/photos";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { RevealImage } from "@/components/animations/RevealImage";
import { EASE, Reveal } from "@/components/animations/text";
import { useRise } from "@/hooks/use-rise";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const steps = [
  { index: "01", label: "Describe the food" },
  { index: "02", label: "Set the safe window" },
  { index: "03", label: "Confirm pickup" },
];

/**
 * A single large visual with a magnetic call to action. The whole band reacts
 * to hover — the artwork pushes in slightly and the copy shifts a few pixels —
 * which is the kind of detail that makes a plain CTA feel expensive.
 */
export function DonateBand() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useRise(headingRef, { stagger: 0.08, yPercent: 112, start: "top 88%" });

  // Hover pushes the artwork in — a gsap tween instead of a motion value.
  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    gsap.to(image, { scale: hovered ? 1.04 : 1, duration: 1.2, ease: EASE });
  }, [hovered]);

  return (
    <section className="relative bg-sand py-24 md:py-32">
      <div className="shell">
        <div
          ref={ref}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14"
        >
          <div className="lg:col-span-6">
            <span className="label-xs text-forest/45">08 — Give it again</span>
            <h2 ref={headingRef} className="display-lg mt-6 text-forest">
              <span className="block overflow-hidden py-[0.02em]">
                <span data-rise className="block">
                  Have extra food?
                </span>
              </span>
              <span className="block overflow-hidden py-[0.02em]">
                <span data-rise className="block text-ember">
                  Give it a second life.
                </span>
              </span>
            </h2>

            <Reveal delay={0.15}>
              <p className="mt-7 max-w-md text-[1rem] leading-relaxed text-forest/70">
                Listing surplus takes about forty seconds. Tell us what it is,
                how long it stays safe and where to collect it — the network
                handles the rest, including the volunteer who comes to your door.
              </p>
            </Reveal>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton to="/donate" cursorLabel="DONATE">
                Donate food
              </MagneticButton>
              <Link
                to="/rescue"
                data-cursor="hover"
                className="group inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-forest uppercase"
              >
                <span className="link-underline">Or rescue instead</span>
                <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-forest/12 pt-6">
              {steps.map((step) => (
                <li key={step.index} className="flex items-baseline gap-3">
                  <span className="label-xs text-ember">{step.index}</span>
                  <span className="text-[0.85rem] font-medium text-forest/75">
                    {step.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <RevealImage
              className="aspect-[4/5] w-full rounded-sm sm:aspect-[16/12] lg:aspect-[4/5]"
              parallax={26}
            >
              <div ref={imageRef} className="h-full w-full">
                <FoodImage
                  photo={heroPhoto}
                  category="meals"
                  hue={150}
                  seed={7}
                  tint={0.12}
                  sizes="(max-width: 1024px) 92vw, 45vw"
                />
              </div>
            </RevealImage>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[0.72rem] text-forest/55">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ember" />
                Collected tonight from Riverside
              </span>
              <span
                className={cn(
                  "transition-colors duration-500",
                  hovered ? "text-forest" : "text-forest/45",
                )}
              >
                {heroPhoto.credit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
