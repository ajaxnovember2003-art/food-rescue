import type { FoodCategory } from "@/types";

export interface FoodPhoto {
  src: string;
  alt: string;
  credit: string;
}

/**
 * Real photography for the prototype.
 *
 * Every URL below was verified to resolve (200, image bytes) before being
 * committed. All of it is CC0 / public domain, so the site can ship it without
 * a licence obligation — the footer still credits each source.
 */
export const foodPhotos: Record<FoodCategory, FoodPhoto[]> = {
  meals: [
    {
      src: "https://pd.w.org/2026/03/8369c4ba635b52f2.33735161-1024x768.jpg",
      alt: "Hot meal served in a bowl, ready to be rescued",
      credit: "Mohammed Kateregga · WP Photo Directory · CC0",
    },
    {
      src: "https://pd.w.org/2024/03/97665fa48fce13fe9.83386297-1024x688.jpg",
      alt: "Full plated meal with rice, curries and sides",
      credit: "Ajith R N · WP Photo Directory · CC0",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hoedeopbap_%28raw_fish_rice_bowl%29.jpg/1280px-Hoedeopbap_%28raw_fish_rice_bowl%29.jpg",
      alt: "Rice bowl with fresh toppings",
      credit: "Wikimedia Commons · CC0",
    },
  ],
  bakery: [
    {
      src: "https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdXB3azYxNjYwMjk5LXdpa2ltZWRpYS1pbWFnZS1rb3diMW16Zy5qcGc.jpg",
      alt: "Baskets of artisan loaves and baguettes",
      credit: "Rawpixel · CC0",
    },
    {
      src: "https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvYTAxOS1qYWt1YmstMDg5OC1jcm9pc3NhbnRzLWluLWEtY2FmZS5qcGc.jpg",
      alt: "Tray of croissants on a bakery counter",
      credit: "Rawpixel · CC0",
    },
  ],
  fruits: [
    {
      src: "https://pd.w.org/2023/07/39964bd3dfecf0138.01987985-1024x683.jpg",
      alt: "Crate of fresh oranges",
      credit: "Nilo Velez · WP Photo Directory · CC0",
    },
    {
      src: "https://pd.w.org/2024/07/524669fa10283a6f3.66046003-1024x527.jpg",
      alt: "Market stall piled with ripe bananas",
      credit: "aayushpranay · WP Photo Directory · CC0",
    },
    {
      src: "https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQxOS0zLTQ2MDAzYS5qcGc.jpg",
      alt: "Apples graded into harvest crates",
      credit: "Carol M. Highsmith · Rawpixel · CC0",
    },
  ],
  vegetables: [
    {
      src: "https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcHUyMzMzNDE0LWltYWdlLWt3eXJyYXZ4LmpwZw.jpg",
      alt: "Basket of fresh market vegetables",
      credit: "Rawpixel · CC0",
    },
    {
      src: "https://images.rawpixel.com/editor_1024/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEyL2ZsNTIwMDgzNjMyNDUtaW1hZ2UuanBn.jpg",
      alt: "Melons stacked in produce crates",
      credit: "Rawpixel · CC0",
    },
  ],
  packaged: [
    {
      src: "https://pd.w.org/2025/01/259678bae96db67a5.43184726-1024x683.jpg",
      alt: "Supermarket shelves of sealed packaged food",
      credit: "WP Photo Directory · CC0",
    },
    {
      src: "https://images.rawpixel.com/image_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L2ZsNDI4MzExMTA0ODAtcHVibGljLWltYWdlLWtvd3NnMHc4LmpwZw.jpg",
      alt: "Surplus food packed and prepared for distribution",
      credit: "Rawpixel · CC0",
    },
  ],
};

/** Wide editorial image used by the donate band. */
export const heroPhoto: FoodPhoto = foodPhotos.meals[0];

/** Volunteers handling rescued food — used as a human band on the landing page. */
export const communityPhoto: FoodPhoto = {
  src: "https://images.rawpixel.com/editor_1024/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAzL2ZsNTI1MTk3MzA4ODYtaW1hZ2UuanBn.jpg",
  alt: "Volunteers packing rescued food into boxes",
  credit: "Rawpixel · CC0",
};

function hashId(text: string) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % 9973;
  }
  return hash;
}

/** Stable photo per listing id, so a listing never changes its picture. */
export function photoFor(id: string, category: FoodCategory): FoodPhoto {
  const set = foodPhotos[category] ?? foodPhotos.meals;
  return set[hashId(id) % set.length];
}

/** Positional picker for section layouts. */
export function photoAt(category: FoodCategory, index: number): FoodPhoto {
  const set = foodPhotos[category] ?? foodPhotos.meals;
  return set[index % set.length];
}

export const photoCredits = [
  { label: "WP Photo Directory", href: "https://wordpress.org/photos/" },
  { label: "Rawpixel", href: "https://www.rawpixel.com/" },
  { label: "Wikimedia Commons", href: "https://commons.wikimedia.org/" },
  { label: "StockSnap", href: "https://stocksnap.io/" },
];
