import { useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { rescueTrend } from "@/data/mock";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Weekly rescued meals and diverted kilograms, drawn on the brand palette. */
export function RescueTrendChart({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  return (
    <div ref={ref} className={cn("h-[260px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={rescueTrend}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="trend-meals" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2703a" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#e2703a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="trend-kg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a9b7a3" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#a9b7a3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="rgba(246,241,230,0.08)"
            vertical={false}
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="week"
            tick={{ fill: "rgba(246,241,230,0.45)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <Tooltip
            cursor={{ stroke: "rgba(246,241,230,0.2)" }}
            contentStyle={{
              background: "#051713",
              border: "1px solid rgba(246,241,230,0.16)",
              borderRadius: 2,
              fontSize: 12,
              color: "#f6f1e6",
            }}
            labelStyle={{ color: "rgba(246,241,230,0.5)", fontSize: 10 }}
            formatter={(value: number | string, name) => [
              `${formatNumber(Number(value))}${name === "kg" ? " kg" : ""}`,
              name === "kg" ? "Food diverted" : "Meals rescued",
            ]}
          />
          <Area
            type="monotone"
            dataKey="meals"
            stroke="#e2703a"
            strokeWidth={1.6}
            fill="url(#trend-meals)"
            animationDuration={reduce || !inView ? 0 : 1600}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="kg"
            stroke="#a9b7a3"
            strokeWidth={1.2}
            strokeDasharray="4 4"
            fill="url(#trend-kg)"
            animationDuration={reduce || !inView ? 0 : 1900}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Circular progress used for personal impact. */
export function ImpactRing({
  value,
  max,
  label,
  sublabel,
  size = 220,
  className,
}: {
  value: number;
  max: number;
  label: string;
  sublabel: string;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, value / max);
  const ringRef = useRef<SVGCircleElement>(null);

  // The arc sweeps to its value once the ring is in view.
  useIsoLayoutEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    const target = circumference * (1 - progress);
    if (reduce) {
      gsap.set(el, { strokeDashoffset: target });
      return;
    }
    if (!inView) return;
    const tween = gsap.fromTo(
      el,
      { strokeDashoffset: circumference },
      { strokeDashoffset: target, duration: 2, ease: EASE },
    );
    return () => {
      tween.kill();
    };
  }, [inView, reduce, circumference, progress]);

  return (
    <div
      ref={ref}
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(246,241,230,0.14)"
          strokeWidth="2"
        />
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2703a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 16}
          fill="none"
          stroke="rgba(246,241,230,0.07)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-[2.4rem] leading-none font-extrabold tracking-[-0.05em] text-ivory">
          {formatNumber(value)}
        </p>
        <p className="label-xs mt-2 text-ivory/45">{label}</p>
        <p className="mt-1 text-[0.68rem] text-ivory/35">{sublabel}</p>
      </div>
    </div>
  );
}

/** Horizontal bar list — lighter than a chart for category splits. */
export function CategoryBars({ className }: { className?: string }) {
  const rootRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;
    const ctx = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>("[data-cat-bar]", root)
        .forEach((el, index) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.1,
            ease: EASE,
            delay: index * 0.08,
            scrollTrigger: { trigger: root, start: "top 88%", once: true },
          });
        });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  const bars = [
    { label: "Meals", value: 46, color: "#0b2b22" },
    { label: "Bakery", value: 19, color: "#e2703a" },
    { label: "Fruits", value: 15, color: "#6d8f6a" },
    { label: "Vegetables", value: 13, color: "#a9b7a3" },
    { label: "Packaged", value: 7, color: "#c2401f" },
  ];

  return (
    <ul ref={rootRef} className={cn("space-y-4", className)}>
      {bars.map((bar) => (
        <li key={bar.label}>
          <div className="flex items-baseline justify-between text-[0.78rem]">
            <span className="text-ivory/70">{bar.label}</span>
            <span className="font-semibold text-ivory/50">{bar.value}%</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ivory/12">
            <div
              data-cat-bar
              className="h-full origin-left rounded-full"
              style={{
                backgroundColor: bar.color,
                transform: `scaleX(${bar.value / 50})`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
