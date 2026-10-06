import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/components/animations/text";

const LETTERS = "FOODRESCUE".split("");
const SESSION_KEY = "foodrescue-intro-played";

/**
 * A deliberately short cinematic intro: the wordmark resolves, a food box
 * travels the rescue line, one line of copy lands, then the whole panel lifts
 * away. Skippable with a click, a key press, or by reduced-motion preference.
 */
export function LoadingScreen() {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(SESSION_KEY) !== "1";
  });

  const finish = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    setPlaying(false);
  };

  useEffect(() => {
    if (!playing) return;
    const duration = reduce ? 700 : 2200;
    const timeout = window.setTimeout(finish, duration);
    const onKey = () => finish();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, reduce]);

  useEffect(() => {
    document.body.style.overflow = playing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [playing]);

  return (
    <AnimatePresence>
      {playing ? (
        <motion.div
          key="intro"
          className="grain fixed inset-0 z-[900] flex flex-col items-center justify-center overflow-hidden bg-forest-deep"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.85, ease: EASE }}
          onClick={finish}
          role="presentation"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 55%, rgba(226,112,58,0.16), transparent 70%)",
            }}
          />

          <div className="flex items-center gap-[0.12em]">
            {LETTERS.map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                initial={{ y: "70%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.7,
                  ease: EASE,
                  delay: reduce ? 0 : 0.06 * index,
                }}
                className="text-[clamp(1.5rem,5vw,3rem)] font-extrabold tracking-[0.14em] text-ivory uppercase"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <div className="relative mt-8 h-px w-[min(78vw,540px)] bg-ivory/20">
            <motion.div
              className="absolute inset-y-0 left-0 bg-ivory/50"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: reduce ? 0.4 : 1.5, ease: EASE, delay: 0.2 }}
            />
            <motion.div
              className="absolute top-1/2 size-3 -translate-y-1/2 rotate-45 bg-ember"
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ duration: reduce ? 0.4 : 1.5, ease: EASE, delay: 0.2 }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0.1 : 1.1 }}
            className="serif-i mt-7 text-[clamp(1.1rem,2.4vw,1.6rem)] text-ivory/80"
          >
            Rescuing possibility.
          </motion.p>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="label-xs absolute bottom-10 text-ivory/40"
          >
            Click to skip
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
