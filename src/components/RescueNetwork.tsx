import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState, type RefObject } from "react";
import { EASE } from "@/components/animations/text";
import { cn } from "@/lib/utils";
import type { PointerParallax } from "@/hooks/use-pointer";

const VIEW = 500;
const CENTER = VIEW / 2;
const RADIUS = 152;
/** The ring starts at the donor (upper left) and runs clockwise. */
const START_ANGLE = -150;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** One full loop of the network: donor → … → impact → NGO → donor. */
const CYCLE = 16000;
const LABEL_RADIUS = RADIUS + 30;

interface NodeDef {
  id: string;
  label: string;
  angle: number;
  stat: string;
  detail: string;
}

/**
 * Sequence order is the story: a parcel leaves the donor, becomes a listing,
 * gets picked up, reaches the community, turns into impact — and the NGO keeps
 * the loop running for the next one.
 */
const NODES: NodeDef[] = [
  {
    id: "donor",
    label: "Donor",
    angle: -150,
    stat: "214 verified donors",
    detail: "Hotels, restaurants, markets and households list what is left over.",
  },
  {
    id: "food",
    label: "Food",
    angle: -90,
    stat: "12 live listings",
    detail: "1,240 servings within rescue reach right now.",
  },
  {
    id: "volunteer",
    label: "Volunteer",
    angle: -30,
    stat: "128 volunteers",
    detail: "Average 14 minutes to accept a pickup.",
  },
  {
    id: "community",
    label: "Community",
    angle: 30,
    stat: "46 kitchens",
    detail: "Community kitchens, shelters and shared fridges receiving tonight.",
  },
  {
    id: "impact",
    label: "Impact",
    angle: 90,
    stat: "Recorded live",
    detail: "Meals, kilograms and CO₂ update the moment a delivery closes.",
  },
  {
    id: "ngo",
    label: "NGO",
    angle: 150,
    stat: "19 partner NGOs",
    detail: "Coordinating routes, storage and long-term distribution.",
  },
];

/** Faint dots trailing the parcel — presence, not particle effects. */
const TRAIL_OFFSETS = [0.014, 0.03, 0.05];

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + Math.cos(rad) * radius,
    y: CENTER + Math.sin(rad) * radius,
  };
}

/**
 * The site's recurring motif: five stops orbiting a central RESCUE hub with a
 * food parcel travelling the route. Everything is driven from one frame loop —
 * the route lights up behind the parcel, nodes activate as it passes, and the
 * hub pulses on every hand-off. Hovering or focusing a node takes over the
 * read-out without stopping the journey.
 */
