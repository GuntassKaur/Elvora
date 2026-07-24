"use client";

import Link from "next/link";
import { useProductsStore } from "@/store/useProductsStore";
import ProductCard from "./ProductCard";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function NewArrivals() {
  const products = useProductsStore((state) => state.products);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  if (newArrivals.length === 0) return null;

  return (
    <section className="py-24 sm:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          
          {/* Sticky Editorial Sidebar */}
          <div className="lg:w-1/3 lg:sticky lg:top-40 lg:self-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase font-semibold block mb-6">
                Fresh Drop &bull; Season 2026
              </span>
              <h2 className="font-serif text-5xl sm:text-7xl font-normal text-zinc-900 tracking-tight leading-[0.9] mb-8">
                New <br />
                <span className="italic font-light text-zinc-500">Arrivals</span>
              </h2>
              <p className="text-sm text-zinc-600 font-light leading-relaxed mb-10 max-w-sm">
                Explore the latest additions to our collection. Pieces designed to seamlessly transition through your week with effortless elegance.
              </p>
              
              <Link
                href="/shop?isNewArrival=true"
                className="group inline-flex items-center gap-2 border-b border-black pb-1 text-xs uppercase tracking-[0.2em] font-semibold text-zinc-900 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
              >
                View The Collection
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              {/* Category Filter Chips */}
              <div className="mt-16 pt-8 border-t border-zinc-200">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-zinc-400 mb-4 block">
                  Explore By Category
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Outerwear", "Knitwear", "Tailoring", "Accessories"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/shop?category=${cat}`}
                      className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-600 hover:text-black border border-zinc-200 px-4 py-2 hover:border-black transition-all bg-[#FAF9F6]"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Scrolling Grid */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16 lg:gap-y-32">
              {newArrivals.map((product, idx) => (
                <motion.div
                  key={product.id}
                  className={idx % 2 === 1 ? "sm:mt-24" : ""}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
