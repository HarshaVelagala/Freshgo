import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Heart, Star, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../../types/grocery';
import { useCartStore } from '../../stores/cartStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useToast } from '../common/Toast';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartItems = useCartStore((state) => state.items);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    addToast({
      type: 'success',
      title: 'Added to basket',
      message: `${product.name} (${product.unit})`,
    });
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentQuantity < product.stock) {
      updateQuantity(product.id, currentQuantity + 1);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, currentQuantity - 1);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    addToast({
      type: 'info',
      title: isFavorite ? 'Removed from favorites' : 'Saved to favorites',
      message: product.name,
    });
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-[#141414] rounded-2xl border border-white/10 p-3 sm:p-4 shadow-xs hover:shadow-lg hover:border-[#A7C957]/40 hover:bg-[#181818] transition-all flex flex-col justify-between"
    >
      {/* Badges & Favorite Button */}
      <div className="relative mb-2.5">
        <Link
          to={`/product/${product.id}`}
          className="block aspect-square rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/5 relative focus:outline-hidden focus:ring-2 focus:ring-[#A7C957]"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-xs flex items-center justify-center p-2 text-center">
              <span className="text-white text-xs font-bold px-2.5 py-1 bg-rose-600/90 rounded-lg">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {product.isDeal && product.discountPercent && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
          {product.isOrganic && (
            <span className="bg-[#A7C957] text-[#0A0A0A] text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              <span>Organic</span>
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          id={`fav-btn-${product.id}`}
          onClick={handleToggleFav}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isFavorite
              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-xs'
              : 'bg-[#0A0A0A]/70 backdrop-blur-xs border border-white/10 text-neutral-400 hover:text-rose-400 hover:bg-[#141414] shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col">
        {/* Rating & Unit */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
          <div className="flex items-center gap-1 font-semibold text-neutral-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-neutral-500 font-normal">({product.reviewCount})</span>
          </div>
          <span className="text-neutral-400 truncate max-w-[80px]">{product.unit}</span>
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.id}`}
          className="text-xs sm:text-sm font-bold text-[#E0E0E0] line-clamp-2 hover:text-[#A7C957] transition-colors mb-2 focus:outline-hidden"
        >
          {product.name}
        </Link>

        {/* Dietary Tags */}
        {!compact && product.dietary && product.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {product.dietary.slice(0, 2).map((diet) => (
              <span
                key={diet}
                className="text-[9px] font-medium bg-white/5 border border-white/5 text-neutral-400 px-1.5 py-0.5 rounded"
              >
                {diet}
              </span>
            ))}
          </div>
        )}

        {/* Pricing & Add to Cart */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-white/10">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-neutral-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-400">
              {product.stock <= 5 && product.stock > 0 ? (
                <span className="text-amber-400 font-medium">Only {product.stock} left</span>
              ) : (
                'In Stock'
              )}
            </span>
          </div>

          {/* Add / Stepper Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="px-2.5 py-1.5 bg-white/5 border border-white/10 text-neutral-500 text-xs font-semibold rounded-xl cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : currentQuantity === 0 ? (
            <button
              id={`add-btn-${product.id}`}
              onClick={handleAddToCart}
              className="h-9 px-3.5 bg-[#A7C957] text-[#0A0A0A] hover:bg-[#B7D968] font-extrabold text-xs rounded-xl flex items-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer"
              aria-label={`Add ${product.name} to basket`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#A7C957] text-[#0A0A0A] rounded-xl p-1 shadow-xs font-bold">
              <button
                id={`decrease-btn-${product.id}`}
                onClick={handleDecrease}
                className="w-7 h-7 rounded-lg bg-[#0A0A0A]/20 hover:bg-[#0A0A0A]/30 flex items-center justify-center text-[#0A0A0A] transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="w-5 text-center text-xs font-black">{currentQuantity}</span>
              <button
                id={`increase-btn-${product.id}`}
                onClick={handleIncrease}
                disabled={currentQuantity >= product.stock}
                className="w-7 h-7 rounded-lg bg-[#0A0A0A]/20 hover:bg-[#0A0A0A]/30 disabled:opacity-40 flex items-center justify-center text-[#0A0A0A] transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
