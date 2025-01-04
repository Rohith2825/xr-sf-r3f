import Variant from './Variant';

export default interface Product{
  id: number;
  title: string;
  description?: string;
  images: {src: string}[];
  variants: Variant[];
}