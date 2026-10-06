export type FoodCategory =
  | "meals"
  | "bakery"
  | "fruits"
  | "vegetables"
  | "packaged";

export type Urgency = "fresh" | "soon" | "urgent";

export type RescueStage = "listed" | "claimed" | "picked_up" | "delivered";

export interface Donor {
  id: string;
  name: string;
  kind: "Hotel" | "Restaurant" | "Supermarket" | "Event" | "Individual";
  area: string;
  verified: boolean;
  rescues: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface FoodListing {
  id: string;
  name: string;
  category: FoodCategory;
  donorId: string;
  donorName: string;
  donorKind: Donor["kind"];
  verified: boolean;
  servings: number;
  weightKg: number;
  quantityLabel: string;
  distanceKm: number;
  /** Minutes left before the food is no longer safe to distribute. */
  minutesLeft: number;
  safeUntil: string;
  storage: "Room temperature" | "Refrigerated" | "Frozen" | "Hot holding";
  pickupArea: string;
  pickupWindow: string;
  dropoff: string;
  notes: string;
  stage: RescueStage;
  postedAt: string;
  coords: Coordinates;
  hue: number;
}

export interface Person {
  id: string;
  name: string;
  role: "Donor" | "Volunteer" | "Community kitchen" | "NGO";
  city: string;
  stat: string;
  badge?: "Rescue Champion" | "Community Hero" | "Top Donor";
  initials: string;
}

export interface ImpactStats {
  mealsRescued: number;
  foodDivertedKg: number;
  peopleSupported: number;
  activeVolunteers: number;
  activeRescues: number;
  co2AvoidedKg: number;
}

export interface PersonalImpact {
  mealsRescued: number;
  foodDivertedKg: number;
  deliveries: number;
  impactPoints: number;
  /** Rescue level 1–5, drives the ring visual. */
  level: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  kind: "success" | "info" | "urgent";
  time: string;
}

export interface RescueEvent {
  id: string;
  listingId: string;
  listingName: string;
  stage: RescueStage;
  at: string;
}

export interface DonationDraft {
  foodName: string;
  category: FoodCategory;
  quantity: string;
  servings: number;
  preparedTime: string;
  safeUntil: string;
  storage: FoodListing["storage"];
  pickupLocation: string;
  pickupWindow: string;
  notes: string;
}
