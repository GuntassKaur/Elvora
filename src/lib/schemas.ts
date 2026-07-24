import { z } from "zod";

// India-specific shipping schema
export const shippingSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  address: z.string().min(8, "Please enter your full delivery address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please select your state"),
  postalCode: z
    .string()
    .regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),
  country: z.string(),
});

export type ShippingData = z.infer<typeof shippingSchema>;

// Demo payment schema — not real Stripe
export const paymentSchema = z.object({
  cardName: z.string().min(3, "Enter the name as shown on your card"),
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^[0-9]{16}$/.test(val), "Card number must be 16 digits"),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry must be MM/YY format")
    .refine((val) => {
      const [mm, yy] = val.split("/");
      const month = parseInt(mm, 10);
      const year = parseInt("20" + yy, 10);
      const now = new Date();
      if (year < now.getFullYear()) return false;
      if (year === now.getFullYear() && month < now.getMonth() + 1) return false;
      return true;
    }, "This card has expired"),
  cardCvv: z.string().regex(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
});

export type PaymentData = z.infer<typeof paymentSchema>;

export const checkoutSchema = shippingSchema.and(paymentSchema);
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
