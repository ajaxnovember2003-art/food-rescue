import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { EASE } from "@/components/animations/text";
import { primaryNav, workspaceNav } from "@/data/nav";
import { useDemo } from "@/store/demo";
import { formatNumber } from "@/lib/format";

const panel = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.8, ease: EASE },
  },
  exit: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.6, ease: EASE, delay: 0.15 },
  },
};

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.24 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const item = {
  hidden: { y: "110%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: EASE } },
  exit: { y: "-40%", opacity: 0, transition: { duration: 0.4, ease: EASE } },
};

export function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { stats } = useDemo();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[120] overflow-y-auto bg-forest-deep text-ivory"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(70% 60% at 20% 0%, rgba(226,112,58,0.18), transparent 65%)",
            }}
          />
          <div className="relative flex min-h-full flex-col px-5 pt-5 pb-10 md:px-10">
            <div className="flex items-center justify-between">
              <Logo tone="light" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors hover:bg-ivory/10"
              >
                <X className="size-4" />
              </button>
            </div>

            <motion.nav
              variants={list}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-label="Mobile"
              className="mt-14 flex flex-1 flex-col justify-center gap-1"
            >
              {primaryNav.map((nav, index) => (
                <div key={nav.label} className="overflow-hidden py-1">
                  <motion.a
                    variants={item}
                    href={nav.to}
                    onClick={onClose}
                    className="group flex items-baseline gap-4 py-1"
                  >
                    <span className="w-8 text-[0.6rem] font-semibold tracking-[0.2em] text-ivory/35">
                      0{index + 1}
                    </span>
                    <span className="display-md text-ivory transition-colors duration-500 group-hover:text-ember">
                      {nav.label}
                    </span>
                    <ArrowUpRight className="size-5 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                  </motion.a>
                </div>
              ))}
            </motion.nav>

            <div className="mt-12 grid gap-8 border-t border-ivory/12 pt-8 md:grid-cols-2">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {workspaceNav.map((nav) => (
                  <a
                    key={nav.label}
                    href={nav.to}
                    onClick={onClose}
                    className="text-[0.72rem] font-semibold tracking-[0.16em] text-ivory/60 uppercase transition-colors hover:text-ember"
                  >
                    {nav.label}
                  </a>
                ))}
              </div>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="display-md text-ivory">
                    {formatNumber(stats.mealsRescued)}
                  </p>
                  <p className="label-xs mt-2 text-ivory/50">
                    Meals rescued this month
                  </p>
                </div>
                <MagneticButton
                  to="/donate"
                  variant="ember"
                  size="sm"
                  onClick={onClose}
                >
                  Donate food
                </MagneticButton>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
