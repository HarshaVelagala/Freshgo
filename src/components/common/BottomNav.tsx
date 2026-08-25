import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useFavoritesStore } from '../../stores/favoritesStore';

export const BottomNav: React.FC = () => {
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const setIsCartDrawerOpen = useCartStore((state) => state.setIsDrawerOpen);
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length);

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 shadow-lg flex items-center justify-around"
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isActive ? 'text-[#A7C957] font-bold' : 'text-neutral-400 hover:text-[#E0E0E0]'
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </NavLink>

      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isActive ? 'text-[#A7C957] font-bold' : 'text-neutral-400 hover:text-[#E0E0E0]'
          }`
        }
      >
        <LayoutGrid className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Catalog</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isActive ? 'text-[#A7C957] font-bold' : 'text-neutral-400 hover:text-[#E0E0E0]'
          }`
        }
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Search</span>
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          `relative flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isActive ? 'text-[#A7C957] font-bold' : 'text-neutral-400 hover:text-[#E0E0E0]'
          }`
        }
      >
        <Heart className="w-5 h-5" />
        {favoriteCount > 0 && (
          <span className="absolute top-1.5 right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
            {favoriteCount}
          </span>
        )}
        <span className="text-[10px] mt-0.5">Saved</span>
      </NavLink>

      <button
        id="mobile-cart-bottom-btn"
        onClick={() => setIsCartDrawerOpen(true)}
        className="relative flex flex-col items-center justify-center p-2 rounded-xl text-neutral-400 hover:text-[#A7C957] transition-colors cursor-pointer"
        aria-label="Open basket"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#A7C957] text-[#0A0A0A] text-[10px] font-black flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 font-medium">Cart</span>
      </button>
    </nav>
  );
};
