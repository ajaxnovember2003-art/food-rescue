import { motion, useReducedMotion } from "framer-motion";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Reveal } from "@/components/animations/text";
import { useDemo } from "@/store/demo";

const words = ["One meal", "can make", "a difference."];

/**
 * The closing statement: minimal, centred, and carried entirely by type. The
 * rescue box drifts along the baseline so the motif closes the story.
 */
export function FinalCTA() {
  const reduce = useReducedMotion();
  const { stats } = useDemo();

  return (
    <section className="relative overflow-hidden bg-forest py-28 text-ivory md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 0%, rgba(226,112,58,0.18), transparent 70%)",
        }}
      />

      <div className="shell relative text-center">
        <span className="label-xs text-ivory/45">12 — Join in</span>

        <h2 className="display-xl mt-8 text-ivory">
          {words.map((line, index) => (
            <span key={line} className="block overflow-hidden py-[0.02em]">
              <motion.span
                className="block"
                initial={{ y: "112%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.1,
                }}
              >
                {index === 2 ? (
                  <>
                    a difference<span className="text-ember">.</span>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h2>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-lg text-[1.02rem] leading-relaxed text-ivory/65">
            Join the network turning surplus into support — one tray, one
            pickup, one served plate at a time.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton to="/donate" variant="ember" size="lg">
              Donate food
            </MagneticButton>
            <MagneticButton
              to="/volunteer"
              variant="outline"
              size="lg"
              className="border-ivory/30 text-ivory hover:border-ivory/70"
            >
              Join the rescue network
            </MagneticButton>
          </div>
        </Reveal>

        <div className="relative mt-20 h-px w-full bg-ivory/12">
          <motion.span
            className="absolute -top-[5px] left-0 size-3 rotate-45 bg-ember"
            animate={reduce ? undefined : { left: ["0%", "100%"] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-[0.78rem] text-ivory/45">
            {stats.mealsRescued.toLocaleString("en-US")} meals rescued so far ·
            demo figures update as you use the prototype
          </p>
        </Reveal>
      </div>
    </section>
  );
}
