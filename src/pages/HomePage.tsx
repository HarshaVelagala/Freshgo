import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  ChevronRight,
  Truck,
  Leaf,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { MockApiService } from '../services/mockApi';
import { Category, Product } from '../types/grocery';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryCardSkeleton, ProductCardSkeleton } from '../components/common/SkeletonLoader';
import { useUserStore } from '../stores/userStore';
import { useCartStore } from '../stores/cartStore';
import { useToast } from '../components/common/Toast';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedAddress = useUserStore((state) => state.getSelectedAddress());
  const user = useUserStore((state) => state.user);
  const applyPromo = useCartStore((state) => state.applyPromo);
  const setIsCartDrawerOpen = useCartStore((state) => state.setIsDrawerOpen);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        MockApiService.fetchCategories(),
        MockApiService.fetchProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load grocery catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const flashDeals = products.filter((p) => p.isDeal).slice(0, 4);
  const popularProduce = products.filter((p) => p.categoryId === 'cat-fruits-veg').slice(0, 4);
  const dairyBakery = products.filter((p) => p.categoryId === 'cat-dairy-eggs' || p.categoryId === 'cat-bakery').slice(0, 4);

  const handleClaimPromo = () => {
    const res = applyPromo('FRESH15');
    if (res.success) {
      addToast({
        type: 'success',
        title: 'Promo Activated!',
        message: '15% discount will be applied at checkout.',
      });
      setIsCartDrawerOpen(true);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* Hero Delivery Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#161b14] via-[#121412] to-[#0d0f0d] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10">
        {/* Background glow & shapes */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#A7C957]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-64 h-64 bg-[#A7C957]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          {/* Top ETA pill */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-200">
            <span className="w-2 h-2 rounded-full bg-[#A7C957] animate-ping" />
            <Truck className="w-3.5 h-3.5 text-[#A7C957]" />
            <span>Delivering in 15–25 mins to {selectedAddress?.title || 'Home'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight font-serif">
            Farm-Fresh Groceries, <br />
            <span className="text-[#A7C957] italic">Delivered in Minutes.</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed font-sans">
            Handpicked organic fruits, artisan baked sourdough, pasture-raised eggs, and daily pantry staples sourced from local sustainable farms.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/categories"
              className="px-6 py-3 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#A7C957]/10 active:scale-95 transition-all cursor-pointer"
            >
              <span>Explore Aisles</span>
              <ArrowRight className="w-4 h-4 text-[#0A0A0A]" />
            </Link>

            <button
              id="hero-claim-promo-btn"
              onClick={handleClaimPromo}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#A7C957]" />
              <span>Claim 15% OFF (FRESH15)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Network Error & Retry Banner if any */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/50 rounded-2xl flex items-center justify-between gap-4 text-rose-200 text-xs">
          <div>
            <p className="font-bold">Failed to load catalog data</p>
            <p className="text-rose-400 mt-0.5">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Categories Horizontal Carousel / Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white font-serif tracking-tight">
              Shop by <span className="text-[#A7C957] italic">Aisle</span>
            </h2>
            <p className="text-xs text-neutral-400">Fresh curated essentials</p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-[#A7C957] hover:text-[#B7D968] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2.5 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                id={`home-cat-${cat.slug}`}
                className="group flex flex-col items-center text-center p-2.5 sm:p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all shadow-xs"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/5 mb-2 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-neutral-200 group-hover:text-[#A7C957] line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[9px] text-neutral-400 hidden sm:block">
                  {cat.itemCount} items
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Flash Deals / Daily Specials Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white font-serif tracking-tight">
                Daily <span className="text-[#A7C957] italic">Flash Deals</span>
              </h2>
              <p className="text-xs text-neutral-400">Up to 25% off fresh picks</p>
            </div>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>See more</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {flashDeals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Fresh Organic Produce Highlights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#A7C957]/15 border border-[#A7C957]/20 text-[#A7C957] flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white font-serif tracking-tight">
                Organic <span className="text-[#A7C957] italic">Orchard & Farm</span>
              </h2>
              <p className="text-xs text-neutral-400">Picked fresh from California growers</p>
            </div>
          </div>
          <Link
            to="/category/fresh-produce"
            className="text-xs font-bold text-[#A7C957] hover:text-[#B7D968] flex items-center gap-1 transition-colors"
          >
            <span>View Produce</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {popularProduce.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Mid-page Promotional Banner */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#A7C957] bg-[#A7C957]/15 border border-[#A7C957]/20 px-2.5 py-1 rounded-full">
            FreshGo Prime Membership
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
            Unlimited Free Delivery on Orders <span className="text-[#A7C957] italic">$15+</span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Join thousands of happy food lovers saving an average of $64/month with zero delivery fees and priority fulfillment.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            to="/profile"
            className="px-6 py-3 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-[#A7C957]/10 transition-all active:scale-95 cursor-pointer"
          >
            Manage Prime Status
          </Link>
        </div>
      </section>

      {/* Dairy & Artisan Bakery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white font-serif tracking-tight">
              Artisan Bakery & <span className="text-[#A7C957] italic">Pasture Dairy</span>
            </h2>
            <p className="text-xs text-neutral-400">Slow fermented sourdough and golden egg yolks</p>
          </div>
          <Link
            to="/category/bakery"
            className="text-xs font-bold text-[#A7C957] hover:text-[#B7D968] flex items-center gap-1 transition-colors"
          >
            <span>Explore</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {dairyBakery.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
