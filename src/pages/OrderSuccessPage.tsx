import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useUserStore } from '../stores/userStore';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const getOrderById = useUserStore((state) => state.getOrderById);
  const orders = useUserStore((state) => state.orders);

  const order = orderId ? getOrderById(orderId) : orders[0];

  useEffect(() => {
    // Fire confetti celebration on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 max-w-md mx-auto my-12">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Order Confirmed!</h2>
        <p className="text-xs text-slate-500 mb-6">
          Your order has been received and sent to our organic packing hub.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Top Banner Celebration */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-10 text-center shadow-xl space-y-4 text-[#E0E0E0]">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#A7C957]/15 text-[#A7C957] border border-[#A7C957]/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#A7C957]/10">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#A7C957] bg-[#A7C957]/15 px-3 py-1 rounded-full border border-[#A7C957]/20">
            Payment Confirmed
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white font-serif tracking-tight mt-2">
            Thank you for <span className="text-[#A7C957] italic">your order!</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Order #{order.orderNumber} is confirmed and being handpicked at our local micro-fulfillment center.
          </p>
        </div>

        {/* Live Delivery Status Stepper */}
        <div className="pt-6 border-t border-white/10">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#A7C957] text-[#0A0A0A] flex items-center justify-center mx-auto text-xs font-black">
                ✓
              </div>
              <p className="text-[11px] font-bold text-white leading-tight">Order Placed</p>
              <p className="text-[9px] text-[#A7C957] font-semibold">Confirmed</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#A7C957] text-[#0A0A0A] flex items-center justify-center mx-auto text-xs font-bold animate-pulse">
                <Package className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-bold text-white leading-tight">Packing Fresh</p>
              <p className="text-[9px] text-[#A7C957] font-semibold">In Progress</p>
            </div>

            <div className="space-y-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto text-xs font-bold">
                <Truck className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-medium text-neutral-400 leading-tight">Out for Delivery</p>
              <p className="text-[9px] text-neutral-500">ETA 15m</p>
            </div>

            <div className="space-y-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto text-xs font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-medium text-neutral-400 leading-tight">Arrived</p>
              <p className="text-[9px] text-neutral-500">Contactless</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Info & Receipt Grid */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6 text-[#E0E0E0]">
        <h2 className="text-base font-bold text-white font-serif pb-3 border-b border-white/10">
          Delivery Details & Receipt
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#A7C957]" />
              <span>Delivering To</span>
            </span>
            <p className="font-bold text-white">{order.deliveryAddress.title}</p>
            <p className="text-neutral-300">{order.deliveryAddress.street}</p>
            <p className="text-neutral-400">
              {order.deliveryAddress.city}, {order.deliveryAddress.zipCode}
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#A7C957]" />
              <span>Time & Payment</span>
            </span>
            <p className="font-bold text-white">{order.deliverySlot}</p>
            <p className="text-neutral-300">Payment: {order.paymentMethod}</p>
            <p className="text-[#A7C957] font-semibold">Earned {Math.floor(order.total * 2)} Prime Points</p>
          </div>
        </div>

        {/* Item list */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Items in This Order ({order.items.length})
          </h3>
          <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-white/5">
            {order.items.map((item) => (
              <div key={item.product.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-[#0A0A0A] border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-bold text-white">{item.product.name}</p>
                    <p className="text-[11px] text-neutral-400">
                      Qty: {item.quantity} • {item.product.unit}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-white font-serif">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing totals */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5 text-xs text-neutral-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-white">${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#A7C957] font-semibold">
              <span>Discount</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{order.deliveryFee === 0 ? <strong className="text-[#A7C957]">FREE</strong> : `$${order.deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Courier Tip</span>
            <span>${order.tip.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8.25%)</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-sm font-bold text-white">
            <span>Total Paid</span>
            <span className="text-base text-[#A7C957] font-black font-serif">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="flex-1 py-3.5 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-2xl font-extrabold text-xs sm:text-sm text-center shadow-lg shadow-[#A7C957]/10 transition-all cursor-pointer"
        >
          Continue Shopping
        </Link>
        <Link
          to="/profile"
          className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer"
        >
          View Past Orders in Profile
        </Link>
      </div>
    </div>
  );
};
