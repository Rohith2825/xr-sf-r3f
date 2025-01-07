import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  selectedProduct: {},
  isModalOpen: false,
  crosshairVisible: false,
  touchEnabled: false,
  driverActive: false,
  tourComplete: false,
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
  setTouchEnabled: () => set({ touchEnabled: true }),
  activateDriver: () => set({ driverActive: true }),
  deactivateDriver: () => set({ driverActive: false }),
  setTourComplete: (value) => set({ tourComplete: value }),
}));
