import { createClient } from "./supabase/client";
import { OrderRow, ShippingAddressJson, OrderItemJson } from "./database";

const supabase = createClient();

export interface CreateOrderPayload {
  orderId: string;
  customerId?: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  shippingAddress: ShippingAddressJson;
  orderItems: OrderItemJson[];
}

/**
 * Creates an order record in Supabase.
 * Returns boolean indicating success, or false if Supabase is unreachable.
 */
export async function createOrder(payload: CreateOrderPayload): Promise<boolean> {
  try {
    const { error } = await supabase.from("orders").insert({
      order_id: payload.orderId,
      customer_id: payload.customerId || null,
      subtotal: payload.subtotal,
      shipping: payload.shipping,
      total: payload.total,
      payment_method: payload.paymentMethod || "Secure Demo Payment",
      payment_status: payload.paymentStatus || "paid",
      shipping_address: payload.shippingAddress,
      order_items: payload.orderItems,
    });

    if (error) {
      console.warn("Could not insert order into Supabase:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("Exception while creating order in Supabase:", err);
    return false;
  }
}

/**
 * Retrieves an order by order_id from Supabase.
 */
export async function fetchOrderById(orderId: string): Promise<OrderRow | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (error || !data) return null;
    return data as OrderRow;
  } catch {
    return null;
  }
}
