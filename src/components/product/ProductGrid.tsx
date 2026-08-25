import React from 'react';
import { Product } from '../../types/grocery';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../common/SkeletonLoader';
import { PackageOpen, RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onResetFilters?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onResetFilters,
  emptyTitle = 'No grocery items found',
  emptyDescription = 'Try adjusting your filters, price range, or search keywords to find what you are looking for.',
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        id="product-grid-empty"
        className="bg-white/5 rounded-3xl border border-white/10 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6 text-[#E0E0E0]"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#A7C957]/15 text-[#A7C957] flex items-center justify-center mb-4 border border-[#A7C957]/20">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">{emptyTitle}</h3>
        <p className="text-xs text-neutral-400 max-w-sm mb-6 leading-relaxed">{emptyDescription}</p>
        {onResetFilters && (
          <button
            id="reset-grid-filters-btn"
            onClick={onResetFilters}
            className="px-4 py-2 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      id="product-grid-items"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
