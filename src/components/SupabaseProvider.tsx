"use client";

import { useEffect } from "react";
import { useProductsStore } from "@/store/useProductsStore";

export default function SupabaseProvider() {
  useEffect(() => {
    useProductsStore.getState().fetchProducts();
  }, []);

  return null;
}
