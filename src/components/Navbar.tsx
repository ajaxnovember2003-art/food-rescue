import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";
import { Logo } from "@/components/Logo";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { primaryNav } from "@/data/nav";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/animations/text";

/**
 * Transparent over the hero, and — once the page moves — a compact floating
 * bar with a soft blur and a hairline border.
 */
export function Navbar({
  tone = "dark",
  onOpenMenu,
}: {
  tone?: "dark" | "light";
  onOpenMenu: () => void;
}) {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCompact(latest > 56);
  });

  const overHero = !compact;
  const light = overHero && tone === "dark";

  return (
    <motion.header
      className="fixed top-0 left-0 z-[70] w-full"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          compact
            ? "mt-3 w-[min(96%,1180px)] rounded-full border border-forest/10 bg-ivory/80 px-4 py-2.5 backdrop-blur-xl md:px-6"
            : "mt-0 w-full px-5 py-5 md:px-10 md:py-7",
        )}
      >
        <Logo tone={light ? "light" : "dark"} />

        <nav
          aria-label="Primary"
          className={cn(
            "hidden items-center gap-8 lg:flex",
            light ? "text-ivory/80" : "text-forest/70",
          )}
        >
          {primaryNav.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname.startsWith(item.to.split("#")[0]);
            return (
              <a
                key={item.label}
                href={item.to}
                data-cursor="hover"
                className={cn(
                  "relative text-[0.72rem] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 hover:text-ember",
                  active && "text-ember",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <MagneticButton
              to="/donate"
              size="sm"
              variant={light ? "light" : "primary"}
              cursorLabel="DONATE"
            >
              Donate Food
            </MagneticButton>
          </div>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className={cn(
              "grid size-10 place-items-center rounded-full border transition-colors duration-500 lg:hidden",
              light
                ? "border-ivory/25 text-ivory hover:bg-ivory/10"
                : "border-forest/15 text-forest hover:bg-forest/5",
            )}
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
