import { RescueMap } from "@/components/RescueMap";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/animations/text";
import { useDemo } from "@/store/demo";

const facts = [
  { value: "24 min", label: "Average time to match a listing" },
  { value: "14 min", label: "Average time to accept a pickup" },
  { value: "3.2 km", label: "Average rescue route length" },
];

/** Section 08 on the landing page: the network as a place, not a list. */
export function MapSection() {
  const { listings } = useDemo();

  return (
    <section id="map" className="relative bg-forest py-24 text-ivory md:py-32">
      <div className="shell">
        <SectionHeading
          index="09"
          label="The network nearby"
          dark
          title={["Rescues happen", "in real streets."]}
          lede="Every listing carries a door to knock on and a kitchen waiting for it. This prototype map shows live listings, volunteers on route and the community kitchens receiving them."
        />

        <Reveal className="mt-14">
          <RescueMap />
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-ivory/12 bg-ivory/12 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-forest px-6 py-7">
              <p className="text-[1.6rem] leading-none font-extrabold tracking-[-0.04em]">
                {fact.value}
              </p>
              <p className="label-xs mt-3 text-ivory/45">{fact.label}</p>
            </div>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-6">
          <p className="text-[0.75rem] text-ivory/40">
            {listings.filter((item) => item.stage !== "delivered").length} live
            listings · prototype visualisation, not a live map feed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
