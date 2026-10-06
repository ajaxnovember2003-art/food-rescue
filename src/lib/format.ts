import type { Urgency } from "@/types";

export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", options).format(Math.round(value));
}

export function countdownLabel(minutes: number) {
  if (minutes <= 0) return "window closed";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins}m left`;
  return `${hours}h ${mins.toString().padStart(2, "0")}m left`;
}

export function urgencyFor(minutes: number): Urgency {
  if (minutes <= 60) return "urgent";
  if (minutes <= 180) return "soon";
  return "fresh";
}

export const urgencyMeta: Record<
  Urgency,
  { label: string; className: string; dot: string }
> = {
  urgent: {
    label: "Urgent rescue",
    className: "bg-urgent/12 text-urgent border-urgent/30",
    dot: "bg-urgent",
  },
  soon: {
    label: "Rescue soon",
    className: "bg-ember/12 text-ember border-ember/30",
    dot: "bg-ember",
  },
  fresh: {
    label: "Time to spare",
    className: "bg-forest/8 text-forest border-forest/20",
    dot: "bg-forest",
  },
};

export function todayISO(offsetHours = 3) {
  const date = new Date(Date.now() + offsetHours * 3600 * 1000);
  return date.toISOString().slice(0, 16);
}

export function mealToKg(servings: number) {
  return Math.round(servings * 0.28);
}
