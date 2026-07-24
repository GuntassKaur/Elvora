import { createClient } from "./supabase/client";
import { CustomerRow } from "./database";

const supabase = createClient();

export interface CustomerPayload {
  fullName: string;
  email: string;
  phone?: string;
  authId?: string;
}

export async function getCustomerByAuthId(authId: string): Promise<CustomerRow | null> {
  try {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("auth_id", authId)
      .single();
    return data;
  } catch {
    return null;
  }
}

/**
 * Creates or retrieves a customer record in Supabase.
 * Returns the customer ID string, or null if database is unreachable.
 */
export async function createCustomer(payload: CustomerPayload): Promise<string | null> {
  try {
    if (payload.authId) {
      // Find existing customer
      const existing = await getCustomerByAuthId(payload.authId);
      if (existing) {
        // Update phone if provided
        if (payload.phone && payload.phone !== existing.phone) {
          await supabase.from("customers").update({ phone: payload.phone }).eq("id", existing.id);
        }
        return existing.id || null;
      }
    }

    const { data, error } = await supabase
      .from("customers")
      .insert({
        full_name: payload.fullName,
        email: payload.email,
        phone: payload.phone || null,
        auth_id: payload.authId || null,
      })
      .select("id")
      .single();

    if (error) {
      console.warn("Could not insert customer into Supabase:", error.message);
      return null;
    }

    return (data as CustomerRow)?.id || null;
  } catch (err) {
    console.warn("Exception while creating customer in Supabase:", err);
    return null;
  }
}
