import { create } from "zustand";
import { products as localProducts, Product } from "@/data/products";
import { fetchProductsFromDatabase } from "@/lib/products";

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: localProducts, // Default to local products immediately for zero layout shift
  isLoading: true,
  fetchProducts: async () => {
    try {
      set({ isLoading: true });
      const fetchedProducts = await fetchProductsFromDatabase();
      set({ products: fetchedProducts, isLoading: false });
    } catch (err) {
      console.warn("Products store fetch exception, falling back to local dataset:", err);
      set({ products: localProducts, isLoading: false });
    }
  },
}));
