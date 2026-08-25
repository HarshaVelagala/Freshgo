import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/mockData';
import { Category, FilterOptions, Product } from '../types/grocery';

// In-memory working database that can be mutated in the Engineering Lab to test Cart Consistency
let activeProducts: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let activeCategories: Category[] = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));

// Engineering flags
let simulatedLatencyRange = { min: 250, max: 750 };
let simulatedFailureRate = 0; // 0 to 1

export const MockApiService = {
  // Config
  setLatency(min: number, max: number) {
    simulatedLatencyRange = { min, max };
  },

  setFailureRate(rate: number) {
    simulatedFailureRate = rate;
  },

  getProductsCatalog(): Product[] {
    return activeProducts;
  },

  // Mutators for Engineering Challenge B Testing
  modifyProductPrice(productId: string, newPrice: number) {
    activeProducts = activeProducts.map((p) => (p.id === productId ? { ...p, price: newPrice } : p));
  },

  modifyProductStock(productId: string, newStock: number) {
    activeProducts = activeProducts.map((p) => (p.id === productId ? { ...p, stock: newStock } : p));
  },

  delistProduct(productId: string) {
    activeProducts = activeProducts.filter((p) => p.id !== productId);
  },

  resetCatalog() {
    activeProducts = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    activeCategories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
  },

  // Asynchronous API calls
  async fetchCategories(): Promise<Category[]> {
    await this._simulateDelay();
    return [...activeCategories];
  },

  async fetchProducts(filters?: Partial<FilterOptions>): Promise<Product[]> {
    await this._simulateDelay();

    if (Math.random() < simulatedFailureRate) {
      throw new Error('Simulated network failure while fetching catalog.');
    }

    let results = [...activeProducts];

    if (filters?.category && filters.category !== 'all') {
      results = results.filter(
        (p) => p.categoryId === filters.category || p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters?.onlyOrganic) {
      results = results.filter((p) => p.isOrganic);
    }

    if (filters?.onlyDeals) {
      results = results.filter((p) => p.isDeal);
    }

    if (filters?.inStockOnly) {
      results = results.filter((p) => p.stock > 0);
    }

    if (filters?.dietary && filters.dietary.length > 0) {
      results = results.filter((p) =>
        filters.dietary?.some((diet) => (p.dietary as string[]).includes(diet))
      );
    }

    if (filters?.minPrice !== undefined) {
      results = results.filter((p) => p.price >= (filters.minPrice ?? 0));
    }

    if (filters?.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= (filters.maxPrice ?? 9999));
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'discount':
          results.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
          break;
        case 'popularity':
        default:
          results.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
          break;
      }
    }

    return results;
  },

  async fetchProductById(id: string): Promise<Product | null> {
    await this._simulateDelay();
    const product = activeProducts.find((p) => p.id === id);
    return product ? { ...product } : null;
  },

  /**
   * Search API specifically engineered for Challenge A.
   * Accepts custom latency override so users can test Request A (slow) vs Request B (fast).
   */
  async searchProducts(
    query: string,
    options?: {
      latencyMs?: number;
      signal?: AbortSignal;
    }
  ): Promise<Product[]> {
    const delay = options?.latencyMs ?? this._randomBetween(simulatedLatencyRange.min, simulatedLatencyRange.max);
    
    // Check if aborted before delay
    if (options?.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        resolve();
      }, delay);

      if (options?.signal) {
        options.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });

    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return [];
    }

    return activeProducts.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(cleanQuery);
      const matchesCategory = p.category.toLowerCase().includes(cleanQuery);
      const matchesTags = p.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));
      const matchesDietary = p.dietary.some((diet) => diet.toLowerCase().includes(cleanQuery));
      const matchesSubcategory = p.subcategory?.toLowerCase().includes(cleanQuery);
      return matchesName || matchesCategory || matchesTags || matchesDietary || matchesSubcategory;
    });
  },

  _simulateDelay(): Promise<void> {
    const ms = this._randomBetween(simulatedLatencyRange.min, simulatedLatencyRange.max);
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  _randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};
