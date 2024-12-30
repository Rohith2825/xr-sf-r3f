import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  selectedProduct: {},
  isModalOpen: false,
  crosshairVisible: false,
  setProducts: (products: any) => set({ products }),
  setSelectedProduct: (productId: number) =>
    set((state) => {
      const finalProduct = state.products.find(
        (product) => product.node.id === `gid://shopify/Product/${productId}`
      );
      return { ...state, selectedProduct: finalProduct };
    }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  showCrosshair: () => set({ crosshairVisible: false }),
  hideCrosshair: () => set({ crosshairVisible: true }),
}));
