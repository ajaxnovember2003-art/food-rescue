import { Hero } from "@/sections/Hero";
import { HeroBridge } from "@/sections/HeroBridge";
import { Problem } from "@/sections/Problem";
import { BigStat } from "@/sections/BigStat";
import { RescueStory } from "@/sections/RescueStory";
import { HorizontalStory } from "@/sections/HorizontalStory";
import { HowItWorks } from "@/sections/HowItWorks";
import { Opportunities } from "@/sections/Opportunities";
import { DonateBand } from "@/sections/DonateBand";
import { MapSection } from "@/sections/MapSection";
import { ImpactSection } from "@/sections/ImpactSection";
import { CommunitySection } from "@/sections/CommunitySection";
import { FinalCTA } from "@/sections/FinalCTA";

/**
 * Landing page order is deliberately uneven: dark cinematic, light editorial,
 * warm, deep green — so no two neighbouring sections share a mood.
 */
export default function Landing() {
  return (
    <>
      <Hero />
      <HeroBridge />
      <Problem />
      <BigStat />
      <RescueStory />
      <HorizontalStory />
      <HowItWorks />
      <Opportunities />
      <DonateBand />
      <MapSection />
      <ImpactSection />
      <CommunitySection />
      <FinalCTA />
    </>
  );
}
