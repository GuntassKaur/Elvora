import { create } from "zustand";
import { products as localProducts, Product } from "@/data/products";

/**
 * Products store.
 *
 * The local catalog (products.ts + imageManifest.ts) is the SINGLE SOURCE OF TRUTH
 * for all product display data including images, names, categories, and genders.
 *
 * Supabase is NOT used for the product catalog listing — the Supabase fetch was
 * causing a critical bug where all products displayed the same fallback image
 * because Supabase row IDs (UUIDs) never matched the imageManifest keys (elv-01, etc.).
 *
 * Supabase is still used for: orders, customers, and authentication.
 */
interface ProductsState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>(() => ({
  // Immediately available — zero loading state, zero async, zero image corruption
  products: localProducts,
  isLoading: false,
  // No-op: local catalog is already loaded. Kept for API compatibility.
  fetchProducts: async () => {},
}));
