import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A single hairline at the very top of the viewport that fills as you read.
 * gsap quickTo gives it the springy lag the framer spring used to provide.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    const scaleX = gsap.quickTo(bar, "scaleX", {
      duration: 0.35,
      ease: "power3.out",
    });
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      scaleX(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[80] h-[2px] w-full origin-left bg-ember/80"
    />
  );
}
