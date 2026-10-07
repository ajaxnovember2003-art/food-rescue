import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { Logo } from "@/components/Logo";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { primaryNav } from "@/data/nav";
import { cn } from "@/lib/utils";

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
  const headerRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entrance: the bar drops in once, before the first paint.
  useIsoLayoutEffect(() => {
    const header = headerRef.current;
    if (!header || reduce) return;
    const ctx = gsap.context(() => {
      gsap.from(header, {
        y: -24,
        opacity: 0,
        duration: 0.9,
        ease: EASE,
        delay: 0.15,
        clearProps: "transform,opacity",
      });
    }, header);
    return () => ctx.revert();
  }, [reduce]);

  const overHero = !compact;
  const light = overHero && tone === "dark";

  return (
    <header ref={headerRef} className="fixed top-0 left-0 z-[70] w-full">
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
              <Link
                key={item.label}
                to={item.to}
                data-cursor="hover"
                className={cn(
                  "relative text-[0.72rem] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 hover:text-ember",
                  active && "text-ember",
                )}
              >
                {item.label}
              </Link>
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
    </header>
  );
}
