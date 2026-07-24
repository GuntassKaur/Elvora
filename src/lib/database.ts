import { Product, Color, products as localProducts } from "@/data/products";
import { getProductImages } from "@/data/imageManifest";

// Database row definition for Products Table
export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  category: string;
  gender?: string | null;
  brand?: string | null;
  description: string;
  short_description?: string | null;
  full_description?: string | null;
  price: number;
  original_price?: number | null;
  discount_percentage?: number | null;
  stock: number;
  rating: number;
  review_count: number;
  colors: Color[];
  sizes: string[];
  materials?: string[] | null;
  details?: string[] | null;
  care_instructions?: string[] | null;
  tags?: string[] | null;
  images: string[];
  featured?: boolean | null;
  new_arrival?: boolean | null;
  trending?: boolean | null;
  created_at?: string;
}

// Database row definition for Customers Table
export interface CustomerRow {
  id?: string;
  auth_id?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  created_at?: string;
}

// Shipping Address JSON structure inside Orders Table
export interface ShippingAddressJson {
  fullName: string;
  email?: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

// Order Item JSON structure inside Orders Table
export interface OrderItemJson {
  productId: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image?: string;
}

// Database row definition for Orders Table
export interface OrderRow {
  id?: string;
  order_id: string;
  customer_id?: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  payment_status: string;
  shipping_address: ShippingAddressJson;
  order_items: OrderItemJson[];
  created_at?: string;
}

/**
 * Convert a Supabase ProductRow into the frontend Product interface,
 * guaranteeing 100% category, gender, title, and image alignment.
 */
export function mapRowToProduct(row: ProductRow): Product {
  const localMatch = localProducts.find((p) => p.id === row.id || p.slug === row.slug);
  const manifestImages = getProductImages(row.id || row.slug);

  return {
    id: row.id || row.slug,
    slug: row.slug,
    name: localMatch?.name || row.name,
    tagline: row.tagline || localMatch?.tagline || row.name,
    category: (localMatch?.category || row.category) as Product["category"],
    gender: (localMatch?.gender || row.gender) as Product["gender"] || "unisex",
    brand: row.brand || "ELVORA",
    description: row.description || localMatch?.description || "",
    shortDescription: row.short_description || localMatch?.shortDescription || row.description,
    fullDescription: row.full_description || localMatch?.fullDescription || row.description,
    price: Number(row.price || localMatch?.price || 0),
    originalPrice: Number(row.original_price || localMatch?.originalPrice || row.price),
    discountPercentage: Number(row.discount_percentage ?? localMatch?.discountPercentage ?? 0),
    rating: Number(row.rating ?? localMatch?.rating ?? 4.8),
    reviewCount: row.review_count ?? localMatch?.reviewCount ?? 12,
    stock: row.stock ?? localMatch?.stock ?? 50,
    isFeatured: Boolean(row.featured ?? localMatch?.isFeatured),
    isNewArrival: Boolean(row.new_arrival ?? localMatch?.isNewArrival),
    isTrending: Boolean(row.trending ?? localMatch?.isTrending),
    colors: Array.isArray(row.colors) && row.colors.length > 0 ? row.colors : (localMatch?.colors || []),
    sizes: Array.isArray(row.sizes) && row.sizes.length > 0 ? row.sizes : (localMatch?.sizes || []),
    materials: Array.isArray(row.materials) ? row.materials : (localMatch?.materials || ["100% Organic Fabric"]),
    images: manifestImages && manifestImages.length > 0 ? manifestImages : (Array.isArray(row.images) ? row.images : []),
    details: Array.isArray(row.details) ? row.details : (localMatch?.details || []),
    careInstructions: Array.isArray(row.care_instructions) ? row.care_instructions : (localMatch?.careInstructions || []),
    tags: Array.isArray(row.tags) ? row.tags : (localMatch?.tags || [row.category]),
  };
}
