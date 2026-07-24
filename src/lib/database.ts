import { Product, Color } from "@/data/products";

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
 * Convert a Supabase ProductRow into the frontend Product interface
 */
export function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id || row.slug,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline || row.name,
    category: row.category as Product["category"],
    gender: (row.gender as Product["gender"]) || "unisex",
    brand: row.brand || "ELVORA",
    description: row.description,
    shortDescription: row.short_description || row.description,
    fullDescription: row.full_description || row.description,
    price: Number(row.price),
    originalPrice: Number(row.original_price || row.price),
    discountPercentage: Number(row.discount_percentage ?? 0),
    rating: Number(row.rating ?? 4.8),
    reviewCount: row.review_count ?? 12,
    stock: row.stock ?? 50,
    isFeatured: Boolean(row.featured),
    isNewArrival: Boolean(row.new_arrival),
    isTrending: Boolean(row.trending),
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    materials: Array.isArray(row.materials) ? row.materials : ["100% Organic Fabric"],
    images: Array.isArray(row.images) ? row.images : [],
    details: Array.isArray(row.details)
      ? row.details
      : [
          "100% Premium Sustainable Fabric",
          "Tailored Fit & Superior Craftsmanship",
          "Designed for Comfort and Elegance",
        ],
    careInstructions: Array.isArray(row.care_instructions)
      ? row.care_instructions
      : ["Dry clean only", "Do not tumble dry"],
    tags: Array.isArray(row.tags) ? row.tags : [row.category],
  };
}
