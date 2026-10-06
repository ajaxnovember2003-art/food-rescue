import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";

type CursorState = "default" | "hover" | "label" | "drag";

/**
 * Custom cursor for pointer devices only.
 *
 * The ring lags behind the pointer on a spring while the dot stays locked to it,
 * which gives the interaction a physical weight. Elements opt in with
 * `data-cursor="hover"` or `data-cursor="label" data-cursor-label="RESCUE"`.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const reduce = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.5 });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => {
      const on = query.matches && !reduce;
      setEnabled(on);
      document.documentElement.dataset.cursor = on ? "on" : "off";
    };
    apply();
    query.addEventListener("change", apply);
    return () => {
      query.removeEventListener("change", apply);
      delete document.documentElement.dataset.cursor;
    };
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = event.target as Element | null;
      const holder = target?.closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;

      if (!holder) {
        setState("default");
        setLabel("");
        return;
      }

      const mode = holder.dataset.cursor as CursorState | undefined;
      setState(mode === "label" ? "label" : (mode ?? "hover"));
      setLabel(holder.dataset.cursorLabel ?? "");
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize =
    state === "label" ? 86 : state === "hover" ? 54 : 34;
  const showLabel = state === "label" && label;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
    >
      <motion.div
        className="absolute grid place-items-center rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: showLabel ? "normal" : "difference",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.9 : 1,
          backgroundColor: showLabel ? "#0b2b22" : "rgba(255,255,255,0)",
          borderColor: showLabel ? "rgba(11,43,34,0)" : "rgba(255,255,255,0.9)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <AnimatePresence>
          {showLabel ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.22 }}
              className="text-[0.6rem] font-semibold tracking-[0.18em] text-ivory"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="absolute size-1.5 rounded-full bg-ember"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: showLabel ? "normal" : "difference",
        }}
        animate={{
          opacity: visible && !showLabel ? 1 : 0,
          scale: pressed ? 1.6 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
