import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../data/products";

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  
  // Actions
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        const existing = get().items.find((item) => item.product.id === product.id);
        if (!existing) {
          set({
            items: [...get().items, { product, addedAt: new Date().toISOString() }],
          });
        }
      },

      removeFromWishlist: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (productId) => {
        return get().items.some((item) => item.product.id === productId);
      },
    }),
    {
      name: "elvora-wishlist",
    }
  )
);
