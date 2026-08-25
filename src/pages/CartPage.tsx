import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { CartHealingBanner } from '../components/cart/CartHealingBanner';
import { useToast } from '../components/common/Toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const appliedPromo = useCartStore((state) => state.appliedPromo);
  const applyPromo = useCartStore((state) => state.applyPromo);
  const removePromo = useCartStore((state) => state.removePromo);
  const deliveryOption = useCartStore((state) => state.deliveryOption);
  const setDeliveryOption = useCartStore((state) => state.setDeliveryOption);
  const tipAmount = useCartStore((state) => state.tipAmount);
  const setTipAmount = useCartStore((state) => state.setTipAmount);
  const reconcileCartWithCatalog = useCartStore((state) => state.reconcileCartWithCatalog);

  const subtotal = useCartStore((state) => state.getSubtotal());
  const discount = useCartStore((state) => state.getDiscountAmount());
  const deliveryFee = useCartStore((state) => state.getDeliveryFee());
  const tax = useCartStore((state) => state.getTaxAmount());
  const total = useCartStore((state) => state.getTotal());
  const itemCount = useCartStore((state) => state.getItemCount());

  const [promoInput, setPromoInput] = useState('');

  // Reconcile on mount
  useEffect(() => {
    reconcileCartWithCatalog();
  }, []);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    if (res.success) {
      addToast({ type: 'success', title: 'Promo Applied', message: res.message });
      setPromoInput('');
    } else {
      addToast({ type: 'error', title: 'Invalid Code', message: res.message });
    }
  };

  const freeDeliveryThreshold = 35;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 p-8 max-w-lg mx-auto my-12 shadow-xl text-[#E0E0E0]">
        <div className="w-20 h-20 rounded-full bg-[#A7C957]/15 text-[#A7C957] flex items-center justify-center mx-auto mb-4 border border-[#A7C957]/20">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-white font-serif mb-2">Your Basket is Empty</h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6 leading-relaxed">
          Looks like you haven't added any fresh groceries yet. Explore our farm catalog or popular organic picks.
        </p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-2xl text-xs font-extrabold transition-all shadow-lg shadow-[#A7C957]/10 cursor-pointer"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 text-[#E0E0E0]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            Shopping Basket ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Review your fresh grocery items before proceeding to checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
        >
          Clear Basket
        </button>
      </div>

      {/* Auto Reconciliation Banner */}
      <CartHealingBanner />

      {/* Free Delivery Banner */}
      {amountNeeded > 0 ? (
        <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-xs text-neutral-300 font-medium">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#A7C957]" />
            <span>Add <strong className="text-white">${amountNeeded.toFixed(2)}</strong> more to get <strong className="text-[#A7C957]">FREE Delivery</strong></span>
          </div>
          <Link to="/categories" className="text-[#A7C957] font-bold hover:underline">
            Add items
          </Link>
        </div>
      ) : (
        <div className="p-3.5 bg-[#A7C957]/15 border border-[#A7C957]/30 text-white rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-[#A7C957]" />
          <span>🎉 Congratulations! You unlocked <span className="text-[#A7C957]">FREE</span> standard delivery on this order!</span>
        </div>
      )}

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white/5 rounded-2xl border border-white/10 p-4 shadow-xs flex items-center gap-4 hover:border-white/20 transition-colors"
            >
              <Link to={`/product/${item.product.id}`} className="shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-[#0A0A0A] border border-white/10"
                  referrerPolicy="no-referrer"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/product/${item.product.id}`}
                      className="text-sm font-bold text-white hover:text-[#A7C957] transition-colors truncate block"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.product.unit}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 shadow-xs flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 shadow-xs flex items-center justify-center text-neutral-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-white font-serif">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-neutral-400">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Checkout Action */}
        <div className="lg:col-span-1 bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl space-y-6 sticky top-28">
          <h2 className="text-base font-bold text-white font-serif pb-3 border-b border-white/10">
            Order Summary
          </h2>

          {/* Delivery Speed Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Delivery Speed
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeliveryOption('express')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  deliveryOption === 'express'
                    ? 'border-[#A7C957] bg-[#A7C957]/15 font-bold text-[#A7C957]'
                    : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                }`}
              >
                <p className="font-bold flex items-center gap-1">
                  <span>⚡ Express</span>
                </p>
                <p className="text-[10px] opacity-75 mt-0.5">15–25 mins</p>
              </button>

              <button
                onClick={() => setDeliveryOption('standard')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  deliveryOption === 'standard'
                    ? 'border-[#A7C957] bg-[#A7C957]/15 font-bold text-[#A7C957]'
                    : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                }`}
              >
                <p className="font-bold">Standard</p>
                <p className="text-[10px] opacity-75 mt-0.5">Today (1-2 hrs)</p>
              </button>
            </div>
          </div>

          {/* Promo code */}
          <div>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-3 bg-[#A7C957]/15 border border-[#A7C957]/30 rounded-xl text-xs text-white">
                <div className="flex items-center gap-2 font-semibold">
                  <Tag className="w-4 h-4 text-[#A7C957]" />
                  <span>Promo {appliedPromo} applied (-${discount.toFixed(2)})</span>
                </div>
                <button
                  onClick={removePromo}
                  className="text-xs font-bold text-rose-400 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. FRESH15)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white/5 border border-white/10 text-white placeholder-neutral-500 rounded-xl focus:ring-1 focus:ring-[#A7C957] font-medium"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-2 text-xs text-neutral-300 border-t border-white/10 pt-4">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#A7C957] font-semibold">
                <span>Promo Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? (
                  <strong className="text-[#A7C957]">FREE</strong>
                ) : (
                  `$${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Sales Tax (8.25%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-white/10 text-sm font-bold text-white">
              <span>Estimated Total</span>
              <span className="text-lg text-[#A7C957] font-black font-serif">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            id="cart-page-checkout-btn"
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-2xl font-extrabold text-sm shadow-lg shadow-[#A7C957]/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
