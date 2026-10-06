import { motion } from "framer-motion";
import {
  Bike,
  ClipboardList,
  LineChart,
  Route,
  type LucideIcon,
} from "lucide-react";
import { EASE } from "@/components/animations/text";
import { howItWorks } from "@/data/mock";

const icons: Record<string, LucideIcon> = {
  clipboard: ClipboardList,
  route: Route,
  bike: Bike,
  chart: LineChart,
};

/** The practical answer to "how does this actually work", kept deliberately short. */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-y border-forest/12 bg-sand py-20 md:py-24"
    >
      <div className="shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-xs text-forest/45">06 — How it works</span>
            <h2 className="display-md mt-5 max-w-xl text-forest">
              Four steps, and the food still gets eaten today.
            </h2>
          </div>
          <p className="max-w-sm text-[0.88rem] leading-relaxed text-forest/60">
            No storage, no overnight holding. If a listing cannot be collected
            inside its safe window, the network reroutes it or returns it to the
            donor's compost cycle.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="absolute top-6 right-0 left-0 h-px bg-forest/15" />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {howItWorks.map((step, index) => {
              const Icon = icons[step.icon] ?? ClipboardList;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-6% 0px" }}
                  transition={{ duration: 0.8, ease: EASE, delay: index * 0.08 }}
                  className="relative"
                >
                  <span className="relative z-10 grid size-12 place-items-center rounded-full border border-forest/20 bg-sand text-forest">
                    <Icon className="size-4" />
                  </span>
                  <span className="label-xs mt-6 block text-ember">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-[1.1rem] font-extrabold tracking-[-0.02em] text-forest uppercase">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-[0.85rem] leading-relaxed text-forest/65">
                    {step.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
