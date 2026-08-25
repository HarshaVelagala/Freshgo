import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types/grocery';
import { MockApiService } from '../services/mockApi';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useCartStore } from '../stores/cartStore';
import { ProductGrid } from '../components/product/ProductGrid';
import { useToast } from '../components/common/Toast';

export const FavoritesPage: React.FC = () => {
  const { addToast } = useToast();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const addItem = useCartStore((state) => state.addItem);
  const setIsCartDrawerOpen = useCartStore((state) => state.setIsDrawerOpen);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavs = async () => {
      setIsLoading(true);
      try {
        const all = await MockApiService.fetchProducts();
        setProducts(all.filter((p) => favoriteIds.includes(p.id)));
      } finally {
        setIsLoading(false);
      }
    };
    loadFavs();
  }, [favoriteIds]);

  const handleAddAllToCart = () => {
    const inStock = products.filter((p) => p.stock > 0);
    if (inStock.length === 0) return;

    inStock.forEach((p) => addItem(p, 1));
    addToast({
      type: 'success',
      title: 'Added to Basket',
      message: `Added ${inStock.length} favorite items to your basket.`,
    });
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-16 text-[#E0E0E0]">
      {/* Header */}
      <div className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-xs text-neutral-600">/</span>
            <span className="text-xs font-semibold text-[#A7C957]">Favorites</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-white font-serif tracking-tight flex items-center gap-2.5">
            <span>Saved <span className="text-[#A7C957] italic">Favorites</span></span>
            <span className="text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
              {favoriteIds.length} items
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Quickly re-order your favorite farm produce, pantry items, and breakfast essentials.
          </p>
        </div>

        {products.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="fav-add-all-btn"
              onClick={handleAddAllToCart}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#A7C957]/10 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>Add All in Stock</span>
            </button>
            <button
              id="fav-clear-all-btn"
              onClick={clearFavorites}
              className="p-2.5 bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 text-neutral-400 border border-white/10 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
              aria-label="Clear all favorites"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        emptyTitle="No Saved Favorites Yet"
        emptyDescription="Click the heart icon on any product to save it here for fast one-click re-ordering."
      />
    </div>
  );
};
