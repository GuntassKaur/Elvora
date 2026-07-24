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
  "elv-14": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Structured\nLeather\nTote&font=playfair-display"],
  "elv-13": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Wool\nBlend\nScarf&font=playfair-display"],
  "elv-15": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Sterling\nSilver\nChain&font=playfair-display"],
  "elv-16": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Wool\nFelt\nFedora&font=playfair-display"],
  "elv-17": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Ribbed\nKnit\nBeanie&font=playfair-display"],
  "elv-18": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Full-Grain\nLeather\nBelt&font=playfair-display"],

  // ── FOOTWEAR ─────────────────────────────────────────────
  "elv-19": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Leather\nChelsea\nBoots&font=playfair-display"],
  "elv-20": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Suede\nPenny\nLoafer&font=playfair-display"],
  "elv-21": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Clean\nCourt\nSneaker&font=playfair-display"],
  "elv-22": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Cap-Toe\nDerby\nShoe&font=playfair-display"],
  "elv-23": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Zip-Up\nAnkle\nBoot&font=playfair-display"],
  "elv-24": ["https://placehold.co/1200x1600/111111/FAF9F6?text=Leather\nSlide\nSandals&font=playfair-display"],

  // ── HERO & EDITORIAL ─────────────────────────────────────
  "hero-1": ["https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920"],
  "hero-footwear": ["https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=1920"],
};

export function getProductImages(productId: string): string[] {
  return imageManifest[productId] || [
    "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ];
}
