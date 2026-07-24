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

  // ── MEN'S KNITWEAR ───────────────────────────────────────
  "elv-11": ["/images/catalog/elv_11_mens_polo.jpg"],

  // ── ACCESSORIES (Real product photography) ────────
  "elv-13": ["https://upload.wikimedia.org/wikipedia/commons/9/90/100%25_Kaschmir_Wolle_vonk_kaschmirprodukte.de.jpg"], // Scarf
  "elv-14": ["https://upload.wikimedia.org/wikipedia/commons/8/89/Totebag.jpg"], // Tote Bag
  "elv-15": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Silver_chain_%283%29.jpg/800px-Silver_chain_%283%29.jpg"], // Silver Chain
  "elv-16": ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/A_fedora_hat%2C_made_by_Borsalino.jpg/1280px-A_fedora_hat%2C_made_by_Borsalino.jpg"], // Fedora
  "elv-17": ["https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Touque-white.jpg/800px-Touque-white.jpg"], // Beanie
  "elv-18": ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Germany_Belt-and-Buckle-02.jpg/960px-Germany_Belt-and-Buckle-02.jpg"], // Belt

  // ── FOOTWEAR (Real product photography) ───────────
  "elv-19": ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Chelsea_boot%2C_black.jpg/960px-Chelsea_boot%2C_black.jpg"], // Chelsea Boots
  "elv-20": ["https://upload.wikimedia.org/wikipedia/commons/1/17/Loafers_being_worn.jpg"], // Loafer
  "elv-21": ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Sneakers.jpg/800px-Sneakers.jpg"], // Sneaker
  "elv-22": ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/A_pair_of_derby_shoes.jpg/800px-A_pair_of_derby_shoes.jpg"], // Derby
  "elv-23": ["https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Ankle_boots.jpg/800px-Ankle_boots.jpg"], // Ankle Boot
  "elv-24": ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Sandals.jpg/800px-Sandals.jpg"], // Sandals

  // ── HERO & EDITORIAL ─────────────────────────────────────
  "hero-1": ["https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1920&q=80"],
  "hero-footwear": ["https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1920&q=80"],
};

export function getProductImages(productId: string): string[] {
  return imageManifest[productId] || [
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
  ];
}
