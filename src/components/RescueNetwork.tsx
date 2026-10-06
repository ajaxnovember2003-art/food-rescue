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

interface NodeDef {
  id: string;
  label: string;
  angle: number;
  stat: string;
  detail: string;
}

const NODES: NodeDef[] = [
  {
    id: "donor",
    label: "Donor",
    angle: -142,
    stat: "214 verified donors",
    detail: "Hotels, restaurants, markets, events and households",
  },
  {
    id: "food",
    label: "Food",
    angle: -58,
    stat: "12 live listings",
    detail: "1,240 servings within rescue reach right now",
  },
  {
    id: "volunteer",
    label: "Volunteer",
    angle: 18,
    stat: "128 volunteers",
    detail: "Average 14 minutes to accept a pickup",
  },
  {
    id: "community",
    label: "Community",
    angle: 92,
    stat: "46 kitchens",
    detail: "Community kitchens, shelters and shared fridges",
  },
  {
    id: "ngo",
    label: "NGO",
    angle: 166,
    stat: "19 partner NGOs",
    detail: "Coordinating routes and long-term distribution",
  },
];

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + Math.cos(rad) * radius,
    y: CENTER + Math.sin(rad) * radius,
  };
}

/**
 * The rescue network: five nodes orbiting a central RESCUE hub, with a food box
 * travelling the route between them. It is the site's recurring motif and is
 * driven by SVG so it stays razor sharp at any size.
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
  const visible = useInView(hostRef, { margin: "25% 0px" });
  const [active, setActive] = useState<string>("food");
  const mainPathRef = useRef<SVGPathElement>(null);
  const altPathRef = useRef<SVGPathElement>(null);
  const boxRef = useRef<SVGGElement>(null);
  const altBoxRef = useRef<SVGGElement>(null);

  const fallbackX = useSpring(0, { stiffness: 90, damping: 20 });
  const fallbackY = useSpring(0, { stiffness: 90, damping: 20 });
  const px = parallax?.x ?? fallbackX;
  const py = parallax?.y ?? fallbackY;

  const ringX = useTransform(px, (value) => value * 26);
  const ringY = useTransform(py, (value) => value * 26);

  useAnimationFrame((time) => {
    // Nothing to draw when the visual is scrolled away — saves a pair of SVG
    // path lookups on every frame for the rest of the page.
    if (reduce || !visible) return;
    const travels: Array<
      [RefObject<SVGPathElement | null>, RefObject<SVGGElement | null>, number]
    > = [
      [mainPathRef, boxRef, 7200],
      [altPathRef, altBoxRef, 9800],
    ];
    travels.forEach(([pathRef, groupRef, duration], index) => {
      const path = pathRef.current;
      const group = groupRef.current;
      if (!path || !group) return;
      const length =
        path.dataset.length ??
        (() => {
          const value = String(path.getTotalLength());
          path.dataset.length = value;
          return value;
        })();
      const progress = ((time + index * 2600) % duration) / duration;
      const point = path.getPointAtLength(Number(length) * progress);
      group.setAttribute(
        "transform",
        `translate(${point.x - 17} ${point.y - 13})`,
      );
      group.setAttribute("opacity", String(progress > 0.94 ? 0 : 1));
    });
  });

  const activeNode = NODES.find((node) => node.id === active) ?? NODES[0];

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
          {/* orbit rings */}
          <motion.g
            style={{ originX: "50%", originY: "50%" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 160, ease: "linear", repeat: Infinity }}
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="rgba(246,241,230,0.16)"
              strokeWidth="1"
              strokeDasharray="2 7"
            />
          </motion.g>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS * 0.72}
            fill="none"
            stroke="rgba(246,241,230,0.09)"
            strokeWidth="1"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS * 0.42}
            fill="none"
            stroke="rgba(246,241,230,0.07)"
            strokeWidth="1"
          />

          {/* radial connections */}
          {NODES.map((node, index) => {
            const from = polar(node.angle, RADIUS);
            const to = polar(node.angle, 74);
            const isActive = node.id === active;
            return (
              <motion.line
                key={node.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={
                  isActive ? "rgba(226,112,58,0.85)" : "rgba(246,241,230,0.22)"
                }
                strokeWidth={isActive ? 1.4 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1.1,
                  ease: EASE,
                  delay: reduce ? 0 : 0.5 + index * 0.08,
                }}
              />
            );
          })}

          {/* travel paths */}
          <path
            ref={mainPathRef}
            d={(() => {
              const a = polar(-142, RADIUS);
              const b = polar(92, RADIUS);
              return `M ${a.x} ${a.y} Q ${CENTER} ${CENTER} ${b.x} ${b.y}`;
            })()}
            fill="none"
            stroke="rgba(246,241,230,0.1)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <path
            ref={altPathRef}
            d={(() => {
              const a = polar(-58, RADIUS);
              const b = polar(166, RADIUS);
              return `M ${a.x} ${a.y} Q ${CENTER} ${CENTER} ${b.x} ${b.y}`;
            })()}
            fill="none"
            stroke="rgba(246,241,230,0.08)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />

          {/* node markers */}
          {NODES.map((node, index) => {
            const point = polar(node.angle, RADIUS);
            const isActive = node.id === active;
            return (
              <motion.g
                key={`marker-${node.id}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.7,
                  ease: EASE,
                  delay: reduce ? 0 : 0.6 + index * 0.08,
                }}
                style={{ originX: `${point.x}px`, originY: `${point.y}px` }}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 7 : 5}
                  fill={isActive ? "#e2703a" : "#f6f1e6"}
                  opacity={isActive ? 1 : 0.85}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 15 : 11}
                  fill="none"
                  stroke={isActive ? "rgba(226,112,58,0.55)" : "rgba(246,241,230,0.28)"}
                  strokeWidth="1"
                />
              </motion.g>
            );
          })}

          {/* the travelling food boxes */}
          {/* Positioned by attribute (never by CSS transform) so the frame loop
              can drive it directly without fighting the style layer. */}
          <g ref={boxRef} transform="translate(-200 -200)">
            <rect
              width="34"
              height="26"
              rx="4"
              fill="#f6f1e6"
              opacity="0.96"
            />
            <path d="M0 9h34" stroke="#0b2b22" strokeWidth="1.4" opacity="0.35" />
            <path d="M17 0v9" stroke="#0b2b22" strokeWidth="1.4" opacity="0.35" />
            <circle cx="17" cy="18" r="3" fill="#e2703a" />
          </g>
          <g ref={altBoxRef} transform="translate(-200 -200)" opacity="0.85">
            <rect width="26" height="20" rx="3" fill="#e9dfcc" opacity="0.95" />
            <path d="M0 7h26" stroke="#0b2b22" strokeWidth="1.2" opacity="0.3" />
            <circle cx="10" cy="14" r="2.4" fill="#0b2b22" opacity="0.5" />
          </g>

          {/* hub */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r="66"
            fill="rgba(5,23,19,0.72)"
            stroke="rgba(246,241,230,0.22)"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r="52"
            fill="none"
            stroke="rgba(226,112,58,0.35)"
            strokeDasharray="3 5"
          />
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

      {/* interactive node labels */}
      {NODES.map((node) => {
        const point = polar(node.angle, RADIUS);
        const left = (point.x / VIEW) * 100;
        const top = (point.y / VIEW) * 100;
        const isActive = node.id === active;
        return (
          <button
            key={node.id}
            type="button"
            onMouseEnter={() => setActive(node.id)}
            onFocus={() => setActive(node.id)}
            onClick={() => setActive(node.id)}
            data-cursor="hover"
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-[0.6rem] font-semibold tracking-[0.2em] uppercase transition-all duration-500",
              isActive
                ? "bg-ivory text-forest"
                : "text-ivory/70 hover:text-ivory",
            )}
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {node.label}
          </button>
        );
      })}

      </div>

      {/* active node detail */}
      <div className="mt-4 flex justify-center">
        <div className="w-full max-w-sm rounded-sm border border-ivory/12 bg-forest-deep/70 px-4 py-3 backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-ivory uppercase">
                {activeNode.stat}
              </p>
              <p className="mt-1 text-[0.7rem] leading-relaxed text-ivory/55">
                {activeNode.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
