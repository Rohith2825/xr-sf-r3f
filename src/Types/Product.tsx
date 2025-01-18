import Variant from "./Variant";

export default interface Product {
  id: number;
  title: string;
  description?: string;
  images: { src: string }[];
  models: {
    id: string | undefined;
    sources:
      | {
          url: string;
          format: string;
          mimeType: string;
        }[]
      | undefined;
  }[];
  options: {
    id: string;
    name: string;
    position: number;
    values: string[];
  }[];
  variants: Variant[];
  arLensLink: string | undefined;
  tags: string;
  position: number[] | undefined;
  sale: boolean | undefined;
  scale: number | undefined;
  environmentModalUrl: string | undefined;
  environmentModal: boolean | undefined;
  predefinded : boolean | undefined;
  placeholder : number | undefined;
  environmentModal3D : boolean | undefined;
  environmentModalImage : boolean | undefined;
}
