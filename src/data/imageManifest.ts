// ============================================================
// ELVORA — Image Manifest v7 (FINAL REDESIGN)
// ONE product = ONE image. No text placeholders. Real images.
// ============================================================

export const imageManifest: Record<string, string[]> = {
  // ── WOMEN'S OUTERWEAR ──────────────────────────────────────
  "elv-01": ["/images/catalog/elv_01_trench_coat.jpg"],
  "elv-04": ["/images/catalog/elv_04_cocoon_coat.jpg"],

  // ── WOMEN'S KNITWEAR ──────────────────────────────────────
  "elv-02": ["/images/catalog/elv_02_ribbed_sweater.jpg"],
  "elv-11b": ["/images/catalog/elv_11b_womens_cardigan.jpg"],

  // ── WOMEN'S TAILORING ──────────────────────────────────────
  "elv-03": ["/images/catalog/elv_03_slip_dress.jpg"],
  "elv-05": ["/images/catalog/elv_05_linen_blazer.jpg"],
  "elv-06": ["/images/catalog/elv_06_silk_shirt.jpg"],

  // ── MEN'S TAILORING ──────────────────────────────────────
  "elv-07": ["/images/catalog/elv_07_mens_suit.jpg"],
  "elv-09": ["/images/catalog/elv_09_mens_trousers.jpg"],

  // ── MEN'S OUTERWEAR ──────────────────────────────────────
  "elv-08": ["/images/catalog/elv_08_mens_bomber.jpg"],
  "elv-10": ["/images/catalog/elv_10_mens_utility_jacket.jpg"],
  "elv-12": ["/images/catalog/elv_12_mens_denim_jacket.jpg"],

  // ── ACCESSORIES (Real Unsplash Product Photography) ────────
  "elv-13": ["https://images.unsplash.com/photo-1520699049698-b2fa6c519447?auto=format&fit=crop&w=1200&q=80"], // Scarf
  "elv-14": ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80"], // Tote Bag
  "elv-15": ["https://images.unsplash.com/photo-1599643478524-41bec2962a69?auto=format&fit=crop&w=1200&q=80"], // Silver Chain
  "elv-16": ["https://images.unsplash.com/photo-1521369909029-2afed882ba54?auto=format&fit=crop&w=1200&q=80"], // Fedora
  "elv-17": ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1200&q=80"], // Beanie
  "elv-18": ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1200&q=80"], // Belt

  // ── FOOTWEAR (Real Unsplash Product Photography) ───────────
  "elv-19": ["https://images.unsplash.com/photo-1603483980313-176c7c64c740?auto=format&fit=crop&w=1200&q=80"], // Chelsea Boots
  "elv-20": ["https://images.unsplash.com/photo-1534260933201-acfaee3017ee?auto=format&fit=crop&w=1200&q=80"], // Loafer
  "elv-21": ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80"], // Sneaker
  "elv-22": ["https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80"], // Derby
  "elv-23": ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80"], // Ankle Boot
  "elv-24": ["https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&q=80"], // Sandals

  // ── HERO & EDITORIAL ─────────────────────────────────────
  "hero-1": ["https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920"],
  "hero-footwear": ["https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=1920"],
};

export function getProductImages(productId: string): string[] {
  return imageManifest[productId] || [
    "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ];
}
