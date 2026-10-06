import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";

const LETTERS = "FOODRESCUE".split("");
const SESSION_KEY = "foodrescue-intro-played";

/**
 * A deliberately short cinematic intro: the wordmark resolves, a food box
 * travels the rescue line, one line of copy lands, then the whole panel lifts
 * away. Skippable with a click, a key press, or by reduced-motion preference.
 * The lift-away runs as a gsap tween before the panel unmounts, so the exit
 * survives without AnimatePresence.
 */
export function LoadingScreen() {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const finishingRef = useRef(false);
  const [playing, setPlaying] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(SESSION_KEY) !== "1";
  });

  const finish = useCallback(() => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    const panel = panelRef.current;
    if (!panel || reduce) {
      setPlaying(false);
      return;
    }
    gsap.to(panel, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.85,
      ease: EASE,
      onComplete: () => setPlaying(false),
    });
  }, [reduce]);

  useIsoLayoutEffect(() => {
    if (!playing || !panelRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from("[data-intro-letter]", {
        yPercent: 70,
        opacity: 0,
        duration: 0.7,
        ease: EASE,
        stagger: reduce ? 0 : 0.06,
      })
        .fromTo(
          "[data-intro-bar]",
          { width: "0%" },
          {
            width: "100%",
            duration: reduce ? 0.4 : 1.5,
            ease: EASE,
            delay: reduce ? 0 : 0.2,
          },
          0,
        )
        .fromTo(
          "[data-intro-diamond]",
          { left: "0%" },
          {
            left: "100%",
            duration: reduce ? 0.4 : 1.5,
            ease: EASE,
            delay: reduce ? 0 : 0.2,
          },
          0,
        )
        .from(
          "[data-intro-copy]",
          { opacity: 0, y: 12, duration: 0.8, ease: EASE },
          reduce ? 0.1 : 1.1,
        )
        .from("[data-intro-skip]", { opacity: 0, duration: 0.5 }, 1.4);
    }, panelRef);
    return () => ctx.revert();
  }, [playing, reduce]);

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
  }, [playing, reduce, finish]);

  useEffect(() => {
    document.body.style.overflow = playing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [playing]);

  if (!playing) return null;

  return (
    <div
      ref={panelRef}
      className="grain fixed inset-0 z-[900] flex flex-col items-center justify-center overflow-hidden bg-forest-deep"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
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
          <span
            key={`${letter}-${index}`}
            data-intro-letter
            className="text-[clamp(1.5rem,5vw,3rem)] font-extrabold tracking-[0.14em] text-ivory uppercase"
          >
            {letter}
          </span>
        ))}
      </div>

      <div className="relative mt-8 h-px w-[min(78vw,540px)] bg-ivory/20">
        <div
          data-intro-bar
          className="absolute inset-y-0 left-0 bg-ivory/50"
          style={{ width: "0%" }}
        />
        <div
          data-intro-diamond
          className="absolute top-1/2 size-3 -translate-y-1/2 rotate-45 bg-ember"
          style={{ left: "0%" }}
        />
      </div>

      <p
        data-intro-copy
        className="serif-i mt-7 text-[clamp(1.1rem,2.4vw,1.6rem)] text-ivory/80"
      >
        Rescuing possibility.
      </p>

      <span
        data-intro-skip
        className="label-xs absolute bottom-10 text-ivory/40"
      >
        Click to skip
      </span>
    </div>
  );
}
