import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  impactBaseline,
  listings as seedListings,
  notificationSeed,
  personalImpactBaseline,
} from "@/data/mock";
import type {
  DonationDraft,
  FoodListing,
  ImpactStats,
  NotificationItem,
  PersonalImpact,
  RescueStage,
} from "@/types";

export const stageOrder: RescueStage[] = [
  "listed",
  "claimed",
  "picked_up",
  "delivered",
];

const stageLabel: Record<RescueStage, string> = {
  listed: "Listed",
  claimed: "Claimed",
  picked_up: "Picked up",
  delivered: "Delivered",
};

interface ImpactDelta {
  meals: number;
  kg: number;
  at: number;
}

interface DemoState {
  listings: FoodListing[];
  stats: ImpactStats;
  personal: PersonalImpact;
  notifications: NotificationItem[];
  /** Most recent impact increase, kept so the UI can celebrate it. */
  lastDelta: ImpactDelta | null;
  rescuesThisSession: number;
}

interface DemoContextValue extends DemoState {
  donate: (draft: DonationDraft) => string;
  advanceStage: (id: string, stage: RescueStage) => void;
  claimListing: (id: string) => void;
  activeMission: FoodListing | null;
  setMission: (id: string | null) => void;
  missionId: string | null;
  simulateRescue: () => void;
  resetImpact: () => void;
  populateSample: () => void;
  resetDemo: () => void;
  stageLabelFor: (stage: RescueStage) => string;
  dismissDelta: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function cloneSeed(): FoodListing[] {
  return seedListings.map((listing) => ({ ...listing }));
}

function makeId() {
  return Math.floor(1000 + Math.random() * 8999);
}

const initialState = (): DemoState => ({
  listings: cloneSeed(),
  stats: { ...impactBaseline },
  personal: { ...personalImpactBaseline },
  notifications: notificationSeed.map((item) => ({ ...item })),
  lastDelta: null,
  rescuesThisSession: 0,
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);
  const [missionId, setMissionId] = useState<string | null>("fr-2481");

  const pushNotification = useCallback(
    (item: Omit<NotificationItem, "id" | "time">) => {
      setState((prev) => ({
        ...prev,
        notifications: [
          { ...item, id: `n-${Date.now()}`, time: "just now" },
          ...prev.notifications,
        ].slice(0, 8),
      }));
    },
    [],
  );

  const donate = useCallback(
    (draft: DonationDraft) => {
      const id = `FR-${makeId()}`;
      const listing: FoodListing = {
        id: id.toLowerCase(),
        name: draft.foodName || "Surplus food listing",
        category: draft.category,
        donorId: "d-you",
        donorName: "Your kitchen",
        donorKind: "Restaurant",
        verified: true,
        servings: draft.servings || 0,
        weightKg: Math.max(2, Math.round((draft.servings || 0) * 0.28)),
        quantityLabel: draft.quantity || `${draft.servings || 0} servings`,
        distanceKm: 0.4,
        minutesLeft: 180,
        safeUntil: draft.safeUntil || "22:00",
        storage: draft.storage,
        pickupArea: draft.pickupLocation || "Your pickup address",
        pickupWindow: draft.pickupWindow || "next 3 hours",
        dropoff: "Hope Community Kitchen",
        notes: draft.notes || "Freshly listed from the FoodRescue donate flow.",
        stage: "listed",
        postedAt: "just now",
        coords: { x: 47, y: 45 },
        hue: 150,
      };

      setState((prev) => ({
        ...prev,
        listings: [listing, ...prev.listings],
        stats: {
          ...prev.stats,
          activeRescues: prev.stats.activeRescues + 1,
        },
      }));

      pushNotification({
        title: "Donation listed",
        detail: `${listing.name} · ${listing.servings} servings · ${id}`,
        kind: "success",
      });

      return id;
    },
    [pushNotification],
  );

  const advanceStage = useCallback(
    (id: string, stage: RescueStage) => {
      setState((prev) => {
        const listing = prev.listings.find((item) => item.id === id);
        if (!listing) return prev;

        const meals = listing.servings;
        const kg = listing.weightKg;

        if (stage === "delivered") {
          return {
            ...prev,
            listings: prev.listings.map((item) =>
              item.id === id ? { ...item, stage, minutesLeft: 0 } : item,
            ),
            stats: {
              ...prev.stats,
              mealsRescued: prev.stats.mealsRescued + meals,
              foodDivertedKg: prev.stats.foodDivertedKg + kg,
              peopleSupported: prev.stats.peopleSupported + Math.round(meals * 0.62),
              co2AvoidedKg: prev.stats.co2AvoidedKg + Math.round(kg * 3),
            },
            personal: {
              ...prev.personal,
              mealsRescued: prev.personal.mealsRescued + meals,
              foodDivertedKg: prev.personal.foodDivertedKg + kg,
              deliveries: prev.personal.deliveries + 1,
              impactPoints: prev.personal.impactPoints + 12,
            },
            lastDelta: { meals, kg, at: Date.now() },
            rescuesThisSession: prev.rescuesThisSession + 1,
          };
        }

        return {
          ...prev,
          listings: prev.listings.map((item) =>
            item.id === id ? { ...item, stage } : item,
          ),
        };
      });

      const copy: Record<RescueStage, Omit<NotificationItem, "id" | "time">> = {
        listed: {
          title: "Listing reopened",
          detail: "The food is back in the rescue pool.",
          kind: "info",
        },
        claimed: {
          title: "Pickup assigned",
          detail: "You are now the rescue volunteer for this listing.",
          kind: "success",
        },
        picked_up: {
          title: "Pickup confirmed",
          detail: "Food collected. Cold chain checked at the donor door.",
          kind: "info",
        },
        delivered: {
          title: "Food delivered",
          detail: "Impact updated — the rescued meals are now counted.",
          kind: "success",
        },
      };
      if (stage !== "delivered") pushNotification(copy[stage]);
      else pushNotification(copy.delivered);
    },
    [pushNotification],
  );

  const claimListing = useCallback(
    (id: string) => {
      setMissionId(id);
      advanceStage(id, "claimed");
    },
    [advanceStage],
  );

  const simulateRescue = useCallback(() => {
    setState((prev) => {
      const next = prev.listings.find((item) => item.stage === "listed");
      if (!next) return prev;
      const meals = next.servings;
      const kg = next.weightKg;
      return {
        ...prev,
        listings: prev.listings.map((item) =>
          item.id === next.id ? { ...item, stage: "delivered" } : item,
        ),
        stats: {
          ...prev.stats,
          mealsRescued: prev.stats.mealsRescued + meals,
          foodDivertedKg: prev.stats.foodDivertedKg + kg,
          peopleSupported: prev.stats.peopleSupported + Math.round(meals * 0.62),
          co2AvoidedKg: prev.stats.co2AvoidedKg + Math.round(kg * 3),
        },
        lastDelta: { meals, kg, at: Date.now() },
        rescuesThisSession: prev.rescuesThisSession + 1,
      };
    });
    pushNotification({
      title: "Rescue simulated",
      detail: "A listing moved straight through to delivery. Impact updated.",
      kind: "success",
    });
  }, [pushNotification]);

  const resetImpact = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stats: { ...impactBaseline },
      personal: { ...personalImpactBaseline },
      lastDelta: null,
      rescuesThisSession: 0,
    }));
  }, []);

  const populateSample = useCallback(() => {
    setState((prev) => ({
      ...prev,
      listings: [
        ...cloneSeed().map((listing) => ({ ...listing })),
        ...prev.listings.filter(
          (listing) => !seedListings.some((seed) => seed.id === listing.id),
        ),
      ],
    }));
    pushNotification({
      title: "Sample data loaded",
      detail: "The marketplace is filled with fresh rescue opportunities.",
      kind: "info",
    });
  }, [pushNotification]);

  const resetDemo = useCallback(() => {
    setState(initialState());
    setMissionId("fr-2481");
  }, []);

  const dismissDelta = useCallback(() => {
    setState((prev) => ({ ...prev, lastDelta: null }));
  }, []);

  const activeMission = useMemo(
    () =>
      state.listings.find((listing) => listing.id === missionId) ??
      state.listings[0] ??
      null,
    [state.listings, missionId],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      donate,
      advanceStage,
      claimListing,
      activeMission,
      missionId,
      setMission: setMissionId,
      simulateRescue,
      resetImpact,
      populateSample,
      resetDemo,
      stageLabelFor: (stage) => stageLabel[stage],
      dismissDelta,
    }),
    [
      state,
      donate,
      advanceStage,
      claimListing,
      activeMission,
      missionId,
      simulateRescue,
      resetImpact,
      populateSample,
      resetDemo,
      dismissDelta,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used inside a DemoProvider");
  }
  return context;
}
