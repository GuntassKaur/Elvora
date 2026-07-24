"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { fetchOrderById } from "@/lib/orders";
import { OrderRow, OrderItemJson } from "@/lib/database";
import { createClient } from "@/lib/supabase/client";
import {
  Check,
  Calendar,
  MapPin,
  Package,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function OrderSuccessPage() {
  const orderSnapshot = useCartStore((state) => state.orderSnapshot);
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, [supabase.auth]);

  // Remote order state (fetched from Supabase on refresh)
  const [remoteOrder, setRemoteOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(false);

  // Pull from Zustand snapshot first (set at payment time)
  const orderId = orderSnapshot?.orderId || "";
  const deliveryDate = orderSnapshot?.deliveryDate || "Within 3–5 business days";
  const items = orderSnapshot?.items || [];
  const subtotal = orderSnapshot?.subtotal ?? 0;
  const shippingFee = orderSnapshot?.shippingFee ?? 0;
  const total = orderSnapshot?.total ?? 0;
  const customerName = orderSnapshot?.customerName || "";
  const shippingAddress = orderSnapshot?.shippingAddress || "";
  const paymentTimestamp = orderSnapshot?.paymentTimestamp
    ? new Date(orderSnapshot.paymentTimestamp).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";
  const paymentMethod = orderSnapshot?.paymentMethod || "Secure Demo Payment";

  // On mount: try to hydrate from Supabase if orderId is known
  useEffect(() => {
    if (!orderId || orderId === "ELV-DEMO-00000") return;
    // Only fetch from DB if cart items are not in snapshot (i.e., after a refresh)
    if (items.length > 0) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchOrderById(orderId);
        if (data) setRemoteOrder(data);
      } catch (err) {
        console.warn("Failed to fetch order from Supabase:", err);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [orderId, items.length]);

  // Derive display values from remote order if snapshot items are gone
  const displayOrderId = orderId || remoteOrder?.order_id || "ELV-DEMO-00000";
  const displaySubtotal = subtotal || Number(remoteOrder?.subtotal ?? 0);
  const displayShipping = shippingFee || Number(remoteOrder?.shipping ?? 0);
  const displayTotal = total || Number(remoteOrder?.total ?? 0);
  const displayPaymentMethod = paymentMethod || remoteOrder?.payment_method || "Secure Demo Payment";
  const displayPaymentStatus = remoteOrder?.payment_status || "paid";
  const displayCustomerName =
    customerName ||
    (remoteOrder?.shipping_address as { fullName?: string } | null)?.fullName ||
    "";
  const displayShippingAddress =
    shippingAddress ||
    (remoteOrder
      ? [
          (remoteOrder.shipping_address as { address?: string })?.address,
          (remoteOrder.shipping_address as { city?: string })?.city,
          (remoteOrder.shipping_address as { state?: string })?.state,
          (remoteOrder.shipping_address as { postalCode?: string })?.postalCode,
          "India",
        ]
          .filter(Boolean)
          .join(", ")
      : "");
  const remoteItems: OrderItemJson[] = remoteOrder?.order_items || [];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 md:py-20 font-sans">
      <div className="border border-zinc-200 bg-white p-8 sm:p-12 space-y-8 shadow-sm">

        {/* Success Icon */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-zinc-200 flex items-center justify-center">
              <Check className="w-7 h-7 text-black stroke-[2.5]" aria-hidden="true" />
            </div>
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-black"
              aria-hidden="true"
            />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-normal text-zinc-900 tracking-wide">
              Order Confirmed
            </h1>
            <p className="font-serif italic text-zinc-500 mt-1">&ldquo;Wear Confidence.&rdquo;</p>
          </div>
        </div>

        {/* Order Meta Bar */}
        <div className="bg-[#FAF9F6] border border-zinc-200 p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
          <div>
            <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-zinc-400 block">
              Order Reference
            </span>
            <p className="text-xs font-mono font-semibold text-zinc-900 mt-1">{displayOrderId}</p>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-zinc-400 block">
              Estimated Delivery
            </span>
            <p className="text-xs font-semibold text-zinc-900 mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" aria-hidden="true" />
              {deliveryDate}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-zinc-400 block">
              Payment Status
            </span>
            <p className="text-xs font-semibold text-zinc-900 mt-1 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" aria-hidden="true" />
              {displayPaymentMethod}
              {remoteOrder && (
                <span className="ml-1 bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-bold">
                  {displayPaymentStatus}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Loading indicator (while fetching from Supabase on refresh) */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Retrieving your order details&hellip;
          </div>
        )}

        {/* Cart Items (from Zustand snapshot — available right after checkout) */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200 pt-6 space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.22em] font-semibold text-zinc-900 flex items-center gap-1.5">
              <Package className="w-4 h-4" aria-hidden="true" />
              Purchased Items ({items.reduce((a, i) => a + i.quantity, 0)})
            </h2>
            <div className="divide-y divide-zinc-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="relative w-12 h-16 bg-[#F4F3EF] flex-shrink-0 border border-zinc-200 overflow-hidden">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="flex justify-between gap-2">
                      <p className="font-serif text-sm text-zinc-900 line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs font-semibold text-zinc-900 whitespace-nowrap">
                        {formatINR(item.product.price * item.quantity)}
                      </p>
                    </div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">
                      {item.selectedSize} / {item.selectedColor.name} &middot; Qty {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 pt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wider">
                <span>Subtotal</span>
                <span>{formatINR(displaySubtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wider">
                <span>Express Delivery</span>
                <span>{displayShipping === 0 ? "FREE" : formatINR(displayShipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Total Paid</span>
                <span>{formatINR(displayTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Supabase-fetched items (shown after page refresh when Zustand snapshot is gone) */}
        {items.length === 0 && remoteItems.length > 0 && (
          <div className="border-t border-zinc-200 pt-6 space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.22em] font-semibold text-zinc-900 flex items-center gap-1.5">
              <Package className="w-4 h-4" aria-hidden="true" />
              Purchased Items ({remoteItems.reduce((a, i) => a + i.quantity, 0)})
            </h2>
            <div className="divide-y divide-zinc-100">
              {remoteItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  {item.image && (
                    <div className="relative w-12 h-16 bg-[#F4F3EF] flex-shrink-0 border border-zinc-200 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="flex justify-between gap-2">
                      <p className="font-serif text-sm text-zinc-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs font-semibold text-zinc-900 whitespace-nowrap">
                        {formatINR(item.price * item.quantity)}
                      </p>
                    </div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">
                      {item.size} / {item.color} &middot; Qty {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 pt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wider">
                <span>Subtotal</span>
                <span>{formatINR(displaySubtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wider">
                <span>Express Delivery</span>
                <span>{displayShipping === 0 ? "FREE" : formatINR(displayShipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Total Paid</span>
                <span>{formatINR(displayTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Customer & Shipping Details */}
        {(displayCustomerName || displayShippingAddress) && (
          <div className="border-t border-zinc-200 pt-6 space-y-2">
            <h2 className="text-[10px] uppercase tracking-[0.22em] font-semibold text-zinc-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Delivery Destination
            </h2>
            <div className="text-xs text-zinc-600 leading-relaxed space-y-0.5">
              {displayCustomerName && (
                <p className="font-semibold text-zinc-900">{displayCustomerName}</p>
              )}
              {displayShippingAddress && <p>{displayShippingAddress}</p>}
              {paymentTimestamp && (
                <p className="text-[10px] text-zinc-400 pt-1">
                  Payment timestamp: {paymentTimestamp}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Security & Guarantee Note */}
        <div className="bg-emerald-50 border border-emerald-100 p-3.5 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <p className="text-[10px] text-emerald-800 uppercase tracking-wider font-medium">
            15-Day Complimentary Returns &amp; Exchanges Guaranteed
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="border-t border-zinc-200 pt-4">
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider leading-relaxed">
            This is a <strong>secure payment simulation</strong> for demonstration purposes.
            No real money was charged.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-2 flex flex-col gap-3">
          {isLoggedIn && (
            <Link
              href="/profile"
              className="w-full border border-black text-black py-4 text-xs font-semibold uppercase tracking-[0.22em] hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" aria-hidden="true" />
              View My Orders
            </Link>
          )}
          <Link
            href="/shop"
            className="w-full bg-black text-white py-4 text-xs font-semibold uppercase tracking-[0.22em] hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
