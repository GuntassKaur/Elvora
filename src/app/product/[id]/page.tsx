"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Color } from "@/data/products";
import { useProductsStore } from "@/store/useProductsStore";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Minus, ArrowRight, Truck, RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";

type Props = {
  params: Promise<{ id: string }>;
};

const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const FALLBACK_DETAIL_IMAGE = "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200";

function GalleryImage({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      priority={priority}
      onError={() => setImgSrc(FALLBACK_DETAIL_IMAGE)}
      className="object-cover object-top hover:scale-[1.02] transition-transform duration-[2s] ease-out"
      sizes="(max-width: 1024px) 100vw, 60vw"
    />
  );
}

export default function ProductDetailsPage({ params }: Props) {
  const { id } = React.use(params);
  const products = useProductsStore((state) => state.products);
  const addToCart = useCartStore((state) => state.addToCart);

  const product = products.find((p) => p.id === id);
  if (!product) {
    notFound();
  }

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<Color>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  
  const [accordionOpen, setAccordionOpen] = useState<{ [key: string]: boolean }>({
    details: true,
    shipping: false,
    care: false,
  });

  const toggleAccordion = (section: string) => {
    setAccordionOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddToBag = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  // Recommendations
  const recommendations = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  if (recommendations.length < 4) {
    const ids = recommendations.map((r) => r.id);
    const padding = products
      .filter((p) => p.id !== product.id && !ids.includes(p.id))
      .slice(0, 4 - recommendations.length);
    recommendations.push(...padding);
  }

  return (
    <div className="font-sans bg-white text-zinc-900 pb-20">
      
      {/* Breadcrumb Navigation - Sticky on Mobile, absolute on desktop */}
      <div className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-40 lg:relative lg:top-auto lg:bg-transparent border-b border-zinc-100 lg:border-none">
        <nav className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center space-x-3 text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-semibold">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Catalogue</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-black transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-zinc-900">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 lg:pt-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          {/* Left: Massive Scrolling Gallery */}
          <div className="lg:w-[60%] flex flex-col gap-4">
            {product.images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8 }}
                className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-[#F4F3EF] overflow-hidden"
              >
                <GalleryImage
                  src={img}
                  alt={`${product.name} detail view ${idx + 1}`}
                  priority={idx === 0}
                />
              </motion.div>
            ))}
            
            {/* Story / Context Section underneath gallery (Desktop) */}
            <div className="hidden lg:block mt-16 max-w-2xl mx-auto text-center space-y-6 pb-20">
              <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-zinc-400">
                Behind The Design
              </span>
              <h3 className="font-serif text-3xl font-normal leading-tight">
                Designed for the <br /> <span className="italic font-light text-zinc-500">Modern Wardrobe</span>
              </h3>
              <p className="text-sm font-light text-zinc-600 leading-relaxed mx-auto max-w-lg">
                {product.fullDescription || product.description}
              </p>
            </div>
          </div>

          {/* Right: Sticky Purchase Panel */}
          <div className="lg:w-[40%] relative">
            <div className="lg:sticky lg:top-32 space-y-10 lg:pb-32">
              
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-zinc-500 block mb-3">
                      {product.category} &bull; {product.brand}
                    </span>
                    <h1 className="font-serif text-4xl sm:text-5xl text-zinc-900 leading-[1.1] tracking-tight font-normal">
                      {product.name}
                    </h1>
                  </div>
                </div>
                
                <p className="font-serif italic text-lg text-zinc-500">
                  {product.tagline}
                </p>

                <div className="flex items-baseline gap-4 pt-2">
                  <span className="text-2xl font-medium tracking-wide">
                    {formatINR(product.price)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm font-light text-zinc-400 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Selectors */}
              <div className="space-y-8 pt-6 border-t border-zinc-200">
                
                {/* Color */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-900">
                      Color
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-500">
                      {selectedColor.name}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select color ${color.name}`}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColor.name === color.name ? "border-black p-0.5" : "border-transparent"
                        }`}
                      >
                        <div
                          className="w-full h-full rounded-full border border-zinc-100 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-900">
                      Size
                    </span>
                    <button className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-400 hover:text-black transition-colors underline underline-offset-4">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[60px] h-12 border text-xs uppercase tracking-[0.2em] font-medium transition-all ${
                          selectedSize === size
                            ? "bg-black text-white border-black"
                            : "bg-transparent text-zinc-900 border-zinc-300 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <div className="flex items-center border border-zinc-300 h-14 w-32 justify-between">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-4 h-full text-zinc-500 hover:text-black transition-colors"
                    >
                      <Minus className="w-4 h-4 stroke-[1.25]" />
                    </button>
                    <span className="text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-4 h-full text-zinc-500 hover:text-black transition-colors"
                    >
                      <Plus className="w-4 h-4 stroke-[1.25]" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToBag}
                    className="flex-1 bg-black text-white h-14 text-[10px] font-semibold uppercase tracking-[0.25em] hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3"
                  >
                    Add To Bag
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Delivery / Assurance */}
              <div className="pt-8 border-t border-zinc-200">
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <Truck className="w-5 h-5 stroke-[1] text-zinc-400 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-900 mb-1">
                        Express Delivery
                      </h4>
                      <p className="text-xs font-light text-zinc-500 leading-relaxed">
                        Complimentary shipping on orders over {formatINR(2000)}. Dispatches in 24 hrs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <RefreshCcw className="w-5 h-5 stroke-[1] text-zinc-400 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-900 mb-1">
                        Effortless Returns
                      </h4>
                      <p className="text-xs font-light text-zinc-500 leading-relaxed">
                        15-day return policy. Items must be unworn with original tags attached.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordions */}
              <div className="divide-y divide-zinc-200 border-t border-b border-zinc-200 mt-8">
                {/* Details Accordion */}
                <div className="py-5">
                  <button
                    onClick={() => toggleAccordion("details")}
                    className="w-full flex justify-between items-center group"
                  >
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-900">
                      Product Details
                    </span>
                    {accordionOpen.details ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
                    )}
                  </button>
                  <AnimatePresence>
                    {accordionOpen.details && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ul className="list-inside list-disc pt-5 space-y-3 text-xs text-zinc-600 font-light leading-relaxed">
                          {product.details.map((d, i) => (
                            <li key={i} className="marker:text-zinc-300">{d}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Materials & Care Accordion */}
                <div className="py-5">
                  <button
                    onClick={() => toggleAccordion("care")}
                    className="w-full flex justify-between items-center group"
                  >
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-900">
                      Materials & Care
                    </span>
                    {accordionOpen.care ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
                    )}
                  </button>
                  <AnimatePresence>
                    {accordionOpen.care && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-5 space-y-4 text-xs text-zinc-600 font-light leading-relaxed">
                          <div>
                            <span className="font-semibold text-zinc-900 block mb-1">Composition:</span>
                            {product.materials.join(", ")}
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-900 block mb-1">Care:</span>
                            {product.careInstructions.join(" · ")}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Story / Context Section (Visible only on mobile, below gallery and info) */}
        <div className="block lg:hidden mt-16 text-center space-y-6 border-t border-zinc-200 pt-16">
          <span className="text-[9px] tracking-[0.3em] uppercase font-semibold text-zinc-400">
            Behind The Design
          </span>
          <h3 className="font-serif text-3xl font-normal leading-tight">
            Designed for the <br /> <span className="italic font-light text-zinc-500">Modern Wardrobe</span>
          </h3>
          <p className="text-sm font-light text-zinc-600 leading-relaxed mx-auto max-w-lg">
            {product.fullDescription || product.description}
          </p>
        </div>

        {/* Recommendations block */}
        <section className="mt-24 lg:mt-32 pt-16 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-[9px] tracking-[0.3em] text-zinc-400 uppercase font-semibold block mb-3">
                Curated For You
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-zinc-900 tracking-tight leading-[1]">
                Complete The <span className="italic font-light text-zinc-500">Look</span>
              </h2>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-900 border-b border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all"
            >
              Explore {product.category}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {recommendations.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
