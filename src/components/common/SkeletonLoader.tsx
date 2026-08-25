import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#141414] rounded-2xl p-3 border border-white/10 shadow-sm flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-white/5 rounded-xl mb-3" />
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
      <div className="h-3 bg-white/10 rounded w-1/2 mb-3" />
      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="h-5 bg-white/10 rounded w-16" />
        <div className="h-8 w-8 bg-white/10 rounded-full" />
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10" />
      <div className="h-3 bg-white/10 rounded w-12" />
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="w-full aspect-square bg-white/5 border border-white/10 rounded-3xl" />
      <div className="space-y-4">
        <div className="h-6 bg-white/10 rounded w-1/3" />
        <div className="h-8 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-1/4" />
        <div className="h-10 bg-white/10 rounded w-1/3 mt-4" />
        <div className="space-y-2 pt-4">
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
          <div className="h-4 bg-white/10 rounded w-4/6" />
        </div>
        <div className="h-14 bg-white/10 rounded-2xl mt-8" />
      </div>
    </div>
  );
};

export const CartItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 animate-pulse">
      <div className="w-16 h-16 bg-white/10 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/3" />
      </div>
      <div className="h-8 w-20 bg-white/10 rounded-lg shrink-0" />
    </div>
  );
};
