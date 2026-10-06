import { useRef } from "react";
import type { FoodCategory } from "@/types";
import { cn } from "@/lib/utils";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Original vector art direction for FoodRescue.
 *
 * Rather than pulling stock photography, each listing is drawn as a layered
 * geometric still life: a numbered container, its contents and a warm rim of
 * light. It keeps the prototype fast, consistent and unmistakably ours.
 */
export function FoodArtwork({
  category,
  hue = 150,
  seed = 1,
  className,
  animateContents = true,
}: {
  category: FoodCategory;
  hue?: number;
  seed?: number;
  className?: string;
  animateContents?: boolean;
}) {
  const base = `hsl(${hue} 30% 16%)`;
  const mid = `hsl(${hue} 26% 24%)`;
  const glow = `hsl(${hue} 55% 68%)`;
  const grain = `hsl(${(hue + 40) % 360} 62% 72%)`;
  const clay = `hsl(${(hue + 180) % 360} 45% 62%)`;
  const id = `fa-${category}-${seed}-${hue}`;
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);

  // The contents settle into the container as the artwork scrolls into view.
  useIsoLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg || !animateContents || reduce) return;
    const ctx = gsap.context(() => {
      const groups = gsap.utils.toArray<SVGGElement>("[data-fa-content]");
      if (!groups.length) return;
      gsap.from(groups, {
        y: 8,
        opacity: 0,
        duration: 0.9,
        ease: EASE,
        scrollTrigger: { trigger: svg, start: "top 92%", once: true },
      });
    }, svg);
    return () => ctx.revert();
  }, [animateContents, reduce]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${category} rescue illustration`}
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={base} />
          <stop offset="100%" stopColor={mid} />
        </linearGradient>
        <radialGradient id={`${id}-light`} cx="0.3" cy="0.18" r="0.75">
          <stop offset="0%" stopColor={glow} stopOpacity="0.42" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-surface`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(246,241,230,0.94)" />
          <stop offset="100%" stopColor="rgba(233,223,204,0.82)" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${id}-bg)`} />
      <rect width="400" height="300" fill={`url(#${id}-light)`} />

      {/* faint measuring grid — the "network" motif */}
      <g opacity="0.16" stroke={glow} strokeWidth="0.6">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`v${i}`} x1={40 + i * 53} y1="0" x2={40 + i * 53} y2="300" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1="0" y1={30 + i * 60} x2="400" y2={30 + i * 60} />
        ))}
      </g>

      <ellipse
        cx="200"
        cy="246"
        rx="132"
        ry="26"
        fill="rgba(3,12,10,0.45)"
      />

      {category === "meals" ? (
        <g>
          <path
            d="M78 176 h244 a26 26 0 0 1 -26 62 h-192 a26 26 0 0 1 -26 -62 z"
            fill={`url(#${id}-surface)`}
          />
          <path
            d="M78 176 h244 a26 26 0 0 1 -26 62 h-192 a26 26 0 0 1 -26 -62 z"
            fill="none"
            stroke="rgba(11,43,34,0.18)"
          />
          <ellipse cx="200" cy="178" rx="122" ry="34" fill={grain} />
          <ellipse cx="200" cy="172" rx="122" ry="34" fill="rgba(255,253,248,0.92)" />
          <g data-fa-content>
            <circle cx="158" cy="164" r="17" fill={clay} />
            <circle cx="200" cy="156" r="20" fill={glow} opacity="0.85" />
            <circle cx="244" cy="166" r="15" fill={grain} />
            <rect x="182" y="176" width="36" height="10" rx="5" fill={clay} opacity="0.7" />            </g>
          <g opacity="0.5" stroke="#fffdf8" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M172 118 c-6 -12 6 -18 0 -30" />
            <path d="M200 110 c-6 -12 6 -18 0 -30" />
            <path d="M228 118 c-6 -12 6 -18 0 -30" />
          </g>
        </g>
      ) : null}

      {category === "bakery" ? (
        <g>
          <path d="M66 150 h268 v104 a10 10 0 0 1 -10 10 H76 a10 10 0 0 1 -10 -10 z" fill="rgba(11,43,34,0.55)" />
          <path d="M66 150 h268 v18 H66 z" fill="rgba(246,241,230,0.18)" />
          <g data-fa-content>
            {[
              { x: 96, w: 76, h: 40, y: 108, f: grain },
              { x: 186, w: 88, h: 46, y: 100, f: "rgba(255,253,248,0.95)" },
              { x: 286, w: 62, h: 36, y: 112, f: clay },
            ].map((loaf) => (
              <g key={loaf.x}>
                <rect
                  x={loaf.x}
                  y={loaf.y}
                  width={loaf.w}
                  height={loaf.h}
                  rx={loaf.h / 2}
                  fill={loaf.f}
                />
                <path
                  d={`M${loaf.x + 12} ${loaf.y + loaf.h / 2} l${loaf.w - 24} 0`}
                  stroke="rgba(11,43,34,0.25)"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                />
              </g>
            ))}            </g>
          <path d="M66 150 h268" stroke="rgba(246,241,230,0.4)" strokeWidth="1" />
        </g>
      ) : null}

      {category === "fruits" ? (
        <g>
          <path d="M64 158 h272 v96 a8 8 0 0 1 -8 8 H72 a8 8 0 0 1 -8 -8 z" fill="rgba(11,43,34,0.5)" />
          <g data-fa-content>
            <circle cx="128" cy="140" r="30" fill={clay} />
            <circle cx="188" cy="130" r="34" fill={grain} />
            <circle cx="252" cy="142" r="28" fill={glow} opacity="0.9" />
            <circle cx="300" cy="152" r="22" fill={clay} opacity="0.85" />
            <circle cx="104" cy="150" r="20" fill={grain} opacity="0.7" />            </g>
          {[64, 96, 128].map((y) => (
            <line key={y} x1="64" y1={y + 130} x2="336" y2={y + 130} stroke="rgba(246,241,230,0.16)" />
          ))}
        </g>
      ) : null}

      {category === "vegetables" ? (
        <g>
          <path d="M64 160 h272 v94 a8 8 0 0 1 -8 8 H72 a8 8 0 0 1 -8 -8 z" fill="rgba(11,43,34,0.5)" />
          <g data-fa-content>
            {[
              { x: 118, hue: 118 },
              { x: 168, hue: 96 },
              { x: 218, hue: 140 },
              { x: 268, hue: 78 },
            ].map((leaf, index) => (
              <g key={leaf.x}>
                <rect
                  x={leaf.x}
                  y={116 + (index % 2) * 12}
                  width="26"
                  height={72 - (index % 3) * 10}
                  rx="13"
                  fill={`hsl(${leaf.hue} 42% ${index % 2 ? 58 : 66}%)`}
                />
                <path
                  d={`M${leaf.x + 13} ${122 + (index % 2) * 12} v${56 - (index % 3) * 8}`}
                  stroke="rgba(15,45,34,0.3)"
                  strokeWidth="1.4"
                />
              </g>
            ))}            </g>
          <line x1="64" y1="200" x2="336" y2="200" stroke="rgba(246,241,230,0.16)" />
          <line x1="64" y1="232" x2="336" y2="232" stroke="rgba(246,241,230,0.16)" />
        </g>
      ) : null}

      {category === "packaged" ? (
        <g>
          <g data-fa-content>
            {[
              { x: 96, h: 116 },
              { x: 178, h: 138 },
              { x: 260, h: 104 },
            ].map((box) => (
              <g key={box.x}>
                <rect
                  x={box.x}
                  y={244 - box.h}
                  width="68"
                  height={box.h}
                  rx="6"
                  fill="rgba(255,253,248,0.92)"
                />
                <rect
                  x={box.x}
                  y={244 - box.h}
                  width="68"
                  height="16"
                  rx="6"
                  fill={clay}
                  opacity="0.85"
                />
                <line
                  x1={box.x + 12}
                  y1={244 - box.h + 40}
                  x2={box.x + 56}
                  y2={244 - box.h + 40}
                  stroke="rgba(11,43,34,0.22)"
                  strokeWidth="3"
                />
                <line
                  x1={box.x + 12}
                  y1={244 - box.h + 56}
                  x2={box.x + 42}
                  y2={244 - box.h + 56}
                  stroke="rgba(11,43,34,0.16)"
                  strokeWidth="3"
                />
              </g>
            ))}            </g>
          <path d="M64 244 h272" stroke="rgba(246,241,230,0.2)" />
        </g>
      ) : null}

      {/* rescue stamp motif */}
      <g opacity="0.5">
        <circle cx="336" cy="60" r="30" fill="none" stroke={glow} strokeWidth="1" />
        <path
          d="M326 60 h20 M338 52 l8 8 -8 8"
          stroke={glow}
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
