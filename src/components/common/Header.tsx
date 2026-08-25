import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  MapPin,
  ChevronDown,
  Sparkles,
  Zap,
  Menu,
  X,
  User,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useUserStore } from '../../stores/userStore';
import { useDebugStore } from '../../stores/debugStore';
import { AddressModal } from './AddressModal';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const cartSubtotal = useCartStore((state) => state.getSubtotal());
  const setIsCartDrawerOpen = useCartStore((state) => state.setIsDrawerOpen);
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length);
  const user = useUserStore((state) => state.user);
  const selectedAddress = useUserStore((state) => state.getSelectedAddress());
  const toggleLab = useDebugStore((state) => state.toggleLab);
  const staleDiscardedCount = useDebugStore((state) => state.simulatedFailureRate);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(headerSearchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top micro banner */}
      <div className="bg-[#050505] text-[#9E9E9E] text-[11px] font-medium py-1.5 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#A7C957] font-semibold">
              <Zap className="w-3 h-3" />
              <span>Express Grocery</span>
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline text-neutral-400">
              Free delivery on fresh orders over $35
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="engineering-lab-top-btn"
              onClick={toggleLab}
              className="flex items-center gap-1.5 bg-[#A7C957]/10 hover:bg-[#A7C957]/20 text-[#A7C957] border border-[#A7C957]/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A7C957] animate-pulse" />
              <span>Engineering Lab & Harness</span>
            </button>
            <div className="hidden md:flex items-center gap-1 text-neutral-400">
              <Clock className="w-3 h-3 text-neutral-500" />
              <span>ETA: 15–25 mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Location */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 font-black text-xl sm:text-2xl text-[#E0E0E0] tracking-tight focus:outline-hidden"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#A7C957] flex items-center justify-center text-[#0A0A0A] shadow-md shadow-[#A7C957]/20">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <span className="font-serif tracking-normal">
                Fresh<span className="text-[#A7C957] italic">Go</span>
              </span>
            </Link>

            {/* Delivery Location pill */}
            <button
              id="header-location-pill"
              onClick={() => setIsAddressModalOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-2xl text-left transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-[#A7C957]/20 text-[#A7C957] flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="max-w-[130px] sm:max-w-[160px]">
                <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 leading-tight">
                  Deliver to
                </p>
                <p className="text-xs font-bold text-[#E0E0E0] truncate">
                  {selectedAddress?.title || 'San Francisco'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="desktop-header-search-input"
                type="text"
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                placeholder="Search avocados, sourdough, milk, berries..."
                className="w-full pl-10 pr-20 py-2.5 bg-white/5 hover:bg-white/[0.08] focus:bg-[#141414] text-xs text-[#E0E0E0] placeholder-neutral-500 rounded-2xl border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-[#A7C957] focus:border-[#A7C957]/60 transition-all font-medium"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#A7C957] text-[#0A0A0A] hover:bg-[#B7D968] rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search icon */}
            <Link
              to="/search"
              id="mobile-search-nav-btn"
              className="md:hidden p-2 rounded-xl text-neutral-300 hover:bg-white/10 transition-colors"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Favorites */}
            <Link
              to="/favorites"
              id="header-favorites-btn"
              className="relative p-2.5 rounded-2xl text-neutral-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:flex items-center"
              aria-label="View saved favorites"
            >
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              id="header-profile-btn"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-2xl text-neutral-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              aria-label="User Profile"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#A7C957]/40"
                referrerPolicy="no-referrer"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-[#E0E0E0] leading-tight">{user.name}</p>
                <p className="text-[10px] text-[#A7C957] font-semibold">{user.tier} Member</p>
              </div>
            </Link>

            {/* Cart Trigger */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-2xl font-extrabold text-xs flex items-center gap-2.5 shadow-md shadow-[#A7C957]/20 active:scale-95 transition-all cursor-pointer"
              aria-label={`Open shopping cart with ${cartItemCount} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#0A0A0A] text-[#A7C957] border border-[#A7C957]/30 text-[10px] font-black flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">${cartSubtotal.toFixed(2)}</span>
            </button>
          </div>
        </div>

        {/* Sub-Header Categories bar (Desktop) */}
        <div className="hidden md:block border-t border-white/10 bg-[#0A0A0A]/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-medium text-neutral-400">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-0.5">
              <Link
                to="/"
                className={`hover:text-[#A7C957] transition-colors whitespace-nowrap ${
                  location.pathname === '/' ? 'font-bold text-[#A7C957]' : ''
                }`}
              >
                All Groceries
              </Link>
              <Link
                to="/categories"
                className={`hover:text-[#A7C957] transition-colors whitespace-nowrap ${
                  location.pathname === '/categories' ? 'font-bold text-[#A7C957]' : ''
                }`}
              >
                Categories
              </Link>
              <Link
                to="/category/fresh-produce"
                className="hover:text-[#A7C957] transition-colors whitespace-nowrap"
              >
                Fresh Produce
              </Link>
              <Link
                to="/category/dairy-eggs"
                className="hover:text-[#A7C957] transition-colors whitespace-nowrap"
              >
                Dairy & Eggs
              </Link>
              <Link
                to="/category/bakery"
                className="hover:text-[#A7C957] transition-colors whitespace-nowrap"
              >
                Bakery
              </Link>
              <Link
                to="/category/meat-seafood"
                className="hover:text-[#A7C957] transition-colors whitespace-nowrap"
              >
                Meat & Seafood
              </Link>
              <Link
                to="/category/beverages"
                className="hover:text-[#A7C957] transition-colors whitespace-nowrap"
              >
                Drinks
              </Link>
              <Link
                to="/category/pantry"
                className="hover:text-[#A7C957] transition-colors whitespace-nowrap"
              >
                Pantry
              </Link>
            </div>

            <div className="flex items-center gap-3 shrink-0 pl-4 border-l border-white/10">
              <span className="text-[11px] font-bold text-[#A7C957] bg-[#A7C957]/10 border border-[#A7C957]/20 px-2 py-0.5 rounded-md">
                15% OFF code: FRESH15
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Address Switcher Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </>
  );
};
