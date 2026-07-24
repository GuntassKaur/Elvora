"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useProductsStore } from "@/store/useProductsStore";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/data/products";

// ─── Utility: Format price ───
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// ─── Text Reveal Animation Component ───
function RevealText({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <div ref={ref} className={`overflow-hidden ${className || ""}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={inView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}



// ─── Marquee Ticker ───
function MarqueeTicker({ text, count = 6 }: { text: string; count?: number }) {
  const repeated = Array(count).fill(text);
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        {repeated.map((t, i) => (
          <span key={i} className="inline-block mx-8 text-[11px] uppercase tracking-[0.3em] font-medium text-zinc-500">
            {t} <span className="mx-4 text-zinc-300">·</span>
          </span>
        ))}
        {repeated.map((t, i) => (
          <span key={`d-${i}`} className="inline-block mx-8 text-[11px] uppercase tracking-[0.3em] font-medium text-zinc-500">
            {t} <span className="mx-4 text-zinc-300">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Editorial Product Block ───
function EditorialProduct({ product, align = "left" }: { product: Product; align?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex flex-col ${
        align === "right" ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <Link href={`/product/${product.id}`} className="group cursor-discover relative block w-full aspect-[3/4] overflow-hidden bg-[#f0ede7] mb-6">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        {product.isNewArrival && (
          <div className="absolute top-5 left-5">
            <span className="text-[9px] font-bold tracking-[0.25em] uppercase bg-white/90 backdrop-blur px-3 py-1.5 text-zinc-900">
              New
            </span>
          </div>
        )}
      </Link>
      <div className="space-y-2 w-full px-1">
        <span className="block text-[9px] uppercase tracking-[0.3em] font-semibold text-zinc-400">
          {product.category}
        </span>
        <h3 className="font-serif text-2xl leading-none">
          <Link href={`/product/${product.id}`} className="hover:opacity-60 transition-opacity">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-4 pt-1">
          <span className="text-sm font-medium">{fmt(product.price)}</span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-zinc-400 line-through">{fmt(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const products = useProductsStore((state) => state.products);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 3);

  return (
    <div className="bg-[#faf9f6] text-[#0a0a0a]">

      {/* ─────────────────────────────────────────── */}
      {/* SCENE 1: CINEMATIC HERO — 100vh             */}
      {/* ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY }}
        >
          <Image
            src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="ELVORA Autumn Collection"
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        </motion.div>

        {/* Floating hero text */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end items-start p-8 sm:p-14 lg:p-20 pb-16 sm:pb-20"
          style={{ opacity: heroOpacity }}
        >
          <div className="space-y-4 max-w-2xl">
            <RevealText className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-bold text-white/70">
              Autumn/Winter Collection
            </RevealText>
            <RevealText className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white leading-none tracking-tight" delay={0.1}>
              Wear
            </RevealText>
            <RevealText className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white leading-none tracking-tight font-light italic" delay={0.2}>
              Confidence.
            </RevealText>
          </div>

          <div className="mt-10 sm:mt-14 flex items-center gap-8">
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-4 text-white text-[10px] uppercase tracking-[0.35em] font-bold border-b border-white/40 pb-2 hover:border-white transition-colors"
            >
              Explore The Collection
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 sm:right-12 flex flex-col items-center gap-3">
          <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
            <motion.div
              className="absolute inset-x-0 top-0 bg-white"
              animate={{ y: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ height: "40%" }}
            />
          </div>
          <span className="text-white/50 text-[8px] uppercase tracking-[0.3em] font-medium [writing-mode:vertical-rl]">Scroll</span>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* SCENE 2: MASSIVE TYPOGRAPHIC STATEMENT      */}
      {/* ─────────────────────────────────────────── */}
      <section className="relative py-32 sm:py-48 lg:py-64 overflow-hidden">
        <div className="px-6 sm:px-10 lg:px-16">
          <RevealText className="font-serif text-6xl sm:text-8xl lg:text-9xl leading-none tracking-tighter text-[#0a0a0a] mix-blend-multiply">
            New
          </RevealText>
          <div className="flex items-end justify-between mt-2">
            <RevealText className="font-serif text-6xl sm:text-8xl lg:text-9xl leading-none tracking-tighter text-[#0a0a0a] italic font-light" delay={0.1}>
              Arrivals
            </RevealText>
            <div className="hidden lg:block text-right mb-4">
              <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-[200px]">
                The finest pieces from our Autumn/Winter 2025 collection.
              </p>
              <Link href="/shop?category=all" className="inline-flex items-center gap-2 mt-4 text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-900 border-b border-zinc-900 pb-1 hover:opacity-60 transition-opacity">
                Shop All
              </Link>
            </div>
          </div>
        </div>

        {/* Ticker below heading */}
        <div className="mt-12 py-5 border-y border-zinc-200">
          <MarqueeTicker text="New Collection" />
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* SCENE 3: ASYMMETRIC PRODUCT REVEAL — 3UP    */}
      {/* ─────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-end">
          {/* First — normal */}
          <div className="col-span-1">
            {newArrivals[0] && <EditorialProduct product={newArrivals[0]} />}
          </div>
          {/* Second — pushed down on desktop for rhythm */}
          <div className="col-span-1 lg:mt-32">
            {newArrivals[1] && <EditorialProduct product={newArrivals[1]} align="left" />}
          </div>
          {/* Third — pushed down more */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 lg:mt-16">
            {newArrivals[2] && <EditorialProduct product={newArrivals[2]} />}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* SCENE 4: FULL-BLEED CAMPAIGN IMAGE          */}
      {/* Tall, cinematic. Text floats on it.         */}
      {/* ─────────────────────────────────────────── */}
      <section className="relative h-[85vh] sm:h-screen w-full overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="ELVORA — Tailored Excellence"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        {/* Text pinned to the right */}
        <div className="absolute inset-0 flex flex-col justify-center items-end p-10 sm:p-20 text-right">
          <RevealText className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/60 mb-6">
            The Tailoring Edit
          </RevealText>
          <RevealText className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white leading-none" delay={0.1}>
            Dressed
          </RevealText>
          <RevealText className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white leading-none italic font-light" delay={0.2}>
            for Power.
          </RevealText>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10"
          >
            <Link
              href="/shop?category=Tailoring"
              className="inline-flex items-center gap-3 text-white text-[10px] uppercase tracking-[0.3em] font-bold border border-white/50 px-6 py-3.5 hover:bg-white hover:text-black transition-colors"
            >
              Shop Tailoring
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* SCENE 5: BRAND PHILOSOPHY — Whitespace      */}
      {/* This section is intentionally minimal.      */}
      {/* ─────────────────────────────────────────── */}
      <section className="py-40 sm:py-56 lg:py-72 px-6 sm:px-10 text-center">
        <RevealText className="text-[9px] uppercase tracking-[0.5em] font-bold text-zinc-400 mb-10">
          Our Philosophy
        </RevealText>
        <div className="max-w-3xl mx-auto">
          <RevealText className="font-serif text-2xl sm:text-4xl lg:text-5xl leading-[1.3] font-light text-[#0a0a0a]" delay={0.1}>
            &ldquo;We design for those who choose quality over quantity. 
            For those who dress with intention.
            For those who <em>wear confidence.</em>&rdquo;
          </RevealText>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-400"
        >
          — The ELVORA Creative Team
        </motion.p>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* SCENE 6: GENDER SPLITS — Two massive images */}
      {/* ─────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Women */}
        <Link
          href="/shop?gender=women"
          className="group relative block h-[80vh] sm:h-screen overflow-hidden cursor-discover"
        >
          <Image
            src="https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Shop Women"
            fill
            className="object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute bottom-10 left-10">
            <RevealText className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/60 mb-3">
              Women
            </RevealText>
            <RevealText className="font-serif text-5xl sm:text-6xl text-white leading-none" delay={0.1}>
              For Her
            </RevealText>
          </div>
        </Link>

        {/* Men */}
        <Link
          href="/shop?gender=men"
          className="group relative block h-[80vh] sm:h-screen overflow-hidden cursor-discover"
        >
          <Image
            src="https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Shop Men"
            fill
            className="object-cover object-center transition-transform duration-[2s] ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute bottom-10 right-10 text-right">
            <RevealText className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/60 mb-3">
              Men
            </RevealText>
            <RevealText className="font-serif text-5xl sm:text-6xl text-white leading-none" delay={0.1}>
              For Him
            </RevealText>
          </div>
        </Link>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* SCENE 7: FEATURED PIECES — Editorial 2-up  */}
      {/* ─────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 pt-32 pb-24">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-16 sm:mb-20 gap-6">
          <div>
            <RevealText className="text-[9px] uppercase tracking-[0.5em] font-bold text-zinc-400 mb-5">
              Featured
            </RevealText>
            <RevealText className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-none" delay={0.1}>
              The Edit
            </RevealText>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-900 border-b border-zinc-900 pb-1 hover:opacity-60 transition-opacity mb-2"
          >
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 2x2 asymmetric grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
          {featured.slice(0, 2).map((product, i) => (
            <EditorialProduct key={product.id} product={product} align={i % 2 === 0 ? "left" : "right"} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 mt-12 lg:mt-20">
          {featured.slice(2, 4).map((product, i) => (
            <EditorialProduct key={product.id} product={product} align={i % 2 === 0 ? "right" : "left"} />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* SCENE 8: FULL-BLEED KNITWEAR MOMENT        */}
      {/* ─────────────────────────────────────────── */}
      <section className="relative h-[70vh] sm:h-[85vh] w-full overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/6764036/pexels-photo-6764036.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Knitwear Collection"
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6]/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-10 sm:p-20">
          <RevealText className="text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-700 mb-6">
            Knitwear
          </RevealText>
          <RevealText className="font-serif text-5xl sm:text-7xl leading-none text-[#0a0a0a]" delay={0.1}>
            Fine Gauge.
          </RevealText>
          <RevealText className="font-serif text-5xl sm:text-7xl leading-none text-zinc-500 italic font-light" delay={0.2}>
            Refined Warmth.
          </RevealText>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10"
          >
            <Link
              href="/shop?category=Knitwear"
              className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-[#0a0a0a] border-b border-[#0a0a0a] pb-1 hover:opacity-60 transition-opacity"
            >
              Explore Knitwear <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* SCENE 9: BRAND VALUES TICKER               */}
      {/* ─────────────────────────────────────────── */}
      <div className="py-6 border-y border-zinc-200">
        <MarqueeTicker text="Craftsmanship · Quality · Elegance · Timeless · Confidence · ELVORA" count={3} />
      </div>

      {/* ─────────────────────────────────────────── */}
      {/* SCENE 10: CLOSING CTA                       */}
      {/* ─────────────────────────────────────────── */}
      <section className="py-40 sm:py-56 px-6 text-center">
        <RevealText className="text-[9px] uppercase tracking-[0.5em] font-bold text-zinc-400 mb-10">
          Ready to begin?
        </RevealText>
        <RevealText className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-none" delay={0.1}>
          Discover
        </RevealText>
        <RevealText className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-none italic font-light" delay={0.2}>
          The Collection.
        </RevealText>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-4 bg-[#0a0a0a] text-[#faf9f6] text-[10px] uppercase tracking-[0.35em] font-bold px-10 py-5 hover:bg-zinc-800 transition-colors"
          >
            Shop Now
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
