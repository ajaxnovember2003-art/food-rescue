import { motion } from "framer-motion";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { EASE } from "@/components/animations/text";
import { LogoGlyph } from "@/components/Logo";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[80vh] items-center overflow-hidden bg-forest-deep py-32 text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 70% 15%, rgba(226,112,58,0.18), transparent 70%)",
        }}
      />
      <div className="shell relative">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="label-xs text-ivory/45"
        >
          404 — This route went cold
        </motion.span>

        <h1 className="display-xl mt-8 max-w-4xl">
          <span className="block overflow-hidden py-[0.02em]">
            <motion.span
              className="block"
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
            >
              Nothing here
            </motion.span>
          </span>
          <span className="block overflow-hidden py-[0.02em]">
            <motion.span
              className="block"
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            >
              to rescue<span className="text-ember">.</span>
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          className="mt-10 flex max-w-xl items-start gap-4 border-t border-ivory/12 pt-8"
        >
          <LogoGlyph className="mt-1 size-6 shrink-0 text-ember" />
          <p className="text-[0.95rem] leading-relaxed text-ivory/65">
            The page you asked for is not part of the network. Head back to the
            rescue pool — there is food waiting there right now.
          </p>
        </motion.div>

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
