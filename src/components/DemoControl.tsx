import { useState } from "react";
import { RotateCcw, Sparkles, TrendingUp, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDemo } from "@/store/demo";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const actions = [
  {
    key: "sample",
    label: "Populate sample data",
    detail: "Refill the marketplace with the full rescue pool.",
    icon: Sparkles,
  },
  {
    key: "simulate",
    label: "Simulate a rescue",
    detail: "Push one listing straight through pickup to delivery.",
    icon: Zap,
  },
  {
    key: "impact",
    label: "Reset impact",
    detail: "Return the counters to their starting values.",
    icon: TrendingUp,
  },
  {
    key: "reset",
    label: "Reset demo",
    detail: "Clear every change made in this session.",
    icon: RotateCcw,
  },
] as const;

/**
 * Judge/developer controls. Deliberately quiet — a text link in the footer
 * rather than anything that competes with the product surface.
 */
export function DemoControl({ className }: { className?: string }) {
  const {
    stats,
    rescuesThisSession,
    populateSample,
    simulateRescue,
    resetImpact,
    resetDemo,
  } = useDemo();
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const run = (key: (typeof actions)[number]["key"]) => {
    if (key === "sample") populateSample();
    if (key === "simulate") simulateRescue();
    if (key === "impact") resetImpact();
    if (key === "reset") resetDemo();
    setFlash(key);
    window.setTimeout(() => setFlash(null), 1200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          data-cursor="hover"
          className={cn(
            "label-xs text-ivory/45 underline-offset-4 transition-colors hover:text-ember hover:underline",
            className,
          )}
        >
          Demo controls
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg border-forest/15 bg-ivory text-forest">
        <DialogHeader>
          <DialogTitle className="display-md">Demo controls</DialogTitle>
          <DialogDescription className="text-forest/60">
            This prototype runs entirely on frontend state. Anything you change
            here only lives in this session.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            const active = flash === action.key;
            return (
              <button
                key={action.key}
                type="button"
                onClick={() => run(action.key)}
                data-cursor="hover"
                className="group flex items-center gap-4 rounded-sm border border-forest/12 bg-white/60 px-4 py-3 text-left transition-colors duration-300 hover:border-forest/30"
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                    active
                      ? "border-ember bg-ember text-[#241007]"
                      : "border-forest/15 text-forest/70 group-hover:border-forest/40",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.82rem] font-semibold">
                    {action.label}
                  </span>
                  <span className="block text-[0.75rem] text-forest/55">
                    {action.detail}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-forest/12 pt-4 text-[0.75rem] text-forest/60">
          <span>Rescues completed this session: {rescuesThisSession}</span>
          <span>Meals now: {formatNumber(stats.mealsRescued)}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
