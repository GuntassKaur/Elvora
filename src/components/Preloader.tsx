"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // If already shown this session, skip immediately
    if (typeof sessionStorage !== "undefined") {
      const shown = sessionStorage.getItem("elvora-preloader-shown");
      if (shown) {
        // Use a timeout to avoid setState-in-effect lint error
        const t = setTimeout(() => setHidden(true), 0);
        return () => clearTimeout(t);
      }
    }

    const duration = 1800;
    const startTime = Date.now();
    let animId: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * 100);
      setCount(current);

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setDone(true);
        const t = setTimeout(() => {
          setHidden(true);
          if (typeof sessionStorage !== "undefined") {
            sessionStorage.setItem("elvora-preloader-shown", "1");
          }
        }, 900);
        return () => clearTimeout(t);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (hidden) return null;

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center pointer-events-all"
        >
          {/* ELVORA wordmark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
            className="font-serif text-3xl text-[#faf9f6] uppercase mb-16 tracking-[0.45em]"
          >
            ELVORA
          </motion.div>

          {/* Progress line */}
          <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#faf9f6] transition-none"
              style={{ width: `${count}%` }}
            />
          </div>

          {/* Count */}
          <div className="mt-5 text-[#faf9f6]/30 text-[10px] tracking-[0.35em] font-medium uppercase">
            {count}%
          </div>

          {/* Bottom tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: done ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-12 text-[9px] tracking-[0.4em] font-medium text-[#faf9f6]/25 uppercase"
          >
            Wear Confidence.
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
