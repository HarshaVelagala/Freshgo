import React, { useState } from 'react';
import {
  User as UserIcon,
  Crown,
  MapPin,
  CreditCard,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  DollarSign,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { AddressModal } from '../components/common/AddressModal';
import { useToast } from '../components/common/Toast';

export const ProfilePage: React.FC = () => {
  const { addToast } = useToast();
  const user = useUserStore((state) => state.user);
  const selectedAddressId = useUserStore((state) => state.selectedAddressId);
  const setSelectedAddress = useUserStore((state) => state.setSelectedAddress);
  const orders = useUserStore((state) => state.orders);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 text-[#E0E0E0]">
      {/* Profile Header */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#A7C957] text-[#0A0A0A] font-black text-xl flex items-center justify-center shadow-lg shadow-[#A7C957]/10">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-serif">{user.name}</h1>
              {user.tier === 'Prime' && (
                <span className="inline-flex items-center gap-1 bg-[#A7C957]/15 text-[#A7C957] border border-[#A7C957]/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  <Crown className="w-3 h-3 fill-[#A7C957] text-[#A7C957]" />
                  <span>PRIME MEMBER</span>
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{user.email} • {user.phone}</p>
          </div>
        </div>

        {/* Loyalty Points */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 w-full sm:w-auto shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#A7C957]/20 text-[#A7C957] flex items-center justify-center font-black border border-[#A7C957]/30">
            <Sparkles className="w-5 h-5 text-[#A7C957]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400">FreshGo Points</span>
            <p className="text-lg font-bold text-white font-serif leading-tight">
              {user.loyaltyPoints.toLocaleString()} <span className="text-[#A7C957] text-sm">pts</span>
            </p>
            <p className="text-[10px] text-[#A7C957] font-semibold">
              ${((user.loyaltyPoints / 100) * 1.5).toFixed(2)} reward balance
            </p>
          </div>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#A7C957]" />
            <h2 className="text-base font-bold text-white font-serif">Saved Delivery Addresses</h2>
          </div>
          <button
            id="profile-add-address-btn"
            onClick={() => setIsAddressModalOpen(true)}
            className="text-xs font-bold text-[#A7C957] hover:underline flex items-center gap-1 bg-[#A7C957]/15 px-3 py-1.5 rounded-xl border border-[#A7C957]/30 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {user.addresses.map((addr) => {
            const isSelected = addr.id === selectedAddressId;
            return (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#A7C957] bg-[#A7C957]/15 ring-1 ring-[#A7C957]'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{addr.title}</span>
                    <p className="text-xs text-neutral-300 mt-1">{addr.street}</p>
                    <p className="text-xs text-neutral-400">
                      {addr.city}, {addr.zipCode}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-[#A7C957] bg-[#A7C957]/20 border border-[#A7C957]/30 px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Payment Methods */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#A7C957]" />
          <h2 className="text-base font-bold text-white font-serif">Saved Payment Methods</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {user.paymentCards.map((card) => (
            <div
              key={card.id}
              className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-8 rounded-lg bg-black text-white border border-white/10 flex items-center justify-center font-bold text-xs uppercase">
                  {card.type}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">•••• •••• •••• {card.last4}</p>
                  <p className="text-[11px] text-neutral-400">Expires {card.expiry}</p>
                </div>
              </div>
              {card.isDefault && (
                <span className="text-[10px] font-semibold text-[#A7C957] bg-[#A7C957]/15 border border-[#A7C957]/20 px-2 py-0.5 rounded-md">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#A7C957]" />
          <h2 className="text-base font-bold text-white font-serif">Recent Grocery Orders</h2>
        </div>

        <div className="space-y-3 pt-2">
          {orders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            return (
              <div
                key={ord.id}
                className="border border-white/10 rounded-2xl overflow-hidden transition-all bg-white/5"
              >
                <div
                  onClick={() => toggleOrderExpand(ord.id)}
                  className="p-4 bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#A7C957]/15 text-[#A7C957] border border-[#A7C957]/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-serif">
                        Order #{ord.orderNumber}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#A7C957] font-serif">
                      ${ord.total.toFixed(2)}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-black/40 border-t border-white/10 space-y-3 text-xs">
                    <div className="space-y-2">
                      {ord.items.map((it) => (
                        <div
                          key={it.product.id}
                          className="flex items-center justify-between text-neutral-300"
                        >
                          <span>
                            {it.quantity}x {it.product.name}
                          </span>
                          <span className="font-semibold text-white font-serif">
                            ${(it.product.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-white/10 text-[11px] text-neutral-400 flex justify-between">
                      <span>Delivered to: {ord.deliveryAddress.street}</span>
                      <span>Payment: {ord.paymentMethod}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
};
