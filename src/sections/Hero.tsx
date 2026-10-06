import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { RescueNetwork } from "@/components/RescueNetwork";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ImpactCounter } from "@/components/animations/ImpactCounter";
import { EASE } from "@/components/animations/text";
import { usePointerParallax } from "@/hooks/use-pointer";
import { useDemo } from "@/store/demo";

const LINE_ONE = "Good food";
const LINE_TWO = "should never";
const LINE_THREE = "go to waste";

function HeroLine({
  text,
  delay,
  children,
}: {
  text: string;
  delay: number;
  children?: ReactNode;
}) {
  return (
    <span className="block overflow-hidden py-[0.02em]">
      <motion.span
        className="block will-change-transform"
        initial={{ y: "112%", opacity: 0, filter: "blur(14px)" }}
        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.25, ease: EASE, delay }}
      >
        {children ?? text}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { stats } = useDemo();
  const pointer = usePointerParallax(sectionRef);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const networkY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const networkScale = useTransform(scrollYProgress, [0, 1], [1, 1.28]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const bgX = useTransform(pointer.x, (value) => value * 14);
  const bgY = useTransform(pointer.y, (value) => value * 14);
  const copyX = useTransform(pointer.x, (value) => value * -6);
  const copyPy = useTransform(pointer.y, (value) => value * -6);
  const netX = useTransform(pointer.x, (value) => value * -18);

  return (
    <section
      ref={sectionRef}
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-forest-deep pt-28 pb-16 text-ivory md:pt-32"
    >
      {/* layered background */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-10%]"
        style={{ x: bgX, y: bgY }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ y: glowY }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 45% at 72% 28%, rgba(226,112,58,0.20), transparent 70%), radial-gradient(50% 45% at 16% 78%, rgba(109,143,106,0.22), transparent 72%)",
            }}
          />
          <svg className="absolute inset-0 h-full w-full opacity-[0.13]">
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
        </motion.div>
      </motion.div>

      <div className="shell relative z-10 grid flex-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <motion.div
          className="lg:col-span-7"
          style={{ y: copyY, opacity: copyOpacity }}
        >
          <motion.div style={{ x: copyX, y: copyPy }}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
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
            </motion.div>

            <h1 className="display-xl mt-8 text-ivory">
              <HeroLine text={LINE_ONE} delay={0.35} />
              <HeroLine text={LINE_TWO} delay={0.47}>
                <span>
                  should{" "}
                  <span className="serif-i text-[1.12em]">never</span>
                </span>
              </HeroLine>
              <HeroLine text={LINE_THREE} delay={0.59}>
                <span>
                  go to waste
                  <span className="text-ember">.</span>
                </span>
              </HeroLine>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.9 }}
              className="mt-8 max-w-lg text-[1.02rem] leading-relaxed text-ivory/65"
            >
              FoodRescue connects surplus food with communities that need it —
              before good food becomes waste.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1.05 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 1.25 }}
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
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative lg:col-span-5"
          style={{ y: networkY, scale: networkScale }}
        >
          <motion.div
            style={{ x: netX }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}
            className="mx-auto w-full max-w-[460px] px-4 sm:px-0 lg:max-w-none lg:pl-8"
          >
            <div className="mb-5 flex items-center gap-4">
              <span className="label-xs text-ivory/40">The rescue loop</span>
              <span className="h-px flex-1 bg-ivory/12" />
              <span className="label-xs text-ivory/40">Donor → impact</span>
            </div>
            <RescueNetwork parallax={pointer} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ opacity: copyOpacity }}
        className="shell relative z-10 mt-12 flex items-center justify-between gap-6 border-t border-ivory/10 pt-6"
      >
        <span className="label-xs text-ivory/40">
          Surplus → Rescue → Match → Pickup → Delivery → Impact
        </span>
        <span className="flex items-center gap-2 text-ivory/45">
          <span className="label-xs hidden sm:block">Scroll the journey</span>
          <motion.span
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-4" />
          </motion.span>
        </span>
      </motion.div>
    </section>
  );
}
