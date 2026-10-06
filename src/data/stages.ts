import type { RescueStage } from "@/types";

/** The four checkpoints every rescue passes through, in order. */
export const stageOrder: RescueStage[] = [
  "listed",
  "claimed",
  "picked_up",
  "delivered",
];

/** Human labels for each checkpoint. */
export const stageLabels: Record<RescueStage, string> = {
  listed: "Listed",
  claimed: "Claimed",
  picked_up: "Picked up",
  delivered: "Delivered",
};
