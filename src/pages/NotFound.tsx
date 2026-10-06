import { useRef } from "react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useRise } from "@/hooks/use-rise";
import { LogoGlyph } from "@/components/Logo";

export default function NotFound() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Masks the headline lines up, then settles the label and the note under it.
  useRise(sectionRef, {
    immediate: true,
    delay: 0.1,
    stagger: 0.1,
    yPercent: 112,
  });

  useIsoLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || reduce) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(
        "[data-notfound-label]",
        { opacity: 0, y: 12, duration: 0.8, ease: EASE },
        0,
      ).from(
        "[data-notfound-note]",
        { opacity: 0, y: 16, duration: 0.9, ease: EASE },
        0.5,
      );
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      className="grain relative flex min-h-[80vh] items-center overflow-hidden bg-forest-deep py-32 text-ivory"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 70% 15%, rgba(226,112,58,0.18), transparent 70%)",
        }}
      />
      <div className="shell relative">
        <span data-notfound-label className="label-xs text-ivory/45">
          404 — This route went cold
        </span>

        <h1 className="display-xl mt-8 max-w-4xl">
          <span className="block overflow-hidden py-[0.02em]">
            <span data-rise className="block will-change-transform">
              Nothing here
            </span>
          </span>
          <span className="block overflow-hidden py-[0.02em]">
            <span data-rise className="block will-change-transform">
              to rescue<span className="text-ember">.</span>
            </span>
          </span>
        </h1>

        <div
          data-notfound-note
          className="mt-10 flex max-w-xl items-start gap-4 border-t border-ivory/12 pt-8"
        >
          <LogoGlyph className="mt-1 size-6 shrink-0 text-ember" />
          <p className="text-[0.95rem] leading-relaxed text-ivory/65">
            The page you asked for is not part of the network. Head back to the
            rescue pool — there is food waiting there right now.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <MagneticButton to="/rescue" variant="ember">
            Open the marketplace
          </MagneticButton>
          <MagneticButton
            to="/"
            variant="outline"
            className="border-ivory/30 text-ivory hover:border-ivory/70"
          >
            Back to home
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
