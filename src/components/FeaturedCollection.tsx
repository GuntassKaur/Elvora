"use client";

import Link from "next/link";
import { useProductsStore } from "@/store/useProductsStore";
import ProductCard from "./ProductCard";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturedCollection() {
  const products = useProductsStore((state) => state.products);
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);

  if (featured.length === 0) return null;

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
              Curated Capsule &bull; 01
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-normal text-zinc-900 tracking-tight leading-[0.9]">
              Featured <span className="italic font-light text-zinc-500">Garments</span>
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
              Explore Full Catalogue
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="space-y-16 md:space-y-32">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <motion.div 
              className="md:col-span-7 pt-0 md:pt-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {featured[0] && <ProductCard product={featured[0]} />}
            </motion.div>
            <motion.div 
              className="md:col-span-5"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {featured[1] && <ProductCard product={featured[1]} />}
            </motion.div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <motion.div 
              className="md:col-span-5 md:col-start-2"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {featured[2] && <ProductCard product={featured[2]} />}
            </motion.div>
            <motion.div 
              className="md:col-span-4 md:col-start-8 pt-0 md:pt-32"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {featured[3] && <ProductCard product={featured[3]} />}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
