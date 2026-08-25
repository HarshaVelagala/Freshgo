import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DeliveryAddress, Order, PaymentCard, UserProfile } from '../types/grocery';
import { INITIAL_USER } from '../data/mockData';

interface UserState {
  user: UserProfile;
  orders: Order[];
  selectedAddressId: string;
  selectedCardId: string;
  isLoggedIn: boolean;

  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  setSelectedAddress: (addressId: string) => void;
  setSelectedCard: (cardId: string) => void;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  addPaymentCard: (card: Omit<PaymentCard, 'id'>) => void;
  addOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
  toggleLogin: () => void;
  getSelectedAddress: () => DeliveryAddress | undefined;
  getSelectedCard: () => PaymentCard | undefined;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER,
      orders: [
        {
          id: 'ord-1001',
          orderNumber: 'FG-98214',
          createdAt: Date.now() - 86400000 * 2, // 2 days ago
          items: [
            {
              product: {
                id: 'prod-avocado-hass',
                name: 'Organic Hass Avocados',
                category: 'Fresh Produce',
                categoryId: 'cat-fruits-veg',
                price: 4.49,
                unit: 'bag of 4',
                rating: 4.8,
                reviewCount: 342,
                image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
                stock: 28,
                tags: ['organic', 'avocado'],
                dietary: ['Organic', 'Vegan'],
                description: 'Creamy Haas avocados',
              },
              quantity: 2,
              addedAt: Date.now() - 86400000 * 2,
              priceWhenAdded: 4.49,
            },
            {
              product: {
                id: 'prod-sourdough-artisan',
                name: 'San Francisco Country Sourdough',
                category: 'Artisan Bakery',
                categoryId: 'cat-bakery',
                price: 5.49,
                unit: '1 loaf',
                rating: 4.9,
                reviewCount: 410,
                image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
                stock: 9,
                tags: ['sourdough', 'bread'],
                dietary: ['Vegan'],
                description: '36-hour sourdough',
              },
              quantity: 1,
              addedAt: Date.now() - 86400000 * 2,
              priceWhenAdded: 5.49,
            },
          ],
          subtotal: 14.47,
          deliveryFee: 1.99,
          discount: 0,
          tip: 2.5,
          tax: 1.19,
          total: 20.15,
          status: 'delivered',
          deliveryAddress: INITIAL_USER.addresses[0],
          deliverySlot: 'Delivered Tuesday at 4:15 PM',
          paymentMethod: 'Visa •••• 4242',
          estimatedDeliveryTime: 'Delivered',
        },
      ],
      selectedAddressId: 'addr-home',
      selectedCardId: 'card-visa-4242',
      isLoggedIn: true,

      updateProfile: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },

      setSelectedAddress: (addressId) => {
        set({ selectedAddressId: addressId });
      },

      setSelectedCard: (cardId) => {
        set({ selectedCardId: cardId });
      },

      addAddress: (address) => {
        const newAddress: DeliveryAddress = {
          ...address,
          id: `addr-${Date.now()}`,
        };
        set((state) => ({
          user: {
            ...state.user,
            addresses: [...state.user.addresses, newAddress],
          },
          selectedAddressId: newAddress.id,
        }));
      },

      addPaymentCard: (card) => {
        const newCard: PaymentCard = {
          ...card,
          id: `card-${Date.now()}`,
        };
        set((state) => ({
          user: {
            ...state.user,
            paymentCards: [...state.user.paymentCards, newCard],
          },
          selectedCardId: newCard.id,
        }));
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
          user: {
            ...state.user,
            loyaltyPoints: state.user.loyaltyPoints + Math.floor(order.total * 2),
          },
        }));
      },

      getOrderById: (orderId) => {
        return get().orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      },

      toggleLogin: () => {
        set((state) => ({ isLoggedIn: !state.isLoggedIn }));
      },

      getSelectedAddress: () => {
        const { user, selectedAddressId } = get();
        return user.addresses.find((a) => a.id === selectedAddressId) || user.addresses[0];
      },

      getSelectedCard: () => {
        const { user, selectedCardId } = get();
        return user.paymentCards.find((c) => c.id === selectedCardId) || user.paymentCards[0];
      },
    }),
    {
      name: 'freshgo_user_storage_v1',
    }
  )
);
