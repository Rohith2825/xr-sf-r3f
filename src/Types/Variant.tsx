export default interface Variant{
  id: number;
  price: string;
  compareAtPrice: string | undefined;
  productId: number;
  selectedOptions: {
    name: string,
    value: string
  }[];
  availableForSale: boolean;
}