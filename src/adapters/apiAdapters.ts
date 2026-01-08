/**
 * API Adapters for different product endpoints
 * Converts external API formats to our Bundles component format
 *
 * Supported APIs:
 * - DummyJSON (Health & Beauty products)
 * - Holland & Barrett custom format
 */

// DummyJSON API types
interface DummyJSONProduct {
  id: number;
  title: string;
  price: number;
  stock: number;
  thumbnail: string;
  images: string[];
}

interface DummyJSONResponse {
  products: DummyJSONProduct[];
  total: number;
  skip: number;
  limit: number;
}

// Our Bundles component format
export interface BundlesProduct {
  id: number;
  image: string;
  sku: string;
  title: string;
  price: string;
  stock: number;
}

/**
 * Adapt DummyJSON API products to Bundles format
 */
export function adaptDummyJSONProducts(response: DummyJSONResponse): BundlesProduct[] {
  return response.products.map((product) => ({
    id: product.id,
    image: product.thumbnail,
    sku: `DJ${product.id.toString().padStart(3, '0')}`,
    title: product.title.length > 50 ? product.title.substring(0, 47) + '...' : product.title,
    price: product.price.toFixed(2),
    stock: product.stock,
  }));
}

/**
 * Detect API type from endpoint URL
 */
export function detectAPIType(endpoint: string): 'dummyjson' | 'hb' {
  const url = endpoint.toLowerCase();

  if (url.includes('dummyjson.com')) {
    return 'dummyjson';
  }

  // Default to H&B format
  return 'hb';
}

/**
 * Fetch and adapt products from any supported API
 */
export async function fetchAndAdaptProducts(endpoint: string): Promise<BundlesProduct[]> {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const apiType = detectAPIType(endpoint);
  const data = await response.json();

  switch (apiType) {
    case 'dummyjson':
      return adaptDummyJSONProducts(data as DummyJSONResponse);

    case 'hb':
    default:
      // H&B format: { data: { products: [...] } }
      return data.data?.products || data.products || data;
  }
}
