import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  selectedProduct: {},
  isModalOpen: false,
  isDiscountModalOpen: false,
  crosshairVisible: false,
  touchEnabled: false,
  driverActive: false,
  tourComplete: false,
  discountCode: "",
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
  openDiscountModal: () => set({ isDiscountModalOpen: true }),
  closeDiscountModal: () => set({ isDiscountModalOpen: false }),
  showCrosshair: () => set({ crosshairVisible: false }),
  hideCrosshair: () => set({ crosshairVisible: true }),
  setTouchEnabled: () => set({ touchEnabled: true }),
  activateDriver: () => set({ driverActive: true }),
  deactivateDriver: () => set({ driverActive: false }),
  setTourComplete: (value) => set({ tourComplete: value }),
  setDiscountCode: (code: string) => set({ discountCode: code }),
}));