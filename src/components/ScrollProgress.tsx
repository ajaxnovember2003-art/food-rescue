import { motion, useScroll, useSpring } from "framer-motion";

/** A single hairline at the very top of the viewport that fills as you read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[80] h-[2px] w-full origin-left bg-ember/80"
      style={{ scaleX }}
    />
  );
}
