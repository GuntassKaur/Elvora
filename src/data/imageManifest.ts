// ============================================================
// ELVORA — Image Manifest v6 (FINAL STABILIZATION)
// ONE product = ONE image. No fake galleries. No mixing.
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

  // ── MEN'S KNITWEAR ──────────────────────────────────────
  "elv-11": ["/images/catalog/elv_11_mens_polo.jpg"],

  // ── ACCESSORIES ──────────────────────────────────────────
  "elv-14": ["https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  "elv-13": ["https://images.pexels.com/photos/6764787/pexels-photo-6764787.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  "elv-15": ["https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  "elv-16": ["https://images.pexels.com/photos/352586/pexels-photo-352586.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  "elv-17": ["https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  "elv-18": ["https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=1200"],

  // ── FOOTWEAR ─────────────────────────────────────────────
  "elv-19": ["https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  "elv-20": ["https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  "elv-21": ["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  "elv-22": ["https://images.pexels.com/photos/3974972/pexels-photo-3974972.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  "elv-23": ["https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  "elv-24": ["https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=1200"],

  // ── HERO & EDITORIAL ─────────────────────────────────────
  "hero-1": ["https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920"],
  "hero-footwear": ["https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=1920"],
};

export function getProductImages(productId: string): string[] {
  return imageManifest[productId] || [
    "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ];
}
