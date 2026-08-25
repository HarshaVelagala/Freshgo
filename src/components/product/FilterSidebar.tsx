import React from 'react';
import { FilterOptions } from '../../types/grocery';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import { Filter, RotateCcw, Check, Sparkles, Tag } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onReset: () => void;
}

const DIETARY_OPTIONS = ['Organic', 'Gluten-Free', 'Vegan', 'Dairy-Free', 'Non-GMO', 'Keto'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, onReset }) => {
  const handleDietaryToggle = (diet: string) => {
    const exists = filters.dietary.includes(diet);
    const updated = exists ? filters.dietary.filter((d) => d !== diet) : [...filters.dietary, diet];
    onFilterChange({ ...filters, dietary: updated });
  };

  return (
    <aside
      id="product-filter-sidebar"
      className="bg-[#141414] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-xs space-y-6 text-[#E0E0E0]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#A7C957]" />
          <h3 className="text-sm font-bold text-white">Filter Products</h3>
        </div>
        <button
          id="sidebar-reset-btn"
          onClick={onReset}
          className="text-xs text-neutral-400 hover:text-[#A7C957] font-medium flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            id="filter-cat-all"
            onClick={() => onFilterChange({ ...filters, category: 'all' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
              filters.category === 'all'
                ? 'bg-[#A7C957]/15 text-[#A7C957] font-bold border border-[#A7C957]/30'
                : 'text-neutral-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>All Categories</span>
            {filters.category === 'all' && <Check className="w-3.5 h-3.5 text-[#A7C957]" />}
          </button>
          {INITIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id}`}
              onClick={() => onFilterChange({ ...filters, category: cat.id })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                filters.category === cat.id
                  ? 'bg-[#A7C957]/15 text-[#A7C957] font-bold border border-[#A7C957]/30'
                  : 'text-neutral-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category === cat.id && <Check className="w-3.5 h-3.5 text-[#A7C957]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2.5 pt-2 border-t border-white/10">
        <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
          Special Filters
        </h4>

        {/* Organic Only */}
        <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#A7C957]" />
            <span className="text-xs font-medium text-neutral-300">100% Organic Only</span>
          </div>
          <input
            id="filter-toggle-organic"
            type="checkbox"
            checked={filters.onlyOrganic}
            onChange={(e) => onFilterChange({ ...filters, onlyOrganic: e.target.checked })}
            className="w-4 h-4 rounded accent-[#A7C957] bg-white/10 border-white/20 cursor-pointer"
          />
        </label>

        {/* Deals Only */}
        <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-medium text-neutral-300">Discounted Deals</span>
          </div>
          <input
            id="filter-toggle-deals"
            type="checkbox"
            checked={filters.onlyDeals}
            onChange={(e) => onFilterChange({ ...filters, onlyDeals: e.target.checked })}
            className="w-4 h-4 rounded accent-rose-500 bg-white/10 border-white/20 cursor-pointer"
          />
        </label>

        {/* In Stock Only */}
        <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
          <span className="text-xs font-medium text-neutral-300">In Stock Items Only</span>
          <input
            id="filter-toggle-instock"
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded accent-[#A7C957] bg-white/10 border-white/20 cursor-pointer"
          />
        </label>
      </div>

      {/* Price Range */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Max Price</h4>
          <span className="text-xs font-bold text-[#A7C957]">${filters.maxPrice.toFixed(2)}</span>
        </div>
        <input
          id="filter-price-slider"
          type="range"
          min="2"
          max="25"
          step="0.5"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A7C957]"
        />
        <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
          <span>$2.00</span>
          <span>$12.50</span>
          <span>$25.00</span>
        </div>
      </div>

      {/* Dietary Badges */}
      <div className="pt-2 border-t border-white/10">
        <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
          Dietary & Lifestyle
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {DIETARY_OPTIONS.map((diet) => {
            const isSelected = filters.dietary.includes(diet);
            return (
              <button
                key={diet}
                id={`dietary-chip-${diet.toLowerCase()}`}
                onClick={() => handleDietaryToggle(diet)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#A7C957] text-[#0A0A0A] font-bold shadow-xs'
                    : 'bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10'
                }`}
              >
                {diet}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
