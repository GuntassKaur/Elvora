import { createClient } from "./supabase/client";

const supabase = createClient();
import { Product, products as localProducts } from "@/data/products";
import { ProductRow, mapRowToProduct } from "./database";

/**
 * Fetch all products from Supabase.
 * Automatically falls back to local products.ts dataset if Supabase is unreachable or unconfigured.
 */
export async function fetchProductsFromDatabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn("Supabase fetch returned an error. Using local fallback dataset:", error.message);
      }
      return localProducts;
    }

    return (data as ProductRow[]).map(mapRowToProduct);
  } catch (err) {
    console.warn("Error fetching products from database. Using local fallback dataset:", err);
    return localProducts;
  }
}

/**
 * Fetch a single product by ID or Slug from Supabase.
 * Falls back to local products.ts dataset.
 */
export async function fetchProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .single();

    if (error || !data) {
      const local = localProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
      return local || null;
    }

    return mapRowToProduct(data as ProductRow);
  } catch {
    const local = localProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    return local || null;
  }
}
