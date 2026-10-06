import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FoodArtwork } from "@/components/FoodArtwork";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { RevealImage } from "@/components/animations/RevealImage";
import { EASE, Reveal } from "@/components/animations/text";
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
            <h2 className="display-lg mt-6 text-forest">
              <span className="block overflow-hidden py-[0.02em]">
                <motion.span
                  className="block"
                  initial={{ y: "112%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1.1, ease: EASE }}
                >
                  Have extra food?
                </motion.span>
              </span>
              <span className="block overflow-hidden py-[0.02em]">
                <motion.span
                  className="block text-ember"
                  initial={{ y: "112%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
                >
                  Give it a second life.
                </motion.span>
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
              <a
                href="/rescue"
                data-cursor="hover"
                className="group inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-forest uppercase"
              >
                <span className="link-underline">Or rescue instead</span>
                <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>

            <ul className="mt-12 grid gap-px overflow-hidden rounded-sm border border-forest/12 bg-forest/12 sm:grid-cols-3">
              {steps.map((step) => (
                <li key={step.index} className="bg-sand px-4 py-5">
                  <span className="label-xs text-ember">{step.index}</span>
                  <span className="mt-2 block text-[0.85rem] font-medium text-forest/75">
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
              <motion.div
                className="h-full w-full"
                animate={{ scale: hovered ? 1.04 : 1 }}
                transition={{ duration: 1.2, ease: EASE }}
              >
                <FoodArtwork category="meals" hue={150} seed={7} />
              </motion.div>
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
                Image: Freshly prepared meal trays
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
