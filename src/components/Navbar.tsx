"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Menu, X, Search, ArrowUpRight, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const supabase = createClient();

  const cart = useCartStore((state) => state.cart);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuth(!!session);
    };
    checkAuth();
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuth(!!session);
    });
    return () => authListener.subscription.unsubscribe();
  }, [supabase.auth]);

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  const currentGender = searchParams?.get("gender")?.toLowerCase() || "";
  const currentCategory = searchParams?.get("category")?.toLowerCase() || "";

  const isLinkActive = (linkHref: string) => {
    if (pathname !== "/shop") return false;
    if (linkHref === "/shop") {
      return !currentGender && !currentCategory;
    }
    if (linkHref.includes("gender=")) {
      const targetGender = linkHref.split("gender=")[1]?.toLowerCase();
      return currentGender === targetGender;
    }
    if (linkHref.includes("category=")) {
      const targetCategory = linkHref.split("category=")[1]?.toLowerCase();
      return currentCategory === targetCategory;
    }
    return false;
  };

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Women", href: "/shop?gender=women" },
    { label: "Men", href: "/shop?gender=men" },
    { label: "Accessories", href: "/shop?category=Accessories" },
    { label: "Footwear", href: "/shop?category=Footwear" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#0a0a0a] text-[#faf9f6] text-[9px] font-medium tracking-[0.25em] uppercase py-2.5 px-4 text-center z-50 relative">
        Complimentary delivery on orders above ₹2,000 &nbsp;·&nbsp; 15-day effortless returns
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#faf9f6]/95 backdrop-blur-md border-b border-zinc-200 py-3.5 shadow-sm"
            : isTransparent
            ? "bg-gradient-to-b from-black/70 via-black/30 to-transparent backdrop-blur-[2px] text-white py-4 border-b border-white/10"
            : "bg-[#faf9f6] border-b border-zinc-200 py-4"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between h-10">

            {/* Left nav */}
            <div className="flex items-center gap-8 flex-1">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 lg:hidden hover:opacity-50 transition-opacity"
                aria-label="Open menu"
              >
                <Menu className={`w-5 h-5 stroke-[1.25] ${isTransparent ? "text-white" : "text-[#0a0a0a]"}`} />
              </button>

              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`text-[10px] uppercase tracking-[0.22em] font-semibold transition-opacity hover:opacity-50 relative py-1 ${
                        isTransparent ? "text-white" : "text-[#0a0a0a]"
                      }`}
                    >
                      {link.label}
                      {active && (
                        <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-current" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center — Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2"
              aria-label="ELVORA"
            >
              <span className={`font-serif text-2xl sm:text-[1.7rem] tracking-[0.45em] font-normal uppercase leading-none block transition-colors ${
                isTransparent ? "text-white" : "text-[#0a0a0a]"
              }`}>
                ELVORA
              </span>
            </Link>

            {/* Right — Actions */}
            <div className={`flex items-center gap-1 sm:gap-3 flex-1 justify-end ${
              isTransparent ? "text-white" : "text-[#0a0a0a]"
            }`}>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:opacity-50 transition-opacity"
                aria-label="Search"
              >
                <Search className="w-[17px] h-[17px] stroke-[1.25]" />
              </button>

              <Link
                href={isAuth ? "/profile" : "/login"}
                className="p-2 hover:opacity-50 transition-opacity hidden sm:block"
                aria-label={isAuth ? "Profile" : "Sign In"}
              >
                <User className="w-[17px] h-[17px] stroke-[1.25]" />
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="p-2 flex items-center gap-2 hover:opacity-50 transition-opacity"
                aria-label={`Shopping bag with ${totalItems} item(s)`}
              >
                <div className="relative">
                  <ShoppingBag className="w-[17px] h-[17px] stroke-[1.25]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0a0a0a] text-[#faf9f6] text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-[#faf9f6]">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </div>
                <span className="text-[9px] tracking-[0.25em] uppercase font-bold hidden md:inline">
                  Bag{totalItems > 0 ? ` (${totalItems})` : ""}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[80vw] max-w-xs bg-[#0a0a0a] text-[#faf9f6] p-8 flex flex-col justify-between"
              role="dialog"
              aria-modal="true"
            >
              <div>
                <div className="flex justify-between items-center pb-8 border-b border-white/10 mb-10">
                  <span className="font-serif text-xl tracking-[0.45em] uppercase">ELVORA</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-white/60 hover:text-white"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 stroke-[1.25]" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const active = isLinkActive(link.href);
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-4 border-b border-white/5 text-sm uppercase tracking-[0.2em] font-semibold transition-colors ${
                          active ? "text-white font-bold" : "text-white/80 hover:text-white"
                        }`}
                      >
                        {link.label}
                        <ArrowUpRight className="w-4 h-4 opacity-30" />
                      </Link>
                    );
                  })}
                  <div className="pt-6">
                    <Link
                      href={isAuth ? "/profile" : "/login"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-4 text-sm uppercase tracking-[0.2em] font-semibold text-white/60 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {isAuth ? "My Account" : "Sign In"}
                    </Link>
                  </div>
                </nav>
              </div>

              <p className="text-[10px] font-serif italic text-white/20 tracking-wider">
                &ldquo;Wear Confidence.&rdquo;
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Full-screen Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#faf9f6]/98 backdrop-blur-xl z-50 flex flex-col items-center justify-center"
            role="search"
          >
            <button
              onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
              className="absolute top-8 right-8 p-2 text-zinc-400 hover:text-black transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6 stroke-[1.25]" />
            </button>

            <div className="w-full max-w-2xl px-6">
              <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-400 mb-8 text-center">
                What are you looking for?
              </p>
              <div className="flex items-center border-b-2 border-[#0a0a0a] pb-4">
                <Search className="w-5 h-5 text-zinc-400 stroke-[1.25] flex-shrink-0 mr-4" />
                <input
                  type="search"
                  placeholder="Search collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      setSearchOpen(false);
                      setSearchQuery("");
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                  className="flex-1 bg-transparent border-none text-2xl sm:text-3xl font-serif text-[#0a0a0a] focus:outline-none placeholder:text-zinc-300"
                  autoFocus
                />
              </div>
              <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-zinc-400 mt-4 text-right">
                Press Enter to search
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
