import Product from "@/Types/Product";
import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  selectedProduct: {},
  isModalOpen: false,
  crosshairVisible: false,
  setProducts: (products: Product[]) => set({ products }),
  setSelectedProduct: (productId: number) =>
    set((state: {products: Product[]}) => {
      const finalProduct = state.products.find(
        (product: Product) => product.id === productId
      );
      return { ...state, selectedProduct: finalProduct };
    }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  showCrosshair: () => set({ crosshairVisible: false }),
  hideCrosshair: () => set({ crosshairVisible: true }),
}));
