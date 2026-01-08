// Theme system
import './theme/index.css';

// Component exports
export { Bundles } from './components/Bundles';
export type { BundlesProps, Product, ProductsResponse } from './components/Bundles';

// Adapter exports (for advanced usage)
export { fetchAndAdaptProducts, detectAPIType } from './adapters/apiAdapters';
export type { BundlesProduct } from './adapters/apiAdapters';
