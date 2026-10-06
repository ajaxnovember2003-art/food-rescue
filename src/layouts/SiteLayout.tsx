import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MenuOverlay } from "@/components/MenuOverlay";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ScrollProgress";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

/** Routes whose opening viewport is a dark cinematic panel. */
const darkHeroRoutes = ["/", "/impact"];

export function SiteLayout() {
  const reduce = useReducedMotion();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useSmoothScroll(!reduce);

  const tone: "dark" | "light" = darkHeroRoutes.includes(location.pathname)
    ? "dark"
    : "light";

  useEffect(() => {
    if (!location.hash) return;
    const timeout = window.setTimeout(() => {
      const target = document.querySelector(location.hash);
      if (!target) return;
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (el: Element, o?: object) => void };
        }
      ).__lenis;
      if (lenis) lenis.scrollTo(target, { offset: -90 });
      else
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [location.hash, location.pathname, reduce]);

  return (
    <div className="relative min-h-screen bg-ivory">
      <LoadingScreen />
      <Cursor />
      <ScrollProgress />
      <Navbar tone={tone} onOpenMenu={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <PageTransition />
      <Footer />
    </div>
  );
}
