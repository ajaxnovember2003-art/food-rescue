import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DemoControl } from "@/components/DemoControl";
import { Reveal } from "@/components/animations/text";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { photoCredits } from "@/data/photos";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Rescue", to: "/rescue" },
      { label: "Donate", to: "/donate" },
      { label: "Impact", to: "/impact" },
      { label: "Community", to: "/community" },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "Volunteer", to: "/volunteer" },
      { label: "Organizations", to: "/organization" },
      { label: "How it works", to: "/#how-it-works" },
      { label: "Live map", to: "/#map" },
    ],
  },
];

const marquee = [
  "Surplus",
  "Rescue",
  "Match",
  "Pickup",
  "Delivery",
  "Impact",
];

export function Footer() {
  const reduce = useReducedMotion();
  const marqueeRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const element = marqueeRef.current;
    if (!element || reduce) return;
    const tween = gsap.to(element, {
      xPercent: -50,
      duration: 26,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, [reduce]);

  return (
    <footer className="relative overflow-hidden bg-forest-deep pt-16 text-ivory">
      <div className="border-y border-ivory/10 py-5">
        <div className="flex overflow-hidden">
          <div
            ref={marqueeRef}
            className="flex shrink-0 items-center gap-10 pr-10"
          >
            {[...marquee, ...marquee, ...marquee, ...marquee].map(
              (word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="flex items-center gap-10 text-[0.72rem] font-semibold tracking-[0.32em] whitespace-nowrap text-ivory/45 uppercase"
                >
                  {word}
                  <span className="size-1 rounded-full bg-ember/70" />
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="shell grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo tone="light" />
          <p className="serif-i mt-6 max-w-xs text-[1.35rem] leading-snug text-ivory/80">
            Good food should never go to waste.
          </p>
          <p className="mt-6 max-w-sm text-[0.85rem] leading-relaxed text-ivory/50">
            FoodRescue is a rescue network for surplus food — connecting
            kitchens, hotels, events and households with volunteers and
            community kitchens that can serve it today.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="lg:col-span-2">
            <p className="label-xs text-ivory/40">{column.title}</p>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    data-cursor="hover"
                    className="group inline-flex items-center gap-1.5 text-[0.88rem] text-ivory/75 transition-colors hover:text-ember"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5 -translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-1 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lg:col-span-3">
          <p className="label-xs text-ivory/40">Get in touch</p>
          <a
            href="mailto:network@foodrescue.example"
            data-cursor="hover"
            className="mt-5 block text-[0.95rem] text-ivory/80 transition-colors hover:text-ember"
          >
            network@foodrescue.example
          </a>
          <p className="mt-4 text-[0.8rem] leading-relaxed text-ivory/45">
            Pilot cities: Riverside, Northgate, Old Market and Lakeside.
          </p>
        </div>
      </div>

      <Reveal className="shell" y={24}>
        <p className="w-full text-center text-[clamp(2.5rem,13vw,11rem)] leading-[0.8] font-extrabold tracking-[-0.05em] text-ivory/8 uppercase select-none">
          FoodRescue
        </p>
      </Reveal>

      <div className="shell mt-6 flex flex-col gap-4 border-t border-ivory/10 py-8 text-[0.72rem] text-ivory/45 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} FoodRescue — concept product.</p>
        <div className="max-w-md md:text-center">
          <p>
            Frontend prototype for competition demonstration. Statistics shown
            are illustrative mock data.
          </p>
          <p className="mt-2">
            Photography (CC0 / public domain):{" "}
            {photoCredits.map((credit, index) => (
              <span key={credit.label}>
                <a
                  href={credit.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-colors hover:text-ember"
                >
                  {credit.label}
                </a>
                {index < photoCredits.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
        <DemoControl />
      </div>
    </footer>
  );
}
