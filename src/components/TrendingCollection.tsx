"use client";

import Link from "next/link";
import { useProductsStore } from "@/store/useProductsStore";
import ProductCard from "./ProductCard";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function TrendingCollection() {
  const products = useProductsStore((state) => state.products);
  const trending = products.filter((p) => p.isTrending).slice(0, 4);

  if (trending.length === 0) return null;

  return (
    <section className="py-24 sm:py-40 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-20 border-b border-zinc-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase font-semibold block mb-4">
              Most Coveted &bull; Editors&apos; Pick
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-normal text-zinc-900 tracking-tight leading-[0.9]">
              Trending <span className="italic font-light text-zinc-500">Now</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 border-b border-black pb-1 text-xs uppercase tracking-[0.2em] font-semibold text-zinc-900 hover:text-zinc-500 hover:border-zinc-500 transition-colors mt-8 md:mt-0"
            >
              Shop Trending Pieces
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
        </div>

        {/* Magazine Masonry Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-16 gap-y-16 items-start">
          {/* Main Feature */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {trending[0] && <ProductCard product={trending[0]} />}
          </motion.div>

          {/* Staggered Right Column */}
          <div className="flex flex-col gap-16 lg:mt-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {trending[1] && <ProductCard product={trending[1]} />}
            </motion.div>
          </div>

          {/* Row 2 */}
          <motion.div
            className="md:col-span-1 lg:mt-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {trending[2] && <ProductCard product={trending[2]} />}
          </motion.div>

          <motion.div
            className="md:col-span-1 lg:col-span-2 lg:px-24 pt-0 lg:pt-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {trending[3] && <ProductCard product={trending[3]} />}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
