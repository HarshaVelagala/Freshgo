import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check, Sparkles } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { CartHealingBanner } from './CartHealingBanner';
import { useToast } from '../common/Toast';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const setIsDrawerOpen = useCartStore((state) => state.setIsDrawerOpen);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const appliedPromo = useCartStore((state) => state.appliedPromo);
  const applyPromo = useCartStore((state) => state.applyPromo);
  const removePromo = useCartStore((state) => state.removePromo);
  const reconcileCartWithCatalog = useCartStore((state) => state.reconcileCartWithCatalog);

  const subtotal = useCartStore((state) => state.getSubtotal());
  const discount = useCartStore((state) => state.getDiscountAmount());
  const deliveryFee = useCartStore((state) => state.getDeliveryFee());
  const tax = useCartStore((state) => state.getTaxAmount());
  const total = useCartStore((state) => state.getTotal());
  const itemCount = useCartStore((state) => state.getItemCount());

  const [promoInput, setPromoInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Auto-reconcile on drawer open (Engineering Challenge B)
  useEffect(() => {
    if (isDrawerOpen) {
      const result = reconcileCartWithCatalog();
      if (result.hasModifications && result.notices.length > 0) {
        addToast({
          type: 'info',
          title: 'Cart Updated',
          message: 'Some prices or quantities were synced with current catalog.',
        });
      }
    }
  }, [isDrawerOpen, reconcileCartWithCatalog, addToast]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    const res = applyPromo(promoInput);
    setIsApplyingPromo(false);

    if (res.success) {
      addToast({ type: 'success', title: 'Promo Applied', message: res.message });
      setPromoInput('');
    } else {
      addToast({ type: 'error', title: 'Promo Error', message: res.message });
    }
  };

  const handleProceedToCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  const freeDeliveryThreshold = 35;
  const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div id="cart-drawer-wrapper" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#141414] border-l border-white/10 shadow-2xl flex flex-col text-[#E0E0E0]"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#101010]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#A7C957]/15 text-[#A7C957] border border-[#A7C957]/20 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-serif">Your <span className="text-[#A7C957] italic">Basket</span></h2>
                    <p className="text-xs text-neutral-400 font-medium">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <button
                  id="close-cart-drawer-btn"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free delivery progress bar */}
              {subtotal > 0 && (
                <div className="bg-[#A7C957]/10 px-4 py-2.5 border-b border-white/10">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-neutral-200">
                    <span>
                      {amountNeededForFreeDelivery === 0
                        ? '🎉 You unlocked FREE standard delivery!'
                        : `Add $${amountNeededForFreeDelivery.toFixed(2)} more for FREE delivery`}
                    </span>
                    <span className="font-bold text-[#A7C957]">
                      ${subtotal.toFixed(2)} / ${freeDeliveryThreshold}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#A7C957] rounded-full transition-all duration-300"
                      style={{ width: `${progressToFreeDelivery}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Healing Notice alerts */}
                <CartHealingBanner />

                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mb-4">
                      <ShoppingBag className="w-10 h-10 text-neutral-500" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">Your basket is empty</h3>
                    <p className="text-xs text-neutral-400 max-w-xs mb-6 leading-relaxed">
                      Explore fresh farm produce, dairy, bakery specials, and organic staples to start your order.
                    </p>
                    <button
                      id="start-shopping-btn"
                      onClick={() => {
                        setIsDrawerOpen(false);
                        navigate('/categories');
                      }}
                      className="px-5 py-2.5 bg-[#A7C957] text-[#0A0A0A] text-xs font-bold rounded-xl hover:bg-[#B7D968] transition-colors shadow-sm cursor-pointer"
                    >
                      Browse Fresh Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        id={`cart-item-${item.product.id}`}
                        className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-xs flex items-center gap-3 hover:border-white/20 transition-colors"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-[#0A0A0A] border border-white/5 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                          <p className="text-[11px] text-neutral-400">{item.product.unit}</p>
                          <div className="mt-1 flex items-baseline gap-1.5">
                            <span className="text-xs font-bold text-white">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-neutral-500 font-medium">
                                (${item.product.price.toFixed(2)} each)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                          <button
                            id={`decrease-cart-${item.product.id}`}
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 shadow-xs flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-400" /> : <Minus className="w-3.5 h-3.5 stroke-[2.5]" />}
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            id={`increase-cart-${item.product.id}`}
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 shadow-xs flex items-center justify-center text-neutral-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer & Checkout summary */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-white/10 bg-[#101010] space-y-3.5">
                  {/* Promo Input */}
                  <div>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-2.5 bg-[#A7C957]/15 border border-[#A7C957]/30 rounded-xl text-xs text-[#A7C957]">
                        <div className="flex items-center gap-2 font-semibold">
                          <Tag className="w-4 h-4 text-[#A7C957]" />
                          <span>Code {appliedPromo} applied (-${discount.toFixed(2)})</span>
                        </div>
                        <button
                          id="remove-promo-btn"
                          onClick={removePromo}
                          className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            id="cart-promo-input"
                            type="text"
                            placeholder="Promo code (e.g. FRESH15)"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white/5 border border-white/10 text-white placeholder-neutral-500 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#A7C957] font-medium"
                          />
                        </div>
                        <button
                          id="cart-apply-promo-btn"
                          type="submit"
                          disabled={isApplyingPromo || !promoInput.trim()}
                          className="px-3.5 py-2 bg-[#A7C957] text-[#0A0A0A] text-xs font-bold rounded-xl hover:bg-[#B7D968] disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-[#A7C957] font-medium">
                        <span>Discount ({appliedPromo})</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>
                        {deliveryFee === 0 ? (
                          <span className="text-[#A7C957] font-bold">FREE</span>
                        ) : (
                          `$${deliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (CA 8.25%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between items-baseline text-sm font-bold text-white">
                      <span>Total</span>
                      <span className="text-base text-[#A7C957] font-black">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    id="checkout-drawer-cta"
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-xl font-black text-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#A7C957]/10 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A7C957]" />
                    <span>100% Freshness Guarantee • Contactless Delivery</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
