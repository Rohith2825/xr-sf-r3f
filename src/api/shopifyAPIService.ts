import Variant from '@/Types/Variant';
import Product from '../Types/Product';

const BASE_URL = "https://strategy-fox-go-bked.com/api/shopify";

async function fetchData<T>(method: "GET", endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

interface ProductResponse {
  data: {
    products: {
      edges: {
        node: {
          id: string,
          title: string,
          media: {
            edges: {
              node: {
                mediaContentType: string,
                image?: {
                  url: string,
                  altText: string
                },
                id?: string,
                sources?: {
                  url: string,
                  format: string,
                  mimeType: string
                }[]
              }
            }[]
          }
          options: {
            id: string,
            name: string,
            values: string[]
          }[],
          variants: {
            edges: {
              node: {
                id: string,
                title: string,
                price: string,
                compareAtPrice?: string,
                availableForSale: boolean,
                selectedOptions: {
                  name: string,
                  value: string
                }[],
              }
            }[]
          }
        }
      }[]
    }
  }
}

export const ProductService = {
  async getAllProducts(): Promise<Product[]> {
    const response = await fetchData<ProductResponse>("GET", "/v1/products");

    // Parse the response to suit the Product and Variant types
    const products: Product[] = response.data.products.edges.map((product) => {
      // Extract Images
      const productImages: { src: string }[] = product.node.media.edges.filter((edge) =>
        edge.node.mediaContentType.toUpperCase() === "IMAGE" // Filter images
        && edge.node.image // Filter images that might not have url
      ).map((edge) => {
        return { src: edge.node.image?.url || "" };
      });

      // Extract 3d Models
      const models: {
        id: string|undefined,
        sources: {
          url: string,
          format: string,
          mimeType: string
        }[] | undefined
      }[] = product.node.media.edges.filter((edge) => 
        edge.node.mediaContentType.toUpperCase() === "MODEL_3D"
        && edge.node.sources
      ).map((edge) => {
        return { 
          id: edge.node.id,
          sources: edge.node.sources
        }
      });

      // Variants
      const productVariants: Variant[] = product.node.variants.edges.map((variant) => {
        return {
          id: Number(variant.node.id.split("/").pop()),
          price: variant.node.price,
          compareAtPrice: variant.node.compareAtPrice,
          productId: Number(product.node.id.split("/").pop()),
          selectedOptions: variant.node.selectedOptions
        }
      });

      const parsedProduct: Product = {
        id: Number(product.node.id.split("/").pop()),
        title: product.node.title,
        description: "",
        images: productImages,
        variants: productVariants,
        models: models
      };

      return parsedProduct;
    });

    return products;
  },

  async getProductById(id: number | string): Promise<Product> {
    const response = await fetchData<{ product: Product }>("GET", `/products/${id}`);
    return response.product;
  },

  async getProductModel(id: number | string): Promise<Product> {
    return fetchData<Product>("GET", `/products/${id}/model`);
  },
};
