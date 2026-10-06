import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap } from "@/lib/gsap";

type CursorState = "default" | "hover" | "label" | "drag";

/**
 * Custom cursor for pointer devices only.
 *
 * The ring lags behind the pointer on a spring (gsap quickTo) while the dot is
 * locked to it, which gives the interaction a physical weight. Elements opt in
 * with `data-cursor="hover"` or `data-cursor="label" data-cursor-label="RESCUE"`.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const reduce = useReducedMotion();

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const movers = useRef<{
    x: (value: number) => void;
    y: (value: number) => void;
  } | null>(null);

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

  // Centre both pieces on the pointer with percent transforms (so the ring can
  // change size without drifting) and give the ring its lag.
  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    movers.current = {
      x: gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" }),
      y: gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" }),
    };
    return () => {
      movers.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: MouseEvent) => {
      const dot = dotRef.current;
      if (dot) gsap.set(dot, { x: event.clientX, y: event.clientY });
      movers.current?.x(event.clientX);
      movers.current?.y(event.clientY);
      setVisible(true);

      const target = event.target as Element | null;
      const holder = target?.closest?.("[data-cursor]") as HTMLElement | null;

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
  }, [enabled]);

  // Ring + dot respond to hover state with a springy size/opacity tween.
  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;
    const size = state === "label" ? 86 : state === "hover" ? 54 : 34;
    const labelled = state === "label" && Boolean(label);
    gsap.to(ring, {
      width: size,
      height: size,
      opacity: visible ? 1 : 0,
      scale: pressed ? 0.9 : 1,
      backgroundColor: labelled ? "#0b2b22" : "rgba(255,255,255,0)",
      borderColor: labelled ? "rgba(11,43,34,0)" : "rgba(255,255,255,0.9)",
      duration: 0.32,
      ease: "power3.out",
    });
    gsap.to(dot, {
      opacity: visible && !labelled ? 1 : 0,
      scale: pressed ? 1.6 : 1,
      duration: 0.2,
      ease: "power2.out",
    });
  }, [enabled, state, label, visible, pressed]);

  // The label cross-fades inside the ring instead of popping.
  useEffect(() => {
    if (!enabled) return;
    const element = labelRef.current;
    if (!element) return;
    const labelled = state === "label" && Boolean(label);
    if (labelled) {
      gsap.fromTo(
        element,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.22, ease: "power2.out" },
      );
    } else {
      gsap.to(element, {
        opacity: 0,
        scale: 0.7,
        duration: 0.18,
        ease: "power2.in",
      });
    }
  }, [enabled, state, label]);

  if (!enabled) return null;

  const ringSize = state === "label" ? 86 : state === "hover" ? 54 : 34;
  const showLabel = state === "label" && label;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
    >
      <div
        ref={ringRef}
        data-ring
        className="absolute top-0 left-0 grid place-items-center rounded-full border"
        style={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          backgroundColor: showLabel ? "#0b2b22" : "rgba(255,255,255,0)",
          borderColor: showLabel ? "rgba(11,43,34,0)" : "rgba(255,255,255,0.9)",
          mixBlendMode: showLabel ? "normal" : "difference",
        }}
      >
        <span
          ref={labelRef}
          className="text-[0.6rem] font-semibold tracking-[0.18em] text-ivory"
          style={{ opacity: 0 }}
        >
          {label}
        </span>
      </div>

      <div
        ref={dotRef}
        data-dot
        className="absolute top-0 left-0 size-1.5 rounded-full bg-ember"
        style={{
          opacity: visible && !showLabel ? 1 : 0,
          mixBlendMode: showLabel ? "normal" : "difference",
        }}
      />
    </div>
  );
}
