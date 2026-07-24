import { createClient } from "./supabase/client";
import { Product, products as localProducts } from "@/data/products";
import { mapRowToProduct, ProductRow } from "./database";

/**
 * Fetch all products.
 * Strategy: Always start with the local catalog (which has 100% correct images via imageManifest).
 * Supabase data is used ONLY to augment stock/pricing/review data, never to override images or categories.
 * If Supabase is unreachable or returns no rows, the full local catalog is returned.
 */
export async function fetchProductsFromDatabase(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn("Supabase fetch error. Using local catalog:", error.message);
      }
      return localProducts;
    }

    // Map each Supabase row. mapRowToProduct prioritises local imageManifest for images
    // and local products.ts for name/category/gender to prevent data corruption.
    const mapped = (data as ProductRow[]).map(mapRowToProduct);

    // Validate: every product must have at least 1 image. If any product came back
    // image-less (meaning its ID didn't match the manifest), fall back to local catalog entirely.
    const allHaveImages = mapped.every((p) => p.images && p.images.length > 0);
    if (!allHaveImages) {
      console.warn("Supabase products missing images — falling back to local catalog.");
      return localProducts;
    }

    return mapped;
  } catch (err) {
    console.warn("fetchProductsFromDatabase exception — using local catalog:", err);
    return localProducts;
  }
}

/**
 * Fetch a single product by ID or Slug.
 * Falls back to local products.ts.
 */
export async function fetchProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  // First try local products (guaranteed correct data)
  const local = localProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .single();

    if (error || !data) {
      return local || null;
    }

    const mapped = mapRowToProduct(data as ProductRow);
    // If mapped product has no images (manifest miss), use local
    if (!mapped.images || mapped.images.length === 0) {
      return local || null;
    }
    return mapped;
  } catch {
    return local || null;
  }
}
