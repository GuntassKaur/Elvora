"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/data/products";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80";

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function WishlistPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  
  const items = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const addToast = useCartStore((state) => state.addToast);

  // Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/login?redirect=/wishlist`);
      } else {
        setIsAuth(true);
      }
    };
    checkAuth();
  }, [supabase, router]);

  const handleMoveToCart = (item: { product: Product; addedAt: string }) => {
    const { product } = item;
    const size = product.sizes[0] || "One Size";
    addToCart(product, 1, size, product.colors[0]);
    removeFromWishlist(product.id);
    addToast("Moved to bag", "success");
  };

  // Prevent flash of content while checking auth
  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans pt-12 pb-24">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
        
        <header className="mb-12 border-b border-zinc-200 pb-6 flex items-end justify-between">
          <div>
            <h1 className="font-serif text-4xl text-zinc-900 tracking-tight mb-2">Wishlist</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </p>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Heart className="w-12 h-12 stroke-[1] text-zinc-300 mb-6" />
            <h2 className="font-serif text-2xl text-zinc-900 mb-4">Your wishlist is empty</h2>
            <p className="text-sm font-light text-zinc-500 mb-8 max-w-sm">
              Discover our latest collections and save your favorite items for later.
            </p>
            <Link
              href="/shop"
              className="bg-black text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-800 transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex flex-col"
                >
                  <div className="relative aspect-[4/5] bg-[#F4F3EF] mb-4 overflow-hidden">
                    <Link href={`/product/${item.product.id}`} className="absolute inset-0 z-10 block">
                      <Image
                        src={item.product.images[0] || FALLBACK_IMAGE}
                        alt={item.product.name}
                        fill
                        className="object-cover object-top hover:scale-[1.03] transition-transform duration-[1.5s] ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(item.product.id)}
                      className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm text-zinc-500 hover:text-red-500 transition-colors"
                      aria-label="Remove from Wishlist"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    {/* Add to Cart Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 opacity-0 transition-all duration-300 ease-out z-20 group-hover:translate-y-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="w-full bg-white/95 backdrop-blur-md text-zinc-900 py-3.5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Move to Bag
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col px-1">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-1.5">
                      {item.product.category}
                    </span>
                    <Link href={`/product/${item.product.id}`} className="hover:opacity-70 transition-opacity">
                      <h3 className="font-serif text-lg text-zinc-900 leading-snug mb-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-zinc-900">
                        {formatINR(item.product.price)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
