import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] text-[#9E9E9E] pt-12 pb-24 md:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value propositions banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A7C957]/15 text-[#A7C957] flex items-center justify-center shrink-0 border border-[#A7C957]/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#E0E0E0]">15-Min Delivery</h4>
              <p className="text-[11px] text-neutral-400">Micro-fulfillment hubs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A7C957]/15 text-[#A7C957] flex items-center justify-center shrink-0 border border-[#A7C957]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#E0E0E0]">Farm to Table</h4>
              <p className="text-[11px] text-neutral-400">100% Certified Organic</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A7C957]/15 text-[#A7C957] flex items-center justify-center shrink-0 border border-[#A7C957]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#E0E0E0]">Fresh Guarantee</h4>
              <p className="text-[11px] text-neutral-400">Instant refund if not fresh</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A7C957]/15 text-[#A7C957] flex items-center justify-center shrink-0 border border-[#A7C957]/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#E0E0E0]">Eco Packaging</h4>
              <p className="text-[11px] text-neutral-400">100% Biodegradable</p>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center gap-2 font-black text-lg text-white mb-3">
              <div className="w-7 h-7 rounded-xl bg-[#A7C957] flex items-center justify-center text-[#0A0A0A]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif">Fresh<span className="text-[#A7C957] italic">Go</span></span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Hyper-local organic grocery delivered in minutes. Always handpicked with care.
            </p>
            <p className="text-[11px] text-neutral-500">
              © {new Date().getFullYear()} FreshGo Technologies Inc.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Popular Aisles
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/fresh-produce" className="hover:text-[#A7C957] transition-colors">
                  Fresh Produce & Fruit
                </Link>
              </li>
              <li>
                <Link to="/category/dairy-eggs" className="hover:text-[#A7C957] transition-colors">
                  Organic Dairy & Eggs
                </Link>
              </li>
              <li>
                <Link to="/category/bakery" className="hover:text-[#A7C957] transition-colors">
                  Artisan Sourdough Bakery
                </Link>
              </li>
              <li>
                <Link to="/category/meat-seafood" className="hover:text-[#A7C957] transition-colors">
                  Wild-Caught Seafood
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link to="/profile" className="hover:text-[#A7C957] transition-colors">
                  Your Orders & Receipts
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-[#A7C957] transition-colors">
                  Saved Favorites List
                </Link>
              </li>
              <li>
                <span className="hover:text-[#A7C957] transition-colors cursor-pointer">
                  Contact Support (24/7)
                </span>
              </li>
              <li>
                <span className="hover:text-[#A7C957] transition-colors cursor-pointer">
                  Delivery Coverage Map
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Delivery Hours
            </h5>
            <p className="text-xs text-neutral-400 mb-2">
              Everyday: 6:00 AM – 11:30 PM PST
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
              <span className="font-semibold text-[#A7C957] block mb-0.5">Active Hub</span>
              <span className="text-neutral-300">San Francisco Bay Area</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
