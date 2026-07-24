"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { Heart, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const FALLBACK_IMAGE = "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800";

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const addToast = useCartStore((state) => state.addToast);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [img0Src, setImg0Src] = useState(product.images[0] || FALLBACK_IMAGE);
  const [img1Src, setImg1Src] = useState(product.images[1] || FALLBACK_IMAGE);

  const isOutOfStock = product.stock === 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((w) => !w);
    addToast(
      isWishlisted ? `Removed from wishlist` : `Saved to wishlist`,
      isWishlisted ? "info" : "success"
    );
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    const size = product.sizes[0] || "One Size";
    addToCart(product, 1, size, product.colors[0]);
  };

  return (
    <div
      className="group flex flex-col relative w-full font-sans cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F4F3EF] mb-4">
        <Link href={`/product/${product.id}`} className="absolute inset-0 block" aria-label={`View ${product.name}`}>
          <Image
            src={img0Src}
            alt={product.name}
            fill
            priority={priority}
            onError={() => setImg0Src(FALLBACK_IMAGE)}
            className={`object-cover object-top transition-all duration-[1.5s] ease-out ${
              isHovered ? "scale-[1.03]" : "scale-100"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {product.images[1] && (
            <div
              className={`absolute inset-0 bg-[#F4F3EF] transition-opacity duration-700 ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={img1Src}
                alt={`${product.name} alternate view`}
                fill
                onError={() => setImg1Src(FALLBACK_IMAGE)}
                className="object-cover object-top"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          {isOutOfStock ? (
            <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-zinc-500 bg-white/90 backdrop-blur-sm px-2.5 py-1">
              Sold Out
            </span>
          ) : (
            <>
              {product.isNewArrival && (
                <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-zinc-900 bg-white/90 backdrop-blur-sm px-2.5 py-1">
                  New
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white bg-zinc-900 px-2.5 py-1">
                  -{product.discountPercentage}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-500 hover:text-red-500 transition-colors"
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isWishlisted ? "fill-red-500 text-red-500" : "stroke-[1.5]"
            }`}
          />
        </button>

        {/* Quick Add overlay */}
        {!isOutOfStock && (
          <div
            className={`absolute bottom-0 inset-x-0 p-4 translate-y-2 opacity-0 transition-all duration-500 ease-out z-20 ${
              isHovered ? "translate-y-0 opacity-100" : ""
            }`}
          >
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white/95 backdrop-blur-md text-zinc-900 py-3.5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Quick Add
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col px-1">
        <div className="flex justify-between items-start gap-4 mb-2">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-1.5">
              {product.category}
            </span>
            <Link href={`/product/${product.id}`} className="group-hover:opacity-70 transition-opacity">
              <h3 className="font-serif text-lg text-zinc-900 leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>
          <div className="flex flex-col items-end text-right flex-shrink-0">
            <span className="text-sm font-medium text-zinc-900">
              {formatINR(product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-[10px] text-zinc-400 line-through mt-0.5">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-zinc-500 font-light italic truncate max-w-[70%]">
            {product.tagline}
          </p>
          
          {/* Color Swatches */}
          <div className="flex gap-1.5 items-center">
            {product.colors.slice(0, 3).map((color, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-zinc-200"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] text-zinc-400 font-medium tracking-wider">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
