import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FilterOptions, Product, Category } from '../types/grocery';
import { MockApiService } from '../services/mockApi';
import { INITIAL_CATEGORIES } from '../data/mockData';
import { ProductGrid } from '../components/product/ProductGrid';
import { FilterSidebar } from '../components/product/FilterSidebar';
import {
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Search,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Initial filter state
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    dietary: [],
    minPrice: 0,
    maxPrice: 25,
    onlyOrganic: false,
    onlyDeals: false,
    inStockOnly: false,
    sortBy: 'popularity',
  });

  // Sync category slug from URL
  useEffect(() => {
    if (categorySlug) {
      const matched = INITIAL_CATEGORIES.find((c) => c.slug === categorySlug);
      if (matched) {
        setFilters((prev) => ({ ...prev, category: matched.id }));
      }
    } else {
      setFilters((prev) => ({ ...prev, category: 'all' }));
    }
  }, [categorySlug]);

  const loadFilteredProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await MockApiService.fetchProducts(filters);
      let filtered = data;
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q)) ||
            p.description.toLowerCase().includes(q)
        );
      }
      setProducts(filtered);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFilteredProducts();
  }, [filters, searchKeyword]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      dietary: [],
      minPrice: 0,
      maxPrice: 25,
      onlyOrganic: false,
      onlyDeals: false,
      inStockOnly: false,
      sortBy: 'popularity',
    });
    setSearchKeyword('');
    navigate('/categories');
  };

  const currentCategory = INITIAL_CATEGORIES.find((c) => c.id === filters.category);

  return (
    <div className="space-y-6 pb-16">
      {/* Category Banner */}
      <div className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-xs text-neutral-600">/</span>
            <span className="text-xs font-semibold text-[#A7C957]">
              {currentCategory ? currentCategory.name : 'All Groceries'}
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            {currentCategory ? (
              <>
                Aisle: <span className="text-[#A7C957] italic">{currentCategory.name}</span>
              </>
            ) : (
              <>
                All <span className="text-[#A7C957] italic">Grocery Catalog</span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
            {currentCategory
              ? `Browse top quality, hand-inspected ${currentCategory.name.toLowerCase()} sourced with strict organic and freshness standards.`
              : 'Explore our complete catalog of organic produce, pasture-raised dairy, artisan bakery, and clean pantry essentials.'}
          </p>
        </div>

        {/* Search inside catalog */}
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Refine in this aisle..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 text-xs text-white placeholder-neutral-500 rounded-2xl border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-[#A7C957] font-medium"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter & Sort Bar */}
      <div className="lg:hidden flex items-center justify-between gap-2">
        <button
          id="mobile-filter-open-btn"
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex-1 py-2.5 px-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:bg-white/10 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#A7C957]" />
          <span>Filters & Dietary</span>
          {(filters.dietary.length > 0 || filters.onlyOrganic || filters.onlyDeals) && (
            <span className="w-2 h-2 rounded-full bg-[#A7C957]" />
          )}
        </button>

        <div className="relative flex-1">
          <select
            id="mobile-sort-select"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] })
            }
            className="w-full appearance-none py-2.5 pl-4 pr-9 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white shadow-xs focus:ring-1 focus:ring-[#A7C957] cursor-pointer"
          >
            <option value="popularity" className="bg-[#141414] text-white">Most Popular</option>
            <option value="price_asc" className="bg-[#141414] text-white">Price: Low to High</option>
            <option value="price_desc" className="bg-[#141414] text-white">Price: High to Low</option>
            <option value="rating" className="bg-[#141414] text-white">Highest Rated</option>
            <option value="discount" className="bg-[#141414] text-white">Biggest Discount</option>
          </select>
          <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Desktop Sort & Result Count Header */}
          <div className="hidden lg:flex items-center justify-between bg-white/5 p-3.5 px-5 rounded-2xl border border-white/10 shadow-xs">
            <p className="text-xs font-bold text-neutral-300">
              Showing <span className="text-[#A7C957]">{products.length}</span> items
            </p>

            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400 font-medium">Sort By:</span>
              <div className="relative">
                <select
                  id="desktop-sort-select"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] })
                  }
                  className="appearance-none py-1.5 pl-3 pr-8 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white focus:ring-1 focus:ring-[#A7C957] cursor-pointer"
                >
                  <option value="popularity" className="bg-[#141414] text-white">Most Popular</option>
                  <option value="price_asc" className="bg-[#141414] text-white">Price: Low to High</option>
                  <option value="price_desc" className="bg-[#141414] text-white">Price: High to Low</option>
                  <option value="rating" className="bg-[#141414] text-white">Highest Rated</option>
                  <option value="discount" className="bg-[#141414] text-white">Biggest Discount</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/50 rounded-2xl flex items-center justify-between text-rose-200 text-xs">
              <p className="font-semibold">{error}</p>
              <button
                onClick={loadFilteredProducts}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Products Grid */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm"
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="w-screen max-w-xs bg-[#141414] border-l border-white/10 text-[#E0E0E0] shadow-2xl flex flex-col p-5 overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <h3 className="text-base font-bold text-white font-serif">Filters</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={handleResetFilters}
                />

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] font-extrabold text-xs rounded-xl shadow-lg shadow-[#A7C957]/10 cursor-pointer transition-colors"
                  >
                    Apply Filters ({products.length} items)
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
