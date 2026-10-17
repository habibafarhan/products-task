export interface Product {
    id: number;
    title: string;
    brand?: string;
    price: number;
    rating: number;
    thumbnail: string;
    description: string;
  }
  
  export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  }
  
  export const PRODUCTS_PER_PAGE = 12;
  const BASE_URL = "https://dummyjson.com/products";
  
  const paging = (page: number) =>
    `limit=${PRODUCTS_PER_PAGE}&skip=${(page - 1) * PRODUCTS_PER_PAGE}`;
  
  async function request<T>(url: string, errorMessage: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(errorMessage);
    return response.json();
  }
  
  export function getProducts(page: number): Promise<ProductsResponse> {
    return request(`${BASE_URL}?${paging(page)}`, "Failed to fetch products");
  }
  
  export function searchProducts(
    query: string,
    page: number
  ): Promise<ProductsResponse> {
    return request(
      `${BASE_URL}/search?q=${encodeURIComponent(query)}&${paging(page)}`,
      "Failed to search products"
    );
  }
  
  export function getProductsByCategory(
    category: string,
    page: number
  ): Promise<ProductsResponse> {
    return request(
      `${BASE_URL}/category/${category}?${paging(page)}`,
      "Failed to fetch category"
    );
  }
  
  export function getProductById(id: string): Promise<Product> {
    return request(`${BASE_URL}/${id}`, "Failed to fetch product details");
  }