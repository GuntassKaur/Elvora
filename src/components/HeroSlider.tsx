"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  link: string;
  btnText: string;
}

const slides: Slide[] = [
  {
    title: "The Signature Collection",
    subtitle: "New Season — 2025",
    desc: "Uncompromising elegance for the modern visionary.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000",
    link: "/shop",
    btnText: "Explore Collection",
  },
  {
    title: "Modern Tailoring",
    subtitle: "Men's Edit",
    desc: "Sharp, effortless, and meticulously crafted.",
    image: "https://images.unsplash.com/photo-1550614000-4b95d466989a?q=80&w=2000",
    link: "/shop?gender=men",
    btnText: "Shop Men's",
  },
  {
    title: "Timeless Silhouettes",
    subtitle: "Women's Edit",
    desc: "Fluid lines and relaxed luxury.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000",
    link: "/shop?gender=women",
    btnText: "Shop Women's",
  },
  {
    title: "The Evening Standard",
    subtitle: "Exclusive",
    desc: "Make a statement that echoes beyond the night.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000",
    link: "/shop",
    btnText: "Discover Eveningwear",
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), AUTOPLAY_INTERVAL);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), AUTOPLAY_INTERVAL);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    } else if (touchEndX.current - touchStartX.current > 50) {
      handlePrev();
    }
    setIsPaused(false);
  };

  return (
    <section 
      className="relative h-[100vh] w-full overflow-hidden bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero slider"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Subtle slow parallax zoom on the image */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
            className="w-full h-full relative"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              priority={current === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-24 sm:pb-32 px-6 sm:px-12 max-w-7xl mx-auto w-full pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="max-w-2xl space-y-4 sm:space-y-6 pointer-events-auto"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300"
            >
              {slides[current].subtitle}
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight leading-[0.95]"
            >
              {slides[current].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-sm sm:text-base text-zinc-300 font-light tracking-wide max-w-md"
            >
              {slides[current].desc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-4"
            >
              <Link
                href={slides[current].link}
                className="inline-flex items-center justify-center border border-white px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] hover:bg-white hover:text-black transition-colors duration-300 pointer-events-auto"
              >
                {slides[current].btnText}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation & Progress */}
      <div className="absolute bottom-0 left-0 w-full z-30 px-6 sm:px-12 max-w-7xl mx-auto left-1/2 -translate-x-1/2 pb-8 flex items-center justify-between">
        
        {/* Progress Bar Container */}
        <div className="flex gap-2 w-1/3 sm:w-1/4">
          {slides.map((_, idx) => (
            <div key={idx} className="h-0.5 w-full bg-white/20 relative overflow-hidden">
              {current === idx && (
                <motion.div
                  key={current + "progress"} // force re-render for progress bar on current change
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                  className="absolute inset-0 bg-white origin-left"
                />
              )}
              {idx < current && (
                <div className="absolute inset-0 bg-white" />
              )}
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-4 text-white pointer-events-auto">
          <button 
            onClick={handlePrev}
            className="p-2 hover:bg-white/10 transition-colors rounded-full pointer-events-auto"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
          </button>
          <span className="text-xs font-mono tracking-widest text-zinc-400">
            0{current + 1} / 0{slides.length}
          </span>
          <button 
            onClick={handleNext}
            className="p-2 hover:bg-white/10 transition-colors rounded-full pointer-events-auto"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
