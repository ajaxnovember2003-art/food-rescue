import { ImagePlus, Info, PartyPopper, X } from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { FoodImage } from "@/components/FoodImage";
import { photoAt } from "@/data/photos";
import { PageHero } from "@/components/PageHero";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { EASE, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { todayISO } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useDemo } from "@/store/demo";
import type { DonationDraft, FoodCategory } from "@/types";

const categories: Array<{ id: FoodCategory; label: string }> = [
  { id: "meals", label: "Meals" },
  { id: "bakery", label: "Bakery" },
  { id: "fruits", label: "Fruits" },
  { id: "vegetables", label: "Vegetables" },
  { id: "packaged", label: "Packaged" },
];

const storages: DonationDraft["storage"][] = [
  "Room temperature",
  "Refrigerated",
  "Frozen",
  "Hot holding",
];

const emptyDraft: DonationDraft = {
  foodName: "",
  category: "meals",
  quantity: "",
  servings: 40,
  preparedTime: todayISO(1),
  safeUntil: todayISO(4),
  storage: "Refrigerated",
  pickupLocation: "",
  pickupWindow: "18:00 – 20:00",
  notes: "",
};

function Field({
  label,
  hint,
  children,
  error,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={cn("group relative", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="label-xs text-forest/45">{label}</span>
        {hint ? <span className="text-[0.7rem] text-forest/35">{hint}</span> : null}
      </div>
      <div className="relative mt-3">
        {children}
        <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100" />
      </div>
      {error ? (
        <p className="mt-2 text-[0.72rem] text-urgent">{error}</p>
      ) : null}
    </div>
  );
}

const inputClass =
  "w-full border-b border-forest/20 bg-transparent pb-3 text-[1.02rem] text-forest outline-none transition-colors duration-300 placeholder:text-forest/30 focus:border-forest/50";

export default function Donate() {
  const { donate } = useDemo();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<DonationDraft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<{ name: string; size: number } | null>(null);
  const [result, setResult] = useState<{ code: string; id: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // The form and the confirmation share one slot; whichever is showing fades
  // in from the direction it arrives from.
  useIsoLayoutEffect(() => {
    const el = viewRef.current;
    if (!el || reduce) return;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: result ? 24 : 0 },
      { opacity: 1, y: 0, duration: result ? 0.8 : 0.5, ease: EASE },
    );
    return () => {
      tween.kill();
    };
  }, [result, reduce]);

  const set = <Key extends keyof DonationDraft>(
    key: Key,
    value: DonationDraft[Key],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const totalKg = useMemo(
    () => Math.max(2, Math.round(draft.servings * 0.28)),
    [draft.servings],
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!draft.foodName.trim()) next.foodName = "Give the food a name.";
    if (!draft.pickupLocation.trim())
      next.pickupLocation = "Where should the volunteer collect it?";
    if (!draft.servings || draft.servings < 1)
      next.servings = "At least one serving is required.";
    if (!draft.safeUntil) next.safeUntil = "Set the safe-until time.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Some details are missing", {
        description: "Check the highlighted fields and try again.",
      });
      return;
    }
    const code = donate(draft);
    setResult({ code, id: code.toLowerCase() });
    toast.success("Food listed for rescue", {
      description: `${draft.foodName} is now part of the rescue network.`,
    });
  };

  const reset = () => {
    setDraft(emptyDraft);
    setImage(null);
    setErrors({});
    setResult(null);
  };

  return (
    <>
      <PageHero
        index="—"
        label="Donate food"
        title={["List surplus", "in under a minute."]}
        lede="Tell us what is left, how long it stays safe and where to collect it. A verified volunteer is matched the moment you publish."
      />

      <section className="bg-ivory pb-28">
        <div className="shell">
          <div ref={viewRef}>
            {result ? (
              <div className="relative overflow-hidden rounded-sm border border-forest bg-forest px-6 py-16 text-ivory sm:px-12 sm:py-20">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(60% 50% at 50% 0%, rgba(226,112,58,0.22), transparent 70%)",
                  }}
                />
                <div className="relative max-w-3xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-3 py-1.5">
                    <PartyPopper className="size-3.5 text-ember" />
                    <span className="label-xs text-ivory/70">
                      Donation {result.code}
                    </span>
                  </span>
                  <h2 className="display-lg mt-8">
                    Your food is now part of the rescue network.
                  </h2>
                  <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-ivory/70">
                    {draft.foodName} · {draft.servings} servings ·{" "}
                    {draft.quantity || `${totalKg} kg`} is live in the
                    marketplace. Nearby volunteers can see it immediately, and
                    the impact counters update the moment it is delivered.
                  </p>

                  <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-ivory/15 bg-ivory/15 sm:grid-cols-3">
                    {[
                      { label: "Reference", value: result.code },
                      { label: "Safe until", value: draft.safeUntil.slice(11) || "22:00" },
                      { label: "Pickup", value: draft.pickupLocation },
                    ].map((item) => (
                      <div key={item.label} className="bg-forest-deep px-5 py-5">
                        <p className="label-xs text-ivory/45">{item.label}</p>
                        <p className="mt-2 text-[0.9rem] font-semibold break-words">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-wrap gap-4">
                    <MagneticButton
                      variant="ember"
                      onClick={() => navigate(`/rescue/${result.id}`)}
                    >
                      View live listing
                    </MagneticButton>
                    <MagneticButton
                      variant="outline"
                      className="border-ivory/30 text-ivory hover:border-ivory/70"
                      onClick={() => navigate("/volunteer")}
                    >
                      Follow the pickup
                    </MagneticButton>
                    <button
                      type="button"
                      onClick={reset}
                      data-cursor="hover"
                      className="text-[0.68rem] font-semibold tracking-[0.18em] text-ivory/60 uppercase underline-offset-4 transition-colors hover:text-ivory hover:underline"
                    >
                      List another donation
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="grid gap-12 lg:grid-cols-12 lg:gap-10"
                noValidate
              >
                <div className="lg:col-span-7">
                  <div className="space-y-10">
                    <Field
                      label="What food is it?"
                      hint="Required"
                      error={errors.foodName}
                    >
                      <input
                        value={draft.foodName}
                        onChange={(event) => set("foodName", event.target.value)}
                        placeholder="Vegetable rice bowls"
                        className={inputClass}
                        aria-label="Food name"
                      />
                    </Field>

                    <div className="group">
                      <span className="label-xs text-forest/45">Category</span>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {categories.map((category) => {
                          const active = draft.category === category.id;
                          return (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => set("category", category.id)}
                              aria-pressed={active}
                              data-cursor="hover"
                              className={cn(
                                "rounded-full border px-4 py-2 text-[0.68rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300",
                                active
                                  ? "border-forest bg-forest text-ivory"
                                  : "border-forest/18 text-forest/60 hover:border-forest/40",
                              )}
                            >
                              {category.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-10 sm:grid-cols-2">
                      <Field label="Quantity" hint="Trays, boxes, crates">
                        <input
                          value={draft.quantity}
                          onChange={(event) => set("quantity", event.target.value)}
                          placeholder="6 trays"
                          className={inputClass}
                          aria-label="Quantity"
                        />
                      </Field>
                      <Field label="Servings" error={errors.servings}>
                        <input
                          type="number"
                          min={1}
                          value={draft.servings}
                          onChange={(event) =>
                            set("servings", Number(event.target.value))
                          }
                          className={inputClass}
                          aria-label="Servings"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-10 sm:grid-cols-2">
                      <Field label="Prepared at">
                        <input
                          type="datetime-local"
                          value={draft.preparedTime}
                          onChange={(event) =>
                            set("preparedTime", event.target.value)
                          }
                          className={cn(inputClass, "text-[0.92rem]")}
                          aria-label="Prepared time"
                        />
                      </Field>
                      <Field label="Safe until" error={errors.safeUntil}>
                        <input
                          type="datetime-local"
                          value={draft.safeUntil}
                          onChange={(event) =>
                            set("safeUntil", event.target.value)
                          }
                          className={cn(inputClass, "text-[0.92rem]")}
                          aria-label="Safe until"
                        />
                      </Field>
                    </div>

                    <Field label="Storage condition">
                      <div className="flex flex-wrap gap-2">
                        {storages.map((storage) => {
                          const active = draft.storage === storage;
                          return (
                            <button
                              key={storage}
                              type="button"
                              onClick={() => set("storage", storage)}
                              aria-pressed={active}
                              data-cursor="hover"
                              className={cn(
                                "rounded-full border px-4 py-2 text-[0.68rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300",
                                active
                                  ? "border-ember bg-ember text-[#241007]"
                                  : "border-forest/18 text-forest/60 hover:border-forest/40",
                              )}
                            >
                              {storage}
                            </button>
                          );
                        })}
                      </div>
                    </Field>

                    <div className="grid gap-10 sm:grid-cols-2">
                      <Field
                        label="Pickup location"
                        error={errors.pickupLocation}
                      >
                        <input
                          value={draft.pickupLocation}
                          onChange={(event) =>
                            set("pickupLocation", event.target.value)
                          }
                          placeholder="Hotel GreenLeaf, Dock 4"
                          className={inputClass}
                          aria-label="Pickup location"
                        />
                      </Field>
                      <Field label="Pickup window">
                        <input
                          value={draft.pickupWindow}
                          onChange={(event) =>
                            set("pickupWindow", event.target.value)
                          }
                          className={inputClass}
                          aria-label="Pickup window"
                        />
                      </Field>
                    </div>

                    <Field label="Notes for the volunteer" hint="Optional">
                      <textarea
                        value={draft.notes}
                        onChange={(event) => set("notes", event.target.value)}
                        rows={3}
                        placeholder="Trays are sealed and still warm. Use the service entrance."
                        className={cn(inputClass, "resize-none")}
                        aria-label="Notes"
                      />
                    </Field>

                    <div>
                      <span className="label-xs text-forest/45">
                        Photo of the food
                      </span>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file)
                              setImage({ name: file.name, size: file.size });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          data-cursor="hover"
                          className="flex items-center gap-3 rounded-sm border border-dashed border-forest/25 px-5 py-4 text-left transition-colors duration-300 hover:border-forest/50"
                        >
                          <ImagePlus className="size-4 text-forest/50" />
                          <span>
                            <span className="block text-[0.85rem] font-medium text-forest">
                              {image ? image.name : "Add a photo"}
                            </span>
                            <span className="block text-[0.72rem] text-forest/45">
                              {image
                                ? `${Math.max(1, Math.round(image.size / 1024))} KB · ready to attach`
                                : "JPG or PNG · stays on your device"}
                            </span>
                          </span>
                        </button>
                        {image ? (
                          <button
                            type="button"
                            onClick={() => setImage(null)}
                            aria-label="Remove photo"
                            data-cursor="hover"
                            className="grid size-8 place-items-center rounded-full border border-forest/20 text-forest/60 transition-colors hover:border-forest/50"
                          >
                            <X className="size-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 border-t border-forest/12 pt-8">
                      <MagneticButton type="submit" cursorLabel="LIST">
                        List food for rescue
                      </MagneticButton>
                      <p className="max-w-xs text-[0.78rem] leading-relaxed text-forest/55">
                        Prototype submission — no data leaves your browser.
                      </p>
                    </div>
                  </div>
                </div>

                {/* live preview */}
                <div className="lg:col-span-5">
                  <div className="lg:sticky lg:top-28">
                    <div className="overflow-hidden rounded-sm border border-forest/12 bg-[#fffdf8]">
                      <div className="relative aspect-[16/11] overflow-hidden">
                        <FoodImage
                          photo={photoAt(draft.category, 0)}
                          category={draft.category}
                          hue={
                            categories.findIndex(
                              (item) => item.id === draft.category,
                            ) *
                              36 +
                            34
                          }
                          seed={draft.servings}
                          tint={0.12}
                          sizes="(max-width: 1024px) 92vw, 40vw"
                        />
                        <span className="absolute bottom-3 left-3 rounded-full border border-ivory/25 bg-forest-deep/50 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.16em] text-ivory uppercase backdrop-blur-sm">
                          Live preview
                        </span>
                      </div>
                      <div className="p-6">
                        <p className="text-[1.15rem] font-extrabold tracking-[-0.02em] text-forest uppercase">
                          {draft.foodName || "Your food listing"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.75rem] text-forest/60">
                          <span>{draft.servings || 0} servings</span>
                          <span>{totalKg} kg</span>
                          <span>{draft.storage}</span>
                        </div>
                        <div className="mt-5 space-y-2 border-t border-forest/12 pt-5 text-[0.78rem] text-forest/65">
                          <p className="flex items-center justify-between gap-4">
                            <span>Pickup</span>
                            <span className="text-right font-medium text-forest">
                              {draft.pickupLocation || "—"}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span>Window</span>
                            <span className="text-right font-medium text-forest">
                              {draft.pickupWindow || "—"}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span>Safe until</span>
                            <span className="text-right font-medium text-forest">
                              {draft.safeUntil ? draft.safeUntil.slice(11) : "—"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-sm border border-forest/12 bg-sand p-6">
                      <div className="flex items-start gap-3">
                        <Info className="mt-0.5 size-4 shrink-0 text-forest/50" />
                        <div>
                          <p className="label-xs text-forest/50">
                            What happens next
                          </p>
                          <ol className="mt-4 space-y-3 text-[0.82rem] leading-relaxed text-forest/70">
                            <li className="flex gap-3">
                              <span className="text-ember">01</span>
                              Nearby community kitchens see your listing
                              immediately.
                            </li>
                            <li className="flex gap-3">
                              <span className="text-ember">02</span>
                              A volunteer accepts and collects inside the safe
                              window.
                            </li>
                            <li className="flex gap-3">
                              <span className="text-ember">03</span>
                              Delivery is confirmed and the meals are counted as
                              impact.
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
