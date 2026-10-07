import { useEffect, useRef, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { RescueNetwork } from "@/components/RescueNetwork";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ImpactCounter } from "@/components/animations/ImpactCounter";
import { useFloat } from "@/hooks/use-float";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { usePointerParallax } from "@/hooks/use-pointer";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { useDemo } from "@/store/demo";

const LINE_ONE = "Good food";
const LINE_TWO = "should never";
const LINE_THREE = "go to waste";

/** A masked hero line; the entrance timeline drives its rise. */
function HeroLine({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <span className="block overflow-hidden py-[0.02em]">
      <span data-hero-line className="block will-change-transform">
        {children ?? text}
      </span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { stats } = useDemo();
  const pointer = usePointerParallax(sectionRef);

  // Layer refs: background (pointer), glow (scroll), copy column (scroll) with
  // an inner wrapper (pointer), network column (scroll) with an inner wrapper
  // (pointer + entrance), and the bottom strip (scroll) with its own contents
  // (entrance) — kept on separate elements so no two tweens fight over one
  // transform.
  const bgRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowFloatRef = useRef<HTMLDivElement>(null);
  const gridFloatRef = useRef<SVGSVGElement>(null);
  const copyColRef = useRef<HTMLDivElement>(null);
  const copyInnerRef = useRef<HTMLDivElement>(null);
  const netColRef = useRef<HTMLDivElement>(null);
  const netInnerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const stripInnerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  // Ambient drift: the warm glow and the measuring grid breathe at different
  // rates, so the backdrop reads as depth rather than one moving sheet. Both
  // only ever touch `y`, leaving the scroll scrub on their parent's `yPercent`
  // and the pointer parallax on the layer above untouched.
  useFloat(glowFloatRef, { distance: 12, duration: 9 });
  useFloat(gridFloatRef, { distance: 20, duration: 13.5, delay: 0.6 });

  // Hero entrance: one choreographed timeline that plays before first paint.
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      if (reduce) return;
      const tl = gsap.timeline();
      tl.from(badgeRef, { opacity: 0, y: 14, duration: 0.9, ease: EASE }, 0.15)
        .from(
          "[data-hero-line]",
          {
            yPercent: 112,
            opacity: 0,
            filter: "blur(14px)",
            duration: 1.25,
            ease: EASE,
            stagger: 0.12,
          },
          0.35,
        )
        .from(netInnerRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 1.6,
          ease: EASE,
        }, 0.5)
        .from(leadRef, { opacity: 0, y: 18, duration: 1, ease: EASE }, 0.9)
        .from(ctaRef, { opacity: 0, y: 18, duration: 1, ease: EASE }, 1.05)
        .from(statsRef, { opacity: 0, duration: 1, ease: EASE }, 1.25)
        .from(stripInnerRef, { opacity: 0, duration: 1, ease: EASE }, 1.5);

      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          y: 6,
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2.2,
        });
      }
    }, section);
    return () => ctx.revert();
  }, [reduce]);

  // Scroll: the copy and strip lift away while the network expands toward the
  // reader and the warm glow drifts down — one scrubbed timeline.
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const copy = copyColRef.current;
    const net = netColRef.current;
    const strip = stripRef.current;
    const glow = glowRef.current;
    if (!section || !copy || !net || !strip || !glow) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .to(copy, { yPercent: -38, ease: "none", duration: 1 }, 0)
        .to([copy, strip], { opacity: 0, ease: "none", duration: 0.75 }, 0)
        .to(net, { yPercent: 26, scale: 1.28, ease: "none", duration: 1 }, 0)
        .to(glow, { yPercent: 18, ease: "none", duration: 1 }, 0);
    }, section);
    return () => ctx.revert();
  }, []);

  // Pointer depth: each layer tracks the shared pointer at its own multiplier.
  useEffect(() => {
    const bg = bgRef.current;
    const copyInner = copyInnerRef.current;
    const netInner = netInnerRef.current;
    if (!bg || !copyInner || !netInner || reduce) return;

    const bgX = gsap.quickTo(bg, "x", { duration: 0.7, ease: "power3.out" });
    const bgY = gsap.quickTo(bg, "y", { duration: 0.7, ease: "power3.out" });
    const copyX = gsap.quickTo(copyInner, "x", {
      duration: 0.7,
      ease: "power3.out",
    });
    const copyY = gsap.quickTo(copyInner, "y", {
      duration: 0.7,
      ease: "power3.out",
    });
    const netX = gsap.quickTo(netInner, "x", {
      duration: 0.7,
      ease: "power3.out",
    });

    return pointer.subscribe((x, y) => {
      bgX(x * 14);
      bgY(y * 14);
      copyX(x * -6);
      copyY(y * -6);
      netX(x * -18);
    });
  }, [pointer, reduce]);

  return (
    <section
      ref={sectionRef}
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-forest-deep pt-28 pb-16 text-ivory md:pt-32"
    >
      {/* layered background */}
      <div ref={bgRef} aria-hidden="true" className="pointer-events-none absolute inset-[-10%]">
        <div ref={glowRef} className="absolute inset-0">
          <div
            ref={glowFloatRef}
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 45% at 72% 28%, rgba(226,112,58,0.20), transparent 70%), radial-gradient(50% 45% at 16% 78%, rgba(109,143,106,0.22), transparent 72%)",
            }}
          />
          <svg
            ref={gridFloatRef}
            className="absolute inset-0 h-full w-full opacity-[0.13]"
          >
            <defs>
              <pattern
                id="hero-grid"
                width="96"
                height="96"
                patternUnits="userSpaceOnUse"
              >
                <path d="M96 0H0v96" fill="none" stroke="#f6f1e6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>
      </div>

      <div className="shell relative z-10 grid flex-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div ref={copyColRef} className="lg:col-span-7">
          <div ref={copyInnerRef}>
            <div
              ref={badgeRef}
              className="flex flex-wrap items-center gap-3"
            >
              <span className="label-xs inline-flex items-center gap-2 rounded-full border border-ivory/20 px-3 py-1.5 text-ivory/70">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember/70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-ember" />
                </span>
                Rescue network live
              </span>
              <span className="label-xs text-ivory/40">
                {stats.activeRescues} rescues in progress
              </span>
            </div>

            <h1 className="display-xl mt-8 text-ivory">
              <HeroLine text={LINE_ONE} />
              <HeroLine text={LINE_TWO}>
                <span>
                  should{" "}
                  <span className="serif-i text-[1.12em]">never</span>
                </span>
              </HeroLine>
              <HeroLine text={LINE_THREE}>
                <span>
                  go to waste
                  <span className="text-ember">.</span>
                </span>
              </HeroLine>
            </h1>

            <p
              ref={leadRef}
              className="mt-8 max-w-lg text-[1.02rem] leading-relaxed text-ivory/65"
            >
              FoodRescue connects surplus food with communities that need it —
              before good food becomes waste.
            </p>

            <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton to="/donate" variant="ember" cursorLabel="DONATE">
                Donate food
              </MagneticButton>
              <MagneticButton
                to="/rescue"
                variant="outline"
                className="border-ivory/30 text-ivory hover:border-ivory/70"
                cursorLabel="RESCUE"
              >
                Rescue food
              </MagneticButton>
            </div>

            <div
              ref={statsRef}
              className="mt-14 flex items-center gap-6 border-t border-ivory/12 pt-6"
            >
              <div>
                <p className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold tracking-[-0.04em] text-ivory">
                  <ImpactCounter value={stats.mealsRescued} />
                  <span className="text-ember">+</span>
                </p>
                <p className="label-xs mt-1 text-ivory/45">
                  Meals rescued this month
                </p>
              </div>
              <div className="hidden h-12 w-px bg-ivory/12 sm:block" />
              <div className="hidden sm:block">
                <p className="max-w-[16rem] text-[0.78rem] leading-relaxed text-ivory/55">
                  Live demo network — rescue a listing and watch this figure
                  move.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div ref={netColRef} className="relative lg:col-span-5">
          <div ref={netInnerRef} className="mx-auto w-full max-w-[460px] px-4 sm:px-0 lg:max-w-none lg:pl-8">
            <div className="mb-5 flex items-center gap-4">
              <span className="label-xs text-ivory/40">The rescue loop</span>
              <span className="h-px flex-1 bg-ivory/12" />
              <span className="label-xs text-ivory/40">Donor → impact</span>
            </div>
            <RescueNetwork parallax={pointer} />
          </div>
        </div>
      </div>

      <div
        ref={stripRef}
        className="shell relative z-10 mt-12 border-t border-ivory/10 pt-6"
      >
        <div ref={stripInnerRef} className="flex items-center justify-between gap-6">
          <span className="label-xs text-ivory/40">
            Surplus → Rescue → Match → Pickup → Delivery → Impact
          </span>
          <span className="flex items-center gap-2 text-ivory/45">
            <span className="label-xs hidden sm:block">Scroll the journey</span>
            <span ref={arrowRef}>
              <ArrowDown className="size-4" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
