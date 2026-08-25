export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  unit: string; // e.g. "1 lb", "500g", "each", "pack of 6"
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  stock: number;
  isOrganic?: boolean;
  isPopular?: boolean;
  isDeal?: boolean;
  discountPercent?: number;
  tags: string[];
  dietary: ('Organic' | 'Gluten-Free' | 'Vegan' | 'Dairy-Free' | 'Non-GMO' | 'Keto')[];
  description: string;
  origin?: string;
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  itemCount: number;
  accentColor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number;
  priceWhenAdded: number;
}

export interface CartHealingNotice {
  id: string;
  type: 'price_changed' | 'out_of_stock' | 'quantity_adjusted' | 'item_delisted';
  productId: string;
  productName: string;
  oldValue?: number | string;
  newValue?: number | string;
  message: string;
  timestamp: number;
}

export interface FilterOptions {
  category: string;
  dietary: string[];
  minPrice: number;
  maxPrice: number;
  onlyOrganic: boolean;
  onlyDeals: boolean;
  inStockOnly: boolean;
  sortBy: 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'discount';
}

export interface DeliveryAddress {
  id: string;
  title: string;
  street: string;
  apt?: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
  notes?: string;
}

export interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  holderName: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: number;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tip: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'packing' | 'out_for_delivery' | 'delivered' | 'failed';
  deliveryAddress: DeliveryAddress;
  deliverySlot: string;
  paymentMethod: string;
  estimatedDeliveryTime: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tier: 'Prime' | 'Standard';
  loyaltyPoints: number;
  addresses: DeliveryAddress[];
  paymentCards: PaymentCard[];
}

export interface SearchDebugLog {
  id: string;
  sequenceId: number;
  query: string;
  startedAt: number;
  completedAt?: number;
  latencyMs: number;
  status: 'pending' | 'completed' | 'discarded_stale' | 'aborted';
  resultsCount?: number;
}
