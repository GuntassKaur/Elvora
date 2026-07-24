"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProductsStore } from "@/store/useProductsStore";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read current filter state directly from URL searchParams (single source of truth)
  const selectedGender = searchParams.get("gender") || "all";
  const selectedCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";

  // Local state for UI controls not tied to global navigation URL
  const [maxPrice, setMaxPrice] = useState<number>(60000);
  const [sortBy, setSortBy] = useState<string>("default");

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const products = useProductsStore((state) => state.products);

  const categories = ["all", "Outerwear", "Knitwear", "Tailoring", "Accessories", "Footwear"];
  const genders = ["all", "women", "men", "unisex"];
  const sortOptions = [
    { value: "default", label: "Recommended" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  const updateUrlParams = (gender: string, category: string, search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (gender && gender.toLowerCase() !== "all") {
      params.set("gender", gender.toLowerCase());
    } else {
      params.delete("gender");
    }

    if (category && category.toLowerCase() !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (search && search.trim() !== "") {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  };

  const handleGenderSelect = (gender: string) => {
    updateUrlParams(gender, selectedCategory, searchQuery);
    setActiveDropdown(null);
  };

  const handleCategorySelect = (category: string) => {
    updateUrlParams(selectedGender, category, searchQuery);
    setActiveDropdown(null);
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter products based on URL parameters and price range
  const filteredProducts = products.filter((product) => {
    const targetGender = selectedGender.toLowerCase();
    const matchesGender =
      targetGender === "all" ||
      product.gender.toLowerCase() === targetGender ||
      product.gender.toLowerCase() === "unisex";

    const targetCategory = selectedCategory.toLowerCase();
    const matchesCategory =
      targetCategory === "all" ||
      product.category.toLowerCase() === targetCategory;

    const matchesPrice = product.price <= maxPrice;

    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGender && matchesCategory && matchesPrice && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  const clearFilters = () => {
    setMaxPrice(60000);
    setSortBy("default");
    router.push("/shop");
  };

  const hasActiveFilters =
    selectedGender.toLowerCase() !== "all" ||
    selectedCategory.toLowerCase() !== "all" ||
    maxPrice < 60000 ||
    searchQuery !== "" ||
    sortBy !== "default";

  // Compute Category Hero Banner Info & Image
  const getHeroInfo = () => {
    const cat = selectedCategory.toLowerCase();
    const gen = selectedGender.toLowerCase();

    if (gen === "women" && cat === "all") {
      return {
        title: "Women's Collection",
        tagline: "Architecturally tailored trench coats, fine-knit sweaters, and fluid silk pieces.",
        image: "https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=1920",
      };
    }

    if (gen === "men" && cat === "all") {
      return {
        title: "Men's Collection",
        tagline: "Double-breasted suit jackets, wide-leg pleated trousers, and essential leather goods.",
        image: "https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=1920",
      };
    }

    switch (cat) {
      case "footwear":
        return {
          title: "Footwear Collection",
          tagline: "Architectural leather boots, suede loafers, and handcrafted leather footwear.",
          image: "https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=1920",
        };
      case "outerwear":
        return {
          title: "Outerwear Collection",
          tagline: "Water-resistant cotton gabardine trench coats and heavyweight wool cocoon coats.",
          image: "https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=1920",
        };
      case "tailoring":
        return {
          title: "Tailoring Collection",
          tagline: "Precision-cut blazers, wide-leg trousers, and fluid silk tailoring.",
          image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1920",
        };
      case "accessories":
        return {
          title: "Accessories Collection",
          tagline: "Full-grain leather totes, 925 sterling silver jewelry, and wool scarves.",
          image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1920",
        };
      case "knitwear":
        return {
          title: "Knitwear Collection",
          tagline: "Fine-gauge ribbed knits, cashmere turtlenecks, and chunky cardigans.",
          image: "https://images.pexels.com/photos/6764036/pexels-photo-6764036.jpeg?auto=compress&cs=tinysrgb&w=1920",
        };
      default:
        return {
          title: "The Catalogue",
          tagline: "Timeless tailoring, architectural outerwear, and essential luxury wardrobe pieces.",
          image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920",
        };
    }
  };

  const heroInfo = getHeroInfo();

  return (
    <div className="bg-white min-h-screen font-sans pb-24">
      {/* Category Hero */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] bg-[#0a0a0a] overflow-hidden">
        <Image
          src={heroInfo.image}
          alt={heroInfo.title}
          fill
          className="object-cover object-center transition-all duration-700"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-8 sm:p-12">
          <span className="text-[9px] tracking-[0.35em] text-white/70 uppercase font-bold mb-3">
            ELVORA Catalogue
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-none mb-2">
            {heroInfo.title}
          </h1>
          <p className="text-xs font-serif italic text-white/60 tracking-wider max-w-md">
            {heroInfo.tagline}
          </p>
        </div>
      </div>

      {/* Sticky Horizontal Filter Bar */}
      <div className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-zinc-200 w-full transition-all">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 flex justify-between items-center h-16">

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-8 h-full">

            {/* Category Dropdown */}
            <div className="relative h-full flex items-center" onMouseLeave={() => setActiveDropdown(null)}>
              <button
                onMouseEnter={() => setActiveDropdown("category")}
                onClick={() => setActiveDropdown(activeDropdown === "category" ? null : "category")}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-900 h-full px-2"
              >
                Category {selectedCategory.toLowerCase() !== "all" && <span className="w-1.5 h-1.5 rounded-full bg-black ml-1" />}
                <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
              <AnimatePresence>
                {activeDropdown === "category" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-16 left-0 bg-white border border-zinc-200 shadow-2xl p-6 min-w-[240px] z-50 flex flex-col gap-3"
                  >
                    {categories.map((c) => (
                      <button
                        key={c} onClick={() => handleCategorySelect(c)}
                        className={`text-xs uppercase tracking-[0.15em] text-left transition-colors flex items-center justify-between py-1 ${
                          selectedCategory.toLowerCase() === c.toLowerCase() ? "text-black font-bold" : "text-zinc-500 hover:text-black"
                        }`}
                      >
                        {c === "all" ? "All Categories" : c}
                        {selectedCategory.toLowerCase() === c.toLowerCase() && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Gender Dropdown */}
            <div className="relative h-full flex items-center" onMouseLeave={() => setActiveDropdown(null)}>
              <button
                onMouseEnter={() => setActiveDropdown("gender")}
                onClick={() => setActiveDropdown(activeDropdown === "gender" ? null : "gender")}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-900 h-full px-2"
              >
                Gender {selectedGender.toLowerCase() !== "all" && <span className="w-1.5 h-1.5 rounded-full bg-black ml-1" />}
                <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
              <AnimatePresence>
                {activeDropdown === "gender" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-16 left-0 bg-white border border-zinc-200 shadow-2xl p-6 min-w-[200px] z-50 flex flex-col gap-3"
                  >
                    {genders.map((g) => (
                      <button
                        key={g} onClick={() => handleGenderSelect(g)}
                        className={`text-xs uppercase tracking-[0.15em] text-left transition-colors flex items-center justify-between py-1 ${
                          selectedGender.toLowerCase() === g.toLowerCase() ? "text-black font-bold" : "text-zinc-500 hover:text-black"
                        }`}
                      >
                        {g === "all" ? "All" : g}
                        {selectedGender.toLowerCase() === g.toLowerCase() && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price Dropdown */}
            <div className="relative h-full flex items-center" onMouseLeave={() => setActiveDropdown(null)}>
              <button
                onMouseEnter={() => setActiveDropdown("price")}
                onClick={() => setActiveDropdown(activeDropdown === "price" ? null : "price")}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-900 h-full px-2"
              >
                Price {maxPrice < 60000 && <span className="w-1.5 h-1.5 rounded-full bg-black ml-1" />}
                <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
              <AnimatePresence>
                {activeDropdown === "price" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-16 left-0 bg-white border border-zinc-200 shadow-2xl p-8 min-w-[300px] z-50 flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-900">Max Price</span>
                      <span className="text-xs font-semibold">{formatINR(maxPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min="1000" max="60000" step="1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full accent-black cursor-pointer bg-zinc-200 h-1 rounded-full appearance-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 hover:text-red-500 transition-colors ml-4">
                Clear Filters
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-900"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
            Filters {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-black ml-1" />}
          </button>

          {/* Search & Sort */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center relative group">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  updateUrlParams(selectedGender, selectedCategory, e.target.value);
                }}
                className="w-44 border-b border-zinc-300 py-1.5 pl-1 pr-6 text-[10px] uppercase tracking-[0.15em] focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-zinc-400"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-1 top-2 stroke-[1.5]" />
            </div>

            <div className="relative flex items-center">
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mr-2">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-900 focus:outline-none cursor-pointer appearance-none pr-6"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 pt-12">
        {/* Results count */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
            Showing {sortedProducts.length} Product{sortedProducts.length !== 1 ? "s" : ""}
          </span>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-[9px] uppercase tracking-[0.2em] font-bold bg-zinc-100 px-3 py-1.5 flex items-center gap-1.5 hover:bg-zinc-200 transition-colors">
              Clear All Filters <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {sortedProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-y-16"
            >
              {sortedProducts.map((product, idx) => (
                <div key={product.id} className="col-span-1">
                  <ProductCard product={product} priority={idx < 4} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center text-center space-y-6"
            >
              <SlidersHorizontal className="w-12 h-12 stroke-[1] text-zinc-300" />
              <div>
                <h3 className="font-serif text-3xl font-normal text-zinc-900 mb-2">No products found</h3>
                <p className="text-sm text-zinc-500 font-light">We couldn&apos;t find anything matching your current filters.</p>
              </div>
              <button onClick={clearFilters} className="border-b border-black text-xs font-bold uppercase tracking-[0.2em] pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all">
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Sheet Filters */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white z-50 lg:hidden rounded-t-3xl h-[85vh] flex flex-col shadow-2xl"
            >
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-zinc-200 rounded-full" />
              </div>

              <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-100">
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-900">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 -mr-2">
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
                {/* Mobile Category */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-900 border-b border-zinc-100 pb-2">Category</h3>
                  <div className="flex flex-col gap-3">
                    {categories.map((c) => (
                      <button
                        key={c} onClick={() => handleCategorySelect(c)}
                        className={`text-xs uppercase tracking-[0.15em] text-left flex justify-between ${selectedCategory.toLowerCase() === c.toLowerCase() ? "font-bold text-black" : "text-zinc-500 font-medium"}`}
                      >
                        {c === "all" ? "All Categories" : c}
                        {selectedCategory.toLowerCase() === c.toLowerCase() && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Gender */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-900 border-b border-zinc-100 pb-2">Gender</h3>
                  <div className="flex flex-col gap-3">
                    {genders.map((g) => (
                      <button
                        key={g} onClick={() => handleGenderSelect(g)}
                        className={`text-xs uppercase tracking-[0.15em] text-left flex justify-between ${selectedGender.toLowerCase() === g.toLowerCase() ? "font-bold text-black" : "text-zinc-500 font-medium"}`}
                      >
                        {g === "all" ? "All" : g}
                        {selectedGender.toLowerCase() === g.toLowerCase() && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price */}
                <div className="space-y-6">
                  <div className="flex justify-between items-baseline border-b border-zinc-100 pb-2">
                    <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-900">Max Price</h3>
                    <span className="text-xs font-semibold">{formatINR(maxPrice)}</span>
                  </div>
                  <input
                    type="range" min="1000" max="60000" step="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-black h-1 bg-zinc-200 rounded-full appearance-none"
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 border-t border-zinc-100 bg-white grid grid-cols-2 gap-4">
                <button
                  onClick={clearFilters}
                  className="w-full border border-zinc-300 text-zinc-900 h-14 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-black text-white h-14 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  View Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-[0.2em] font-medium text-zinc-400">
          Loading Collection...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
