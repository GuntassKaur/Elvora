"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const cart = useCartStore((state) => state.cart);
  const cartOpen = useCartStore((state) => state.cartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const drawerRef = useRef<HTMLDivElement>(null);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 2000;
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [cartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FAF9F6] text-brand-dark shadow-2xl flex flex-col font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200/80 bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 stroke-[1.25]" />
                <h2 className="font-serif text-lg tracking-wide uppercase font-normal">
                  Shopping Bag ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-black transition-colors"
                aria-label="Close Shopping Bag"
              >
                <X className="w-5 h-5 stroke-[1.25]" />
              </button>
            </div>

            {/* Main scroll content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length > 0 ? (
                <>
                  {/* Free shipping bar */}
                  <div className="bg-white p-4 border border-zinc-200/60 space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.15em] font-medium text-zinc-700 text-center">
                      {remainingForFreeShipping > 0 ? (
                        <>
                          Add <span className="font-bold text-black">{formatINR(remainingForFreeShipping)}</span> more for Free Delivery
                        </>
                      ) : (
                        <span className="text-black font-semibold">You qualify for Complimentary Express Delivery!</span>
                      )}
                    </p>
                    <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-black h-full rounded-full"
                      />
                    </div>
                  </div>

                  {/* Cart Item List */}
                  <div className="divide-y divide-zinc-200/60">
                    {cart.map((item) => (
                      <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                        {/* Thumbnail */}
                        <div className="relative w-20 h-28 bg-[#F4F3EF] overflow-hidden flex-shrink-0 border border-zinc-200">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-serif text-sm tracking-wide font-normal text-zinc-900 line-clamp-1">
                                {item.product.name}
                              </h3>
                              <p className="text-xs font-semibold text-zinc-900">
                                {formatINR(item.product.price * item.quantity)}
                              </p>
                            </div>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] mt-1">
                              Size: {item.selectedSize} / Color: {item.selectedColor.name}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center border border-zinc-200 bg-white">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-zinc-50 text-zinc-900"
                              >
                                <Minus className="w-3 h-3 stroke-[1.25]" />
                              </button>
                              <span className="px-3 text-xs font-semibold text-zinc-900 min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-zinc-50 text-zinc-900"
                              >
                                <Plus className="w-3 h-3 stroke-[1.25]" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4 stroke-[1.25]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center py-20 space-y-6">
                  <ShoppingBag className="w-12 h-12 stroke-[1] text-zinc-300" />
                  <div>
                    <h3 className="font-serif text-lg text-zinc-900 font-normal">
                      Your bag is empty
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed uppercase tracking-wider">
                      Explore our seasonal capsule of fine tailoring and Grade-A cashmere.
                    </p>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="inline-block"
                  >
                    <Link
                      href="/shop"
                      className="inline-block bg-black text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors"
                    >
                      Explore Catalogue
                    </Link>
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-200 bg-white space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wider">
                    <span>Express Shipping</span>
                    <span>{shippingFee === 0 ? "COMPLIMENTARY" : formatINR(shippingFee)}</span>
                  </div>
                  <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm font-semibold uppercase tracking-wider text-zinc-900">
                    <span>Order Total</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Link
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="w-full text-center block bg-black text-white py-4 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed To Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full text-center py-2 text-[10px] text-zinc-400 hover:text-black uppercase tracking-[0.2em] font-medium transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
