import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Color } from "../data/products";
import { ShippingData, PaymentData } from "../lib/schemas";

export interface CartItem {
  id: string; // unique: productId-size-colorName
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: Color;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

// Snapshot stored at order time so success page can display it after cart clears
export interface OrderSnapshot {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  orderId: string;
  deliveryDate: string;
  customerName: string;
  shippingAddress: string;
  paymentTimestamp: string;
  paymentMethod: string;
}

interface CartState {
  cart: CartItem[];
  cartOpen: boolean;
  shippingInfo: ShippingData | null;
  paymentInfo: PaymentData | null;
  orderSnapshot: OrderSnapshot | null;
  toasts: ToastMessage[];

  // Cart Actions
  addToCart: (product: Product, quantity: number, size: string, color: Color) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // UI Actions
  setCartOpen: (open: boolean) => void;
  setShippingInfo: (info: ShippingData | null) => void;
  setPaymentInfo: (info: PaymentData | null) => void;
  setOrderSnapshot: (snapshot: OrderSnapshot | null) => void;
  addToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartOpen: false,
      shippingInfo: null,
      paymentInfo: null,
      orderSnapshot: null,
      toasts: [],

      addToCart: (product, quantity, size, color) => {
        const cartItemId = `${product.id}-${size}-${color.name
          .replace(/\s+/g, "-")
          .toLowerCase()}`;
        const existingCart = get().cart;
        const existingIndex = existingCart.findIndex(
          (item) => item.id === cartItemId
        );

        let newCart: CartItem[];
        if (existingIndex > -1) {
          // Spread to avoid direct mutation (important for Zustand persist)
          newCart = existingCart.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newCart = [
            ...existingCart,
            { id: cartItemId, product, quantity, selectedSize: size, selectedColor: color },
          ];
        }
        set({ cart: newCart, cartOpen: true });
        get().addToast(`${product.name} added to bag`, "success");
      },

      removeFromCart: (cartItemId) => {
        const removedItem = get().cart.find((item) => item.id === cartItemId);
        set({ cart: get().cart.filter((item) => item.id !== cartItemId) });
        if (removedItem) {
          get().addToast(`${removedItem.product.name} removed from bag`, "info");
        }
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [], shippingInfo: null, paymentInfo: null }),

      setCartOpen: (open) => set({ cartOpen: open }),
      setShippingInfo: (info) => set({ shippingInfo: info }),
      setPaymentInfo: (info) => set({ paymentInfo: info }),
      setOrderSnapshot: (snapshot) => set({ orderSnapshot: snapshot }),

      addToast: (message, type = "success") => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }],
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 3500);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "elvora-cart-v2",
      partialize: (state) => ({
        cart: state.cart,
        orderSnapshot: state.orderSnapshot,
        shippingInfo: state.shippingInfo,
        paymentInfo: state.paymentInfo,
      }),
    }
  )
);
