import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartHealingNotice, CartItem, Product } from '../types/grocery';
import { MockApiService } from '../services/mockApi';
import { PROMO_CODES } from '../data/mockData';

interface CartState {
  items: CartItem[];
  appliedPromo: string | null;
  tipAmount: number;
  deliveryOption: 'express' | 'standard' | 'scheduled';
  healingNotices: CartHealingNotice[];
  isDrawerOpen: boolean;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  setTipAmount: (amount: number) => void;
  setDeliveryOption: (option: 'express' | 'standard' | 'scheduled') => void;
  setIsDrawerOpen: (open: boolean) => void;
  dismissNotice: (noticeId: string) => void;
  clearAllNotices: () => void;
  
  // Engineering Challenge B: Cart Consistency Engine
  reconcileCartWithCatalog: () => {
    notices: CartHealingNotice[];
    hasModifications: boolean;
  };

  // Computations
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getDeliveryFee: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromo: null,
      tipAmount: 3.0,
      deliveryOption: 'express',
      healingNotices: [],
      isDrawerOpen: false,

      addItem: (product, quantity = 1) => {
        if (product.stock <= 0) return;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.product.id === product.id);

          if (existingIndex > -1) {
            const currentItem = state.items[existingIndex];
            const newQty = Math.min(currentItem.quantity + quantity, product.stock);
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQty,
              product: { ...product }, // update with freshest product info
            };
            return { items: updatedItems };
          } else {
            const initialQty = Math.min(quantity, product.stock);
            const newItem: CartItem = {
              product: { ...product },
              quantity: initialQty,
              addedAt: Date.now(),
              priceWhenAdded: product.price,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.product.id === productId) {
              const clampedQty = Math.min(quantity, item.product.stock);
              return { ...item, quantity: clampedQty };
            }
            return item;
          });
          return { items: updatedItems };
        });
      },

      clearCart: () => {
        set({ items: [], appliedPromo: null, healingNotices: [] });
      },

      applyPromo: (rawCode: string) => {
        const code = rawCode.trim().toUpperCase();
        const promo = PROMO_CODES[code];
        const subtotal = get().getSubtotal();

        if (!promo) {
          return { success: false, message: 'Invalid promo code. Try FRESH15, SAVE5, or GREEN20.' };
        }

        if (subtotal < promo.minOrder) {
          return {
            success: false,
            message: `Minimum order of $${promo.minOrder.toFixed(2)} required for ${code}.`,
          };
        }

        set({ appliedPromo: code });
        return { success: true, message: `Promo code ${code} applied successfully!` };
      },

      removePromo: () => {
        set({ appliedPromo: null });
      },

      setTipAmount: (amount) => {
        set({ tipAmount: Math.max(0, amount) });
      },

      setDeliveryOption: (option) => {
        set({ deliveryOption: option });
      },

      setIsDrawerOpen: (open) => {
        set({ isDrawerOpen: open });
      },

      dismissNotice: (noticeId) => {
        set((state) => ({
          healingNotices: state.healingNotices.filter((n) => n.id !== noticeId),
        }));
      },

      clearAllNotices: () => {
        set({ healingNotices: [] });
      },

      /**
       * Engineering Challenge B: Persisted Cart Consistency Engine
       * Validates all cached cart items against the active catalog:
       * 1. Delisted items -> removed with notice
       * 2. Price changes -> updated to current catalog price with notice
       * 3. Stock changes / zero stock -> clamped or removed with notice
       */
      reconcileCartWithCatalog: () => {
        const currentItems = get().items;
        if (currentItems.length === 0) {
          return { notices: [], hasModifications: false };
        }

        const catalog = MockApiService.getProductsCatalog();
        const catalogMap = new Map(catalog.map((p) => [p.id, p]));

        const newItems: CartItem[] = [];
        const newNotices: CartHealingNotice[] = [];
        let hasModifications = false;

        for (const item of currentItems) {
          const freshProduct = catalogMap.get(item.product.id);

          // Case 1: Product no longer exists in dataset
          if (!freshProduct) {
            hasModifications = true;
            newNotices.push({
              id: `notice-delisted-${item.product.id}-${Date.now()}`,
              type: 'item_delisted',
              productId: item.product.id,
              productName: item.product.name,
              message: `"${item.product.name}" is no longer available and was removed from your cart.`,
              timestamp: Date.now(),
            });
            continue;
          }

          // Case 2: Stock is 0
          if (freshProduct.stock <= 0) {
            hasModifications = true;
            newNotices.push({
              id: `notice-oos-${freshProduct.id}-${Date.now()}`,
              type: 'out_of_stock',
              productId: freshProduct.id,
              productName: freshProduct.name,
              message: `"${freshProduct.name}" is currently out of stock and was removed from your cart.`,
              timestamp: Date.now(),
            });
            continue;
          }

          let adjustedQuantity = item.quantity;

          // Case 3: Quantity exceeds current available stock
          if (item.quantity > freshProduct.stock) {
            hasModifications = true;
            adjustedQuantity = freshProduct.stock;
            newNotices.push({
              id: `notice-stock-${freshProduct.id}-${Date.now()}`,
              type: 'quantity_adjusted',
              productId: freshProduct.id,
              productName: freshProduct.name,
              oldValue: item.quantity,
              newValue: freshProduct.stock,
              message: `Quantity for "${freshProduct.name}" adjusted from ${item.quantity} to available stock (${freshProduct.stock}).`,
              timestamp: Date.now(),
            });
          }

          // Case 4: Price changed since persisted or added
          if (freshProduct.price !== item.product.price) {
            hasModifications = true;
            const diff = freshProduct.price - item.product.price;
            const diffFormatted = diff > 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`;
            newNotices.push({
              id: `notice-price-${freshProduct.id}-${Date.now()}`,
              type: 'price_changed',
              productId: freshProduct.id,
              productName: freshProduct.name,
              oldValue: item.product.price,
              newValue: freshProduct.price,
              message: `Price for "${freshProduct.name}" updated from $${item.product.price.toFixed(2)} to $${freshProduct.price.toFixed(2)} (${diffFormatted}).`,
              timestamp: Date.now(),
            });
          }

          newItems.push({
            product: { ...freshProduct },
            quantity: adjustedQuantity,
            addedAt: item.addedAt,
            priceWhenAdded: item.priceWhenAdded,
          });
        }

        if (hasModifications) {
          set((state) => ({
            items: newItems,
            healingNotices: [...newNotices, ...state.healingNotices].slice(0, 10),
          }));
        }

        return { notices: newNotices, hasModifications };
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const promoCode = get().appliedPromo;
        if (!promoCode || !PROMO_CODES[promoCode]) return 0;

        const promo = PROMO_CODES[promoCode];
        if (subtotal < promo.minOrder) return 0;

        if (promo.discountPercent) {
          return (subtotal * promo.discountPercent) / 100;
        }
        if (promo.fixedDiscount) {
          return Math.min(promo.fixedDiscount, subtotal);
        }
        return 0;
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= 35) return 0; // Free delivery over $35
        const option = get().deliveryOption;
        if (option === 'express') return 3.99;
        return 1.99;
      },

      getTaxAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const taxable = Math.max(0, subtotal - discount);
        return taxable * 0.0825; // 8.25% CA sales tax
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountAmount();
        const delivery = get().getDeliveryFee();
        const tax = get().getTaxAmount();
        const tip = get().tipAmount;
        return Math.max(0, subtotal - discount + delivery + tax + tip);
      },
    }),
    {
      name: 'freshgo_cart_storage_v1',
      partialize: (state) => ({
        items: state.items,
        appliedPromo: state.appliedPromo,
        tipAmount: state.tipAmount,
        deliveryOption: state.deliveryOption,
      }),
    }
  )
);
