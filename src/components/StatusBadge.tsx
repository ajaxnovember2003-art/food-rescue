import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { countdownLabel, urgencyFor, urgencyMeta } from "@/lib/format";
import type { RescueStage } from "@/types";

export function UrgencyBadge({
  minutes,
  className,
}: {
  minutes: number;
  className?: string;
}) {
  const urgency = urgencyFor(minutes);
  const meta = urgencyMeta[urgency];
  // Only listings about to close pulse — urgency should feel rare, not noisy.
  const live = urgency === "urgent";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] uppercase",
        meta.className,
        className,
      )}
    >
      <span className="relative flex size-1.5">
        {live ? (
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-60",
              meta.dot,
            )}
          />
        ) : null}
        <span className={cn("relative inline-flex size-1.5 rounded-full", meta.dot)} />
      </span>
      {countdownLabel(minutes)}
    </span>
  );
}

const stageStyles: Record<RescueStage, string> = {
  listed: "border-forest/25 text-forest/80",
  claimed: "border-ember/40 text-ember",
  picked_up: "border-forest/40 text-forest",
  delivered: "border-forest bg-forest text-ivory",
};

export function StageBadge({
  stage,
  label,
  className,
}: {
  stage: RescueStage;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.62rem] font-semibold tracking-[0.18em] uppercase",
        stageStyles[stage],
        className,
      )}
    >
      {label}
    </span>
  );
}

export function MetaLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("label-xs text-forest/45", className)}>{children}</span>
  );
}
