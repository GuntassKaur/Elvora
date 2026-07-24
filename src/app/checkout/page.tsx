"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "@/lib/schemas";
import {
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { createCustomer } from "@/lib/customers";
import { createOrder } from "@/lib/orders";

const generateRandom = () => Math.random();

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh", "Puducherry",
];

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-900">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[10px] text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (hasError?: boolean) =>
  `w-full bg-[#F4F3EF] border py-3 px-4 text-sm focus:outline-none focus:border-black transition-colors ${
    hasError ? "border-red-500" : "border-zinc-200"
  }`;

function getCardBrand(num: string): string {
  const n = num.replace(/\s/g, "");
  if (n.startsWith("4")) return "VISA";
  if (/^5[1-5]/.test(n)) return "MASTERCARD";
  if (/^3[47]/.test(n)) return "AMEX";
  if (/^(60|65|81|82)/.test(n)) return "RUPAY";
  return "";
}

function formatCardDisplay(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

const PROCESSING_STAGES = [
  { label: "Verifying secure connection...", Icon: Lock },
  { label: "Processing payment...", Icon: Loader2 },
  { label: "Creating your order...", Icon: Check },
];

type Step = "details" | "payment" | "processing" | "failed";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const setShippingInfo = useCartStore((state) => state.setShippingInfo);
  const setPaymentInfo = useCartStore((state) => state.setPaymentInfo);
  const setOrderSnapshot = useCartStore((state) => state.setOrderSnapshot);
  const addToast = useCartStore((state) => state.addToast);

  const [step, setStep] = useState<Step>("details");
  const [cvvFocused, setCvvFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [authId, setAuthId] = useState<string | null>(null);
  
  const supabase = createClient();

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shippingFee;

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: { country: "India" },
  });

  const watchCardNumber = useWatch({ control, name: "cardNumber" }) || "";
  const watchCardName = useWatch({ control, name: "cardName" }) || "";
  const watchCardExpiry = useWatch({ control, name: "cardExpiry" }) || "";
  const watchCardCvv = useWatch({ control, name: "cardCvv" }) || "";

  // Redirect to shop if cart is empty (not during processing/failed)
  useEffect(() => {
    if (cart.length === 0 && step !== "processing" && step !== "failed") {
      router.replace("/shop");
    }
  }, [cart, step, router]);

  // Pre-fill user data if authenticated
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/checkout");
        return;
      }

      if (session?.user) {
        setAuthId(session.user.id);
        
        // Try fetching customer record
        const { data: customer } = await supabase
          .from("customers")
          .select("*")
          .eq("auth_id", session.user.id)
          .maybeSingle();
          
        if (customer) {
          setValue("fullName", customer.full_name);
          setValue("email", customer.email);
          if (customer.phone) setValue("phone", customer.phone);
        } else {
          // Fallback to user metadata
          setValue("email", session.user.email || "");
          setValue("fullName", session.user.user_metadata?.full_name || "");
        }
      }
    };
    fetchUser();
  }, [supabase, setValue, router]);

  // Processing animation stages
  useEffect(() => {
    if (step !== "processing") return;
    const t0 = setTimeout(() => setProcessingStage(0), 0);
    const t1 = setTimeout(() => setProcessingStage(1), 1000);
    const t2 = setTimeout(() => setProcessingStage(2), 2000);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [step]);

  const handleProceedToPayment = async () => {
    const valid = await trigger([
      "fullName", "email", "phone", "address", "city", "state", "postalCode",
    ]);
    if (valid) {
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      addToast("Please fix the errors above before continuing.", "error");
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (submitting) return;
    setSubmitting(true);
    setStep("processing");

    setShippingInfo({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: "India",
    });
    setPaymentInfo({
      cardName: data.cardName,
      cardNumber: data.cardNumber,
      cardExpiry: data.cardExpiry,
      cardCvv: data.cardCvv,
    });

    // Build order details
    const orderId = `ELV-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${
      Math.floor(10000 + generateRandom() * 90000)
    }`;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const deliveryDateStr = deliveryDate.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const paymentTimestamp = new Date().toISOString();
    const shippingAddressStr = `${data.address}, ${data.city}, ${data.state} ${data.postalCode}, India`;

    // Wait for 3-second processing animation to finish
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate ~8% random failure
    if (generateRandom() < 0.08) {
      setStep("failed");
      setSubmitting(false);
      return;
    }

    // Save Customer and Order to Supabase Database (with graceful local fallback)
    const customerId = await createCustomer({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      authId: authId || undefined,
    });

    await createOrder({
      orderId,
      customerId,
      subtotal,
      shipping: shippingFee,
      total,
      paymentMethod: "Secure Demo Payment",
      paymentStatus: "paid",
      shippingAddress: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: "India",
      },
      orderItems: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        size: item.selectedSize,
        color: item.selectedColor.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0],
      })),
    });

    // Save snapshot in Zustand store (persisted in localStorage for UI receipt)
    const snapshot = {
      items: cart,
      subtotal,
      shippingFee,
      total,
      orderId,
      deliveryDate: deliveryDateStr,
      customerName: data.fullName,
      shippingAddress: shippingAddressStr,
      paymentTimestamp,
      paymentMethod: "Secure Demo Payment",
    };
    setOrderSnapshot(snapshot);

    clearCart();
    addToast("Payment successful! Redirecting to order confirmation...", "success");
    router.push("/success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 font-sans">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 mb-10">
        <nav className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium flex items-center gap-2 mb-3">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-zinc-900">Checkout</span>
        </nav>
        <h1 className="font-serif text-3xl font-normal text-zinc-900 tracking-wide">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* ── Form ── */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <AnimatePresence mode="wait">
              {/* STEP 1 — Shipping */}
              {step === "details" && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
                    <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold" aria-hidden="true">1</span>
                      Shipping Details
                    </h2>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Step 1 of 2</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" error={errors.fullName?.message}>
                      <input
                        type="text"
                        autoComplete="name"
                        {...register("fullName")}
                        className={inputCls(!!errors.fullName)}
                        placeholder="e.g. Priya Mehta"
                      />
                    </Field>

                    <Field label="Email Address" error={errors.email?.message}>
                      <input
                        type="email"
                        autoComplete="email"
                        {...register("email")}
                        className={inputCls(!!errors.email)}
                        placeholder="priya@example.com"
                      />
                    </Field>
                  </div>

                  <Field label="Mobile Number" error={errors.phone?.message}>
                    <input
                      type="tel"
                      autoComplete="tel"
                      {...register("phone")}
                      className={inputCls(!!errors.phone)}
                      placeholder="10-digit mobile number (e.g. 9876543210)"
                      maxLength={10}
                    />
                  </Field>

                  <Field label="Delivery Address" error={errors.address?.message}>
                    <input
                      type="text"
                      autoComplete="street-address"
                      {...register("address")}
                      className={inputCls(!!errors.address)}
                      placeholder="Flat no., building, street, area"
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="City" error={errors.city?.message}>
                      <input
                        type="text"
                        autoComplete="address-level2"
                        {...register("city")}
                        className={inputCls(!!errors.city)}
                        placeholder="e.g. Mumbai"
                      />
                    </Field>

                    <Field label="State" error={errors.state?.message}>
                      <select
                        autoComplete="address-level1"
                        {...register("state")}
                        className={inputCls(!!errors.state) + " cursor-pointer"}
                        defaultValue=""
                      >
                        <option value="" disabled>Select state</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="PIN Code" error={errors.postalCode?.message}>
                      <input
                        type="text"
                        autoComplete="postal-code"
                        {...register("postalCode")}
                        className={inputCls(!!errors.postalCode)}
                        placeholder="6-digit PIN"
                        maxLength={6}
                      />
                    </Field>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </motion.div>
              )}

              {/* STEP 2 — Secure Demo Payment */}
              {step === "payment" && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 hover:text-black flex items-center gap-1 font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      Back
                    </button>
                    <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold" aria-hidden="true">2</span>
                      Secure Demo Payment
                    </h2>
                  </div>

                  <p className="text-xs italic text-zinc-500 text-center leading-relaxed">
                    This is a secure payment simulation created for demonstration purposes. No real money will be charged.
                  </p>

                  {/* Simulated card preview */}
                  <div className="flex justify-center py-2">
                    <motion.div
                      animate={{ rotateY: cvvFocused ? 180 : 0 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="relative w-72 h-44 rounded-xl shadow-xl text-white select-none"
                    >
                      {/* Front */}
                      <div
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-5 flex flex-col justify-between"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="flex justify-between items-start">
                          <CreditCard className="w-6 h-6 stroke-[1.25] text-zinc-300" aria-hidden="true" />
                          <span className="text-[10px] tracking-widest font-semibold text-zinc-300">
                            {getCardBrand(watchCardNumber)}
                          </span>
                        </div>
                        <div className="font-mono text-sm tracking-[0.2em] text-zinc-100">
                          {formatCardDisplay(watchCardNumber) || "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022"}
                        </div>
                        <div className="flex justify-between items-end text-xs">
                          <div>
                            <div className="text-[8px] uppercase tracking-widest text-zinc-400">Cardholder</div>
                            <div className="text-[11px] font-semibold uppercase tracking-wide truncate max-w-[150px]">
                              {watchCardName || "YOUR NAME"}
                            </div>
                          </div>
                          <div>
                            <div className="text-[8px] uppercase tracking-widest text-zinc-400">Expires</div>
                            <div className="text-[11px] font-mono font-semibold">{watchCardExpiry || "MM/YY"}</div>
                          </div>
                        </div>
                      </div>
                      {/* Back */}
                      <div
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 flex flex-col justify-center"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                      >
                        <div className="bg-black h-9 w-full mb-4" />
                        <div className="px-5 flex justify-end items-center gap-2">
                          <span className="text-[9px] text-zinc-400 uppercase tracking-widest">CVV</span>
                          <div className="bg-white text-black font-mono font-bold text-xs px-3 py-1.5 min-w-[48px] text-center">
                            {watchCardCvv || "\u2022\u2022\u2022"}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Test card hint */}
                  <div className="bg-amber-50 border border-amber-200 px-4 py-3 flex gap-2.5 items-start">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="text-xs text-amber-800 leading-relaxed">
                      Use test number <span className="font-mono font-bold">4242 4242 4242 4242</span>, any future expiry, and any 3-digit CVV.
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Field label="Cardholder Name" error={errors.cardName?.message}>
                      <input
                        type="text"
                        autoComplete="cc-name"
                        {...register("cardName")}
                        className={inputCls(!!errors.cardName)}
                        placeholder="As shown on your card"
                      />
                    </Field>

                    <Field label="Card Number" error={errors.cardNumber?.message}>
                      <input
                        type="text"
                        autoComplete="cc-number"
                        inputMode="numeric"
                        maxLength={19}
                        {...register("cardNumber", {
                          onChange: (e) => {
                            e.target.value = formatCardDisplay(e.target.value);
                          },
                        })}
                        className={inputCls(!!errors.cardNumber) + " font-mono tracking-widest"}
                        placeholder="4242 4242 4242 4242"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Expiry (MM/YY)" error={errors.cardExpiry?.message}>
                        <input
                          type="text"
                          autoComplete="cc-exp"
                          inputMode="numeric"
                          maxLength={5}
                          {...register("cardExpiry", {
                            onChange: (e) => {
                              const digits = e.target.value.replace(/\D/g, "");
                              if (digits.length >= 3) {
                                e.target.value = digits.slice(0, 2) + "/" + digits.slice(2, 4);
                              } else {
                                e.target.value = digits;
                              }
                            },
                          })}
                          className={inputCls(!!errors.cardExpiry) + " font-mono"}
                          placeholder="MM/YY"
                        />
                      </Field>

                      <Field label="CVV" error={errors.cardCvv?.message}>
                        <input
                          type="password"
                          autoComplete="cc-csc"
                          inputMode="numeric"
                          maxLength={4}
                          {...register("cardCvv")}
                          onFocus={() => setCvvFocused(true)}
                          onBlur={() => setCvvFocused(false)}
                          className={inputCls(!!errors.cardCvv) + " font-mono"}
                          placeholder="\u2022\u2022\u2022"
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                    <span>Secure demo checkout &mdash; no real transaction is made</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Processing&hellip;
                      </>
                    ) : (
                      <>Complete Payment &middot; {formatINR(total)}</>
                    )}
                  </button>
                </motion.div>
              )}

              {/* STEP 3 — Processing Animation */}
              {step === "processing" && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-24 flex flex-col items-center text-center space-y-8"
                >
                  <div className="space-y-6">
                    {PROCESSING_STAGES.map((stage, idx) => {
                      const StageIcon = stage.Icon;
                      const isActive = processingStage === idx;
                      const isDone = processingStage > idx;

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: processingStage >= idx ? 1 : 0.3,
                            y: 0,
                          }}
                          transition={{ duration: 0.4, delay: idx * 0.15 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDone ? "bg-green-100" : isActive ? "bg-zinc-100" : "bg-zinc-50"
                          }`}>
                            {isDone ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <StageIcon className={`w-4 h-4 ${isActive ? "animate-spin text-zinc-900" : "text-zinc-300"}`} />
                            )}
                          </div>
                          <span className={`text-sm ${
                            isDone ? "text-green-700 font-medium" : isActive ? "text-zinc-900 font-medium" : "text-zinc-400"
                          }`}>
                            {stage.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Please do not close this page</p>
                </motion.div>
              )}

              {/* STEP 4 — Payment Failed */}
              {step === "failed" && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-500 stroke-[1.5]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-zinc-900">Payment Declined</h2>
                    <p className="text-sm text-zinc-500 mt-2 max-w-sm leading-relaxed">
                      Payment could not be completed. Please verify your details and try again.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("payment");
                      setSubmitting(false);
                    }}
                    className="bg-black text-white px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* ── Order Summary ── */}
        <aside className="lg:col-span-5 bg-[#F4F3EF] border border-zinc-200 p-6 sm:p-8 self-start space-y-6">
          <h2 className="font-serif text-lg font-normal text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-4">
            <ShoppingBag className="w-4 h-4 stroke-[1.25]" aria-hidden="true" />
            Order Summary ({cart.reduce((a, i) => a + i.quantity, 0)} items)
          </h2>

          <div className="space-y-4 divide-y divide-zinc-200/60 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-3">
                <div className="relative w-14 h-20 bg-white border border-zinc-200 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between gap-2">
                      <p className="font-serif text-xs text-zinc-900 line-clamp-2 leading-snug">
                        {item.product.name}
                      </p>
                      <p className="text-xs font-semibold text-zinc-900 whitespace-nowrap">
                        {formatINR(item.product.price * item.quantity)}
                      </p>
                    </div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1">
                      {item.selectedSize} / {item.selectedColor.name}
                    </p>
                  </div>
                  <p className="text-[10px] text-zinc-700 font-medium">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 pt-4 space-y-2">
            <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wider">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wider">
              <span>Delivery</span>
              <span>{shippingFee === 0 ? "FREE" : formatINR(shippingFee)}</span>
            </div>
            {shippingFee === 0 && (
              <p className="text-[9px] text-green-700 font-medium uppercase tracking-wider">
                ✓ Free delivery applied
              </p>
            )}
            <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm font-semibold text-zinc-900">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase tracking-wider pt-2 border-t border-zinc-200">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>Secure checkout &middot; 15-day easy returns</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
