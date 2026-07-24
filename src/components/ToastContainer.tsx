"use client";

import { useCartStore, ToastMessage } from "@/store/useCartStore";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, Info, AlertTriangle } from "lucide-react";

export default function ToastContainer() {
  const toasts = useCartStore((state) => state.toasts);
  const removeToast = useCartStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClear={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onClear }: { toast: ToastMessage; onClear: () => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-black" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-zinc-500" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="pointer-events-auto flex items-center justify-between w-full p-4 bg-white border border-brand-border shadow-sm rounded-none"
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="text-xs uppercase tracking-wider font-medium text-brand-dark">
          {toast.message}
        </span>
      </div>
      <button
        onClick={onClear}
        className="p-1 hover:bg-zinc-50 transition-colors text-brand-muted hover:text-brand-dark"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
