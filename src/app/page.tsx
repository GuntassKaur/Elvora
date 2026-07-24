"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProductsStore } from "@/store/useProductsStore";
import { ArrowRight } from "lucide-react";
import { Product } from "@/data/products";

// ─── UTILS ───
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

// ─── HERO SECTION ───
function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1920&q=80"
          alt="ELVORA Collection"
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 transition-colors duration-1000" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto mt-20">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/80 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium mb-6"
        >
          Autumn / Winter 2026
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-white font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] mb-6 tracking-tight"
        >
          The Art of <br className="hidden sm:block" />
          <span className="italic font-light">Refined Tailoring</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-white/80 text-sm sm:text-base font-light max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Discover a collection defined by architectural silhouettes, premium fabrics, and timeless elegance. Designed for the modern wardrobe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-white/90 transition-all duration-300"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── COLLECTIONS SECTION ───
function CollectionsSection() {
  const collections = [
    { title: "Women", image: "https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=800", link: "/shop?gender=women" },
    { title: "Men", image: "https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=800", link: "/shop?gender=men" },
    { title: "Accessories", image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800", link: "/shop?category=Accessories" },
    { title: "Footwear", image: "https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=800", link: "/shop?category=Footwear" },
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0a0a0a]">Luxury Collections</h2>
        </div>
        <Link href="/shop" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 hover:text-black border-b border-zinc-300 hover:border-black pb-1 transition-all">
          View All Categories
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {collections.map((col, i) => (
          <Link key={i} href={col.link} className="group relative block w-full aspect-[3/4] overflow-hidden bg-zinc-100">
            <Image
              src={col.image}
              alt={col.title}
              fill
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute bottom-8 left-0 w-full text-center">
              <span className="text-white font-serif text-2xl sm:text-3xl tracking-wide">{col.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── FEATURED STORY SECTION ───
function FeaturedStorySection() {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[#FAF9F6]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src="https://images.pexels.com/photos/6764036/pexels-photo-6764036.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="The Knitwear Edit"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col items-start justify-center max-w-lg">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-zinc-500 mb-6">Featured Story</span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#0a0a0a] leading-tight mb-8">
            The Fine Gauge <br /> <span className="italic font-light text-zinc-600">Knitwear Edit.</span>
          </h2>
          <p className="text-zinc-600 font-light leading-relaxed mb-10 text-sm sm:text-base">
            Crafted from the finest sustainably sourced cashmere and merino wool, our latest knitwear collection focuses on extreme comfort without sacrificing structural elegance. Perfect for the transitional seasons.
          </p>
          <Link
            href="/shop?category=Knitwear"
            className="group inline-flex items-center gap-3 border border-black text-black px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-black hover:text-white transition-all duration-300"
          >
            Shop Knitwear
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── BEST SELLERS SECTION (HORIZONTAL CARDS) ───
function HorizontalProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group flex flex-row items-center gap-6 p-4 border border-zinc-200 hover:border-black transition-colors duration-300 bg-white">
      <div className="relative w-24 sm:w-32 aspect-[3/4] bg-zinc-100 overflow-hidden flex-shrink-0">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="150px"
          />
        )}
      </div>
      <div className="flex flex-col justify-center flex-grow pr-4">
        <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-zinc-400 mb-2">{product.category}</span>
        <h3 className="font-serif text-lg sm:text-xl text-[#0a0a0a] mb-2 group-hover:opacity-70 transition-opacity">{product.name}</h3>
        <span className="text-sm font-medium">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}

function BestSellersSection({ products }: { products: Product[] }) {
  const bestSellers = products.filter((p) => p.isFeatured).slice(0, 4);
  
  if (bestSellers.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-white">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0a0a0a] mb-4">Best Sellers</h2>
        <p className="text-zinc-500 font-light text-sm max-w-md mx-auto">Iconic pieces that define the ELVORA wardrobe.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-6xl mx-auto">
        {bestSellers.map((product) => (
          <HorizontalProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ─── BRAND PHILOSOPHY SECTION ───
function PhilosophySection() {
  return (
    <section className="py-32 sm:py-48 px-6 sm:px-12 bg-[#0a0a0a] text-white text-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/50 mb-12">Our Philosophy</span>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight font-light"
        >
          &quot;Elegance is not about being noticed, <br className="hidden sm:block" />
          it is about being <span className="italic">remembered</span>.&quot;
        </motion.p>
        <div className="w-12 h-[1px] bg-white/30 mt-12 mb-12" />
        <Link
          href="/shop"
          className="text-[11px] uppercase tracking-[0.2em] font-semibold hover:text-white/70 transition-colors border-b border-white pb-1 hover:border-white/70"
        >
          Discover The Maison
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  const products = useProductsStore((state) => state.products);

  return (
    <div className="bg-white">
      <HeroSection />
      <CollectionsSection />
      <FeaturedStorySection />
      <BestSellersSection products={products} />
      <PhilosophySection />
    </div>
  );
}
