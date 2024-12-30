const BASE_URL = "https://strategy-fox-go-bked.com/api/shopify";

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  [key: string]: any;
}

export interface ProductResponse {
  products: Product[];
}
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

    console.log(response);

    return await response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

export const ProductService = {
  async getAllProducts(): Promise<ProductResponse> {
    return fetchData<ProductResponse>("GET", "/v1/products");
  },

  async getProductById(id: number | string): Promise<Product> {
    return fetchData<Product>("GET", `/products/${id}`);
  },

  async getProductModel(id: number | string): Promise<Product> {
    return fetchData<Product>("GET", `/products/${id}/model`);
  },
};
