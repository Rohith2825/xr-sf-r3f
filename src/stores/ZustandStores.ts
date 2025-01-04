import Product from "@/Types/Product";
import { create } from "zustand";

interface ZustandStore {
  // Crosshair handling
  crosshairVisible: boolean,
  showCrosshair: () => void,
  hideCrosshair: () => void,

  // Product handling
  products: Product[],
  selectedProduct: unknown,
  setProducts: (products: Product[]) => void,
  setSelectedProduct: (productId: number) => void

  // Modal Handling
  isModalOpen: boolean,
  openModal: () => void,
  closeModal: () => void,

  // Cart Handling
  isCartOpen: boolean,
  openCart: () => void,
  closeCart: () => void,
    
  // Wishlist Handling
  isWishlistOpen: boolean,
  openWishlist: () => void,
  closeWishlist: () => void,

  // Info Handling
  isInfoModalOpen: boolean,
  openInfoModal: () => void,
  closeInfoModal: () => void,
}

export const useZustandStore = create<ZustandStore>((set) => ({
  // Crosshair
  crosshairVisible: true,
  showCrosshair: () => set({ crosshairVisible: true }),
  hideCrosshair: () => set({ crosshairVisible: false }),

  // Product Handling
  products: [],
  selectedProduct: {},
  setProducts: (products: Product[]) => set({ products }),
  setSelectedProduct: (productId: number) =>
    set((state: {products: Product[]}) => {
      const finalProduct = state.products.find(
        (product: Product) => product.id === productId
      );
      return { ...state, selectedProduct: finalProduct };
    }),

    // Modal Handling
    isModalOpen: false,
    openModal: () => {
      set({ crosshairVisible: false });
      set({ isModalOpen: true });
    },
    closeModal: () =>{
      set({ crosshairVisible: true });
      set({ isModalOpen: false });
    },

    // Cart Handling
    isCartOpen: false,
    openCart: () => {
      set({ crosshairVisible: false });
      set({ isCartOpen: true });
    },
    closeCart: () => {
      set({ crosshairVisible: true });
      set({ isCartOpen: false });
    },
    
    // Wishlist Handling
    isWishlistOpen: false,
    openWishlist: () => {
      set({ crosshairVisible: false });
      set({ isWishlistOpen: true });
    },
    closeWishlist: () => {
      set({ crosshairVisible: true });
      set({ isWishlistOpen: false });
    },

    // Info Handling
    isInfoModalOpen: false,
    openInfoModal: () => {
      set({ crosshairVisible: false });
      set({ isInfoModalOpen: true });
    },
    closeInfoModal: () => {
      set({ crosshairVisible: true });
      set({ isInfoModalOpen: false });
    }
}));