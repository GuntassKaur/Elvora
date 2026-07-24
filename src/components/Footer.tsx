"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function RevealText({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className={`overflow-hidden ${className || ""}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={inView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-[#faf9f6]">
      {/* Massive closing statement */}
      <div className="px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-16 border-b border-white/10">
        <RevealText className="font-serif text-[12vw] sm:text-[10vw] leading-none tracking-tight">
          ELVORA
        </RevealText>
        <RevealText className="font-serif text-[12vw] sm:text-[10vw] leading-none tracking-tight italic font-light text-white/30" delay={0.1}>
          Wear Confidence.
        </RevealText>
      </div>

      {/* Links grid */}
      <div className="px-6 sm:px-10 lg:px-16 py-16 grid grid-cols-2 sm:grid-cols-4 gap-10 border-b border-white/10">
        {/* Shop */}
        <div>
          <h3 className="text-[9px] uppercase tracking-[0.35em] font-bold text-white/40 mb-6">
            Shop
          </h3>
          <ul className="space-y-4">
            {[
              { label: "Women", href: "/shop?gender=women" },
              { label: "Men", href: "/shop?gender=men" },
              { label: "Accessories", href: "/shop?category=Accessories" },
              { label: "Footwear", href: "/shop?category=Footwear" },
              { label: "New Arrivals", href: "/shop" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-white/60 hover:text-white transition-colors font-light tracking-wide"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-[9px] uppercase tracking-[0.35em] font-bold text-white/40 mb-6">
            Account
          </h3>
          <ul className="space-y-4">
            {[
              { label: "Sign In", href: "/login" },
              { label: "Create Account", href: "/signup" },
              { label: "My Profile", href: "/profile" },
              { label: "My Orders", href: "/profile" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-white/60 hover:text-white transition-colors font-light tracking-wide"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-[9px] uppercase tracking-[0.35em] font-bold text-white/40 mb-6">
            Help
          </h3>
          <ul className="space-y-4">
            {[
              "Shipping & Delivery",
              "Returns & Exchanges",
              "Size Guide",
              "Contact Us",
            ].map((item) => (
              <li key={item}>
                <span className="text-xs text-white/40 font-light tracking-wide cursor-default">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-[9px] uppercase tracking-[0.35em] font-bold text-white/40 mb-6">
            Stay Connected
          </h3>
          <p className="text-xs text-white/40 font-light leading-relaxed mb-6">
            New arrivals, restocks, and editorial drops — delivered with intention.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector("input") as HTMLInputElement;
              if (input) input.value = "";
            }}
            className="flex border-b border-white/20 pb-2 group focus-within:border-white/60 transition-colors"
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              aria-label="Email for newsletter"
              className="flex-1 bg-transparent text-[11px] focus:outline-none placeholder:text-white/20 py-1 text-white tracking-wider"
            />
            <button
              type="submit"
              className="p-1 hover:opacity-60 transition-opacity"
              aria-label="Subscribe"
            >
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 sm:px-10 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 font-medium">
          © {currentYear} ELVORA. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Instagram", "Pinterest"].map((social) => (
            <a
              key={social}
              href="#"
              className="text-[9px] uppercase tracking-[0.3em] text-white/25 hover:text-white/60 transition-colors font-medium"
              aria-label={`ELVORA on ${social}`}
            >
              {social}
            </a>
          ))}
        </div>
        <p className="text-[9px] uppercase tracking-[0.3em] text-white/15 font-medium">
          Wear Confidence.
        </p>
      </div>
    </footer>
  );
}
