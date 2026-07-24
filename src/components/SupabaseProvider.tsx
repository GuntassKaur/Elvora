"use client";

/**
 * SupabaseProvider
 *
 * Previously triggered useProductsStore.fetchProducts() which caused ALL products
 * to display the same fallback image (Supabase UUID IDs didn't match imageManifest keys).
 *
 * The product catalog now loads exclusively from the local catalog (products.ts).
 * This component is retained as a mount point for future auth-related effects.
 */
export default function SupabaseProvider() {
  return null;
}