export function RescueNetwork({
  parallax,
  className,
}: {
  parallax?: PointerParallax;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const visible = useInView(hostRef, { margin: "20% 0px" });

  const [seq, setSeq] = useState(0);
  const [override, setOverride] = useState<string | null>(null);
  const seqRef = useRef(0);
  const startRef = useRef<number | null>(null);

  const parcelRef = useRef<SVGGElement>(null);
  const highlightRef = useRef<SVGCircleElement>(null);
  const trailA = useRef<SVGCircleElement>(null);
  const trailB = useRef<SVGCircleElement>(null);
  const trailC = useRef<SVGCircleElement>(null);
  const trails: Array<[RefObject<SVGCircleElement | null>, number]> = [
    [trailA, TRAIL_OFFSETS[0]],
    [trailB, TRAIL_OFFSETS[1]],
    [trailC, TRAIL_OFFSETS[2]],
  ];

  const fallbackX = useSpring(0, { stiffness: 90, damping: 20 });
  const fallbackY = useSpring(0, { stiffness: 90, damping: 20 });
  const px = parallax?.x ?? fallbackX;
  const py = parallax?.y ?? fallbackY;

  const ringX = useTransform(px, (value) => value * 24);
  const ringY = useTransform(py, (value) => value * 24);

  useAnimationFrame((time) => {
    // Paused off-screen or under reduced motion; restarting visibility begins
    // a fresh loop from the donor rather than jumping into a mid-cycle.
    if (reduce || !visible) {
      startRef.current = null;
      return;
    }
    if (startRef.current === null) startRef.current = time;
    const progress = ((time - startRef.current) % CYCLE) / CYCLE;

    const point = polar(START_ANGLE + 360 * progress, RADIUS);
    parcelRef.current?.setAttribute(
      "transform",
      `translate(${point.x - 17} ${point.y - 13})`,
    );
    highlightRef.current?.setAttribute(
      "stroke-dasharray",
      `${(CIRCUMFERENCE * progress).toFixed(2)} ${CIRCUMFERENCE.toFixed(2)}`,
    );
    trails.forEach(([ref, offset]) => {
      const trailing = polar(
        START_ANGLE + 360 * ((progress - offset + 1) % 1),
        RADIUS,
      );
      ref.current?.setAttribute(
        "transform",
        `translate(${trailing.x} ${trailing.y})`,
      );
    });

    const next = Math.min(NODES.length - 1, Math.floor(progress * NODES.length));
    if (next !== seqRef.current) {
      seqRef.current = next;
      setSeq(next);
    }
  });

  const activeNode =
    NODES.find((node) => node.id === override) ?? NODES[seq] ?? NODES[0];
  const activeIndex = NODES.findIndex((node) => node.id === activeNode.id);

  return (
    <div ref={hostRef} className={cn("flex w-full flex-col", className)}>
      <div className="relative aspect-square w-full">
        <motion.div
          className="absolute inset-0"
          style={{ x: ringX, y: ringY }}
        >
          <svg
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            className="h-full w-full overflow-visible"
          >
            {/* quiet interior rings */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS * 0.72}
              fill="none"
              stroke="rgba(246,241,230,0.08)"
              strokeWidth="1"
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS * 0.52}
              fill="none"
              stroke="rgba(246,241,230,0.06)"
              strokeWidth="1"
            />

            {/* the route itself — drawn on entrance */}
            <motion.circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="rgba(246,241,230,0.16)"
              strokeWidth="1"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.35 }}
            />

            {/* route lit behind the parcel */}
            <circle
              ref={highlightRef}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="rgba(226,112,58,0.9)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray={
                reduce
                  ? `${CIRCUMFERENCE} ${CIRCUMFERENCE}`
                  : `0 ${CIRCUMFERENCE}`
              }
              transform={`rotate(${START_ANGLE} ${CENTER} ${CENTER})`}
            />

            {/* radial spokes to the hub */}
            {NODES.map((node, index) => {
              const from = polar(node.angle, RADIUS - 12);
              const to = polar(node.angle, 74);
              const isActive = node.id === activeNode.id;
              return (
                <motion.line
                  key={node.id}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={
                    isActive ? "rgba(226,112,58,0.85)" : "rgba(246,241,230,0.18)"
                  }
                  strokeWidth={isActive ? 1.4 : 1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 1.1,
                    ease: EASE,
                    delay: reduce ? 0 : 0.6 + index * 0.07,
                  }}
                />
              );
            })}

            {/* trailing dust behind the parcel */}
            {trails.map(([ref, offset], index) => (
              <circle
                key={offset}
                ref={ref}
                r={2.6 - index * 0.6}
                fill="#e2703a"
                opacity={0.5 - index * 0.14}
                transform="translate(-300 -300)"
                style={{ display: reduce ? "none" : undefined }}
              />
            ))}

            {/* the travelling food parcel */}
            {/* Positioned by attribute (never by CSS transform) so the frame
                loop can drive it directly without fighting the style layer. */}
            <g ref={parcelRef} transform="translate(-300 -300)">
              <rect
                width="34"
                height="26"
                rx="3"
                fill="#f6f1e6"
                opacity="0.97"
              />
              <path d="M0 9h34" stroke="#0b2b22" strokeWidth="1.4" opacity="0.35" />
              <path d="M17 0v9" stroke="#0b2b22" strokeWidth="1.4" opacity="0.35" />
              <circle cx="17" cy="18" r="3" fill="#e2703a" />
            </g>

            {/* hub */}
            {!reduce ? (
              <>
                <motion.circle
                  cx={CENTER}
                  cy={CENTER}
                  r={66}
                  fill="none"
                  stroke="rgba(226,112,58,0.4)"
                  strokeWidth="1"
                  initial={{ r: 66, opacity: 0.4 }}
                  animate={{ r: [66, 104], opacity: [0.35, 0] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 1.4,
                  }}
                />
                <motion.circle
                  cx={CENTER}
                  cy={CENTER}
                  r={66}
                  fill="none"
                  stroke="rgba(246,241,230,0.25)"
                  strokeWidth="1"
                  animate={{ r: [66, 104], opacity: [0.22, 0] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 2.8,
                  }}
                />
              </>
            ) : null}
            <circle
              cx={CENTER}
              cy={CENTER}
              r="66"
              fill="rgba(5,23,19,0.78)"
              stroke="rgba(246,241,230,0.22)"
            />
            <motion.circle
              cx={CENTER}
              cy={CENTER}
              r="52"
              fill="none"
              stroke="rgba(226,112,58,0.35)"
              strokeDasharray="3 5"
              style={{ originX: "50%", originY: "50%" }}
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            />

            {/* node markers */}
            {NODES.map((node, index) => {
              const point = polar(node.angle, RADIUS);
              const isActive = node.id === activeNode.id;
              const passed = index < seq;
              return (
                <motion.g
                  key={`marker-${node.id}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: EASE,
                    delay: reduce ? 0 : 0.75 + index * 0.07,
                  }}
                  style={{ originX: `${point.x}px`, originY: `${point.y}px` }}
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 7 : 5}
                    fill={isActive || passed ? "#e2703a" : "#f6f1e6"}
                    opacity={isActive ? 1 : passed ? 0.6 : 0.85}
                    style={{ transition: "fill 0.45s ease, r 0.45s ease, opacity 0.45s ease" }}
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 15 : 11}
                    fill="none"
                    stroke={
                      isActive ? "rgba(226,112,58,0.55)" : "rgba(246,241,230,0.26)"
                    }
                    strokeWidth="1"
                    style={{ transition: "r 0.45s ease, stroke 0.45s ease" }}
                  />
                  {isActive && !reduce ? (
                    <motion.circle
                      key={`pulse-${node.id}-${activeIndex}`}
                      cx={point.x}
                      cy={point.y}
                      r={15}
                      fill="none"
                      stroke="rgba(226,112,58,0.7)"
                      strokeWidth="1"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                      style={{
                        originX: `${point.x}px`,
                        originY: `${point.y}px`,
                      }}
                    />
                  ) : null}
                </motion.g>
              );
            })}
          </svg>
        </motion.div>

        {/* centre label */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="block text-[0.9rem] font-extrabold tracking-[0.24em] text-ivory uppercase">
            Rescue
          </span>
          <span className="mt-1 block text-[0.55rem] tracking-[0.24em] text-ivory/45 uppercase">
            Network
          </span>
        </div>

        {/* interactive node labels, set just outside the ring */}
        {NODES.map((node) => {
          const point = polar(node.angle, LABEL_RADIUS);
          const isActive = node.id === activeNode.id;
          return (
            <button
              key={node.id}
              type="button"
              onMouseEnter={() => setOverride(node.id)}
              onMouseLeave={() => setOverride(null)}
              onFocus={() => setOverride(node.id)}
              onBlur={() => setOverride(null)}
              onClick={() => setOverride(node.id)}
              data-cursor="hover"
              aria-label={`${node.label} — ${node.stat}`}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-[0.58rem] font-semibold tracking-[0.18em] whitespace-nowrap uppercase transition-all duration-500",
                isActive
                  ? "bg-ivory text-forest"
                  : "text-ivory/65 hover:text-ivory",
              )}
              style={{
                left: `${(point.x / VIEW) * 100}%`,
                top: `${(point.y / VIEW) * 100}%`,
              }}
            >
              {node.label}
            </button>
          );
        })}
      </div>

      {/* active node read-out — an editorial strip, not a status card */}
      <div className="mt-5 flex items-start gap-4 border-t border-ivory/12 pt-4">
        <span className="label-xs mt-px shrink-0 text-ember">
          {String(activeIndex + 1).padStart(2, "0")}
          <span className="text-ivory/30">/0{NODES.length}</span>
        </span>
        <div className="min-h-[3.1rem] flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-ivory uppercase">
                {activeNode.stat}
              </p>
              <p className="mt-1 text-[0.72rem] leading-relaxed text-ivory/55">
                {activeNode.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
