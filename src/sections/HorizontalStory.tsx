import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { FoodImage } from "@/components/FoodImage";
import { photoAt, type FoodPhoto } from "@/data/photos";
import type { FoodCategory } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const chapters: Array<{
  id: string;
  index: string;
  title: string;
  copy: string;
  stat: string;
  category: FoodCategory;
  hue: number;
  photo: FoodPhoto;
}> = [
  {
    id: "surplus",
    index: "01",
    title: "Surplus",
    copy: "A kitchen finishes service with six trays it will never sell. It takes forty seconds to list them.",
    stat: "40 sec to list",
    category: "meals",
    hue: 152,
    photo: photoAt("meals", 0),
  },
  {
    id: "match",
    index: "02",
    title: "Match",
    copy: "The network compares safe windows, distance and capacity, then proposes the kitchen that can serve it today.",
    stat: "24 min to match",
    category: "bakery",
    hue: 34,
    photo: photoAt("bakery", 0),
  },
  {
    id: "rescue",
    index: "03",
    title: "Rescue",
    copy: "A volunteer two streets away accepts the pickup, arrives with insulated bags and confirms the cold chain.",
    stat: "14 min to accept",
    category: "vegetables",
    hue: 118,
    photo: photoAt("vegetables", 0),
  },
  {
    id: "deliver",
    index: "04",
    title: "Deliver",
    copy: "The drop-off is scanned at the door. Nothing is stored overnight — the food is served the same day.",
    stat: "Same-day service",
    category: "fruits",
    hue: 62,
    photo: photoAt("fruits", 1),
  },
  {
    id: "impact",
    index: "05",
    title: "Impact",
    copy: "Meals served, kilograms diverted and emissions avoided are recorded the moment the delivery closes.",
    stat: "1.24 t CO₂ avoided",
    category: "packaged",
    hue: 210,
    photo: photoAt("packaged", 1),
  },
];

/**
 * Vertical scroll drives horizontal motion on desktop, one panel per chapter.
 * On small screens the same content stacks vertically — horizontal scrolling is
 * never forced on a phone.
 */
export function HorizontalStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + 64);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-forest/12 bg-ivory py-24 lg:h-screen lg:py-0"
    >
      <div className="shell flex h-full flex-col justify-center">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="label-xs text-forest/45">
              05 — How it works, in motion
            </span>
            <h2 className="display-md mt-5 max-w-2xl text-forest">
              Five movements from a full tray to a served plate.
            </h2>
          </div>
          <p className="label-xs text-forest/40 lg:text-right">
            Scroll to travel →
          </p>
        </div>

        <div className="mt-12 overflow-hidden lg:mt-16">
          <div
            ref={trackRef}
            className="flex flex-col gap-6 lg:w-max lg:flex-row lg:gap-8"
          >
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="lg:w-[46vw] lg:max-w-[620px] lg:shrink-0"
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-forest/12 bg-[#fffdf8] transition-colors duration-500 hover:border-forest/30 lg:h-[56vh] lg:max-h-[520px] lg:flex-row">
                  <div className="relative w-full overflow-hidden lg:w-[46%]">
                    <div className="aspect-[16/10] lg:aspect-auto lg:h-full">
                      <FoodImage
                        photo={chapter.photo}
                        category={chapter.category}
                        hue={chapter.hue}
                        seed={index + 11}
                        sizes="(max-width: 1024px) 92vw, 22vw"
                      />
                    </div>
                    <span className="absolute top-4 left-4 rounded-full border border-ivory/25 bg-forest-deep/50 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.18em] text-ivory uppercase backdrop-blur-sm">
                      {chapter.index}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6 lg:p-8">
                    <div>
                      <h3 className="text-[clamp(1.8rem,2.6vw,2.6rem)] font-extrabold tracking-[-0.04em] text-forest uppercase">
                        {chapter.title}
                      </h3>
                      <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-forest/65">
                        {chapter.copy}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center justify-between border-t border-forest/12 pt-4">
                      <span className="label-xs text-forest/50">
                        {chapter.stat}
                      </span>
                      <span className="text-[0.68rem] font-semibold tracking-[0.2em] text-ember uppercase">
                        {chapter.title}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
