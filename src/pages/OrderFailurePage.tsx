import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, RotateCcw, CreditCard, ArrowLeft, MessageCircle } from 'lucide-react';

interface FailureLocationState {
  reason?: string;
  total?: number;
}

export const OrderFailurePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as FailureLocationState | undefined;

  const failureReason =
    state?.reason || 'Your bank declined the transaction. Please check your card balance or try another method.';

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-20 pt-4 text-[#E0E0E0]">
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-10 text-center shadow-xl space-y-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
            Payment Incomplete
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight mt-2">
            Unable to <span className="text-rose-400 italic">Process Order</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
            {failureReason}
          </p>
        </div>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left text-xs space-y-2">
          <p className="font-bold text-white font-serif">Don't worry, your groceries are safe:</p>
          <ul className="list-disc list-inside text-neutral-400 space-y-1 text-[11px]">
            <li>Your shopping basket has not been cleared.</li>
            <li>No funds have been debited from your card.</li>
            <li>You can retry or select an alternative payment method.</li>
          </ul>
        </div>

        {/* Retry & Alternate Actions */}
        <div className="space-y-3 pt-2">
          <button
            id="failure-retry-checkout-btn"
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-2xl font-extrabold text-xs sm:text-sm shadow-lg shadow-[#A7C957]/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Retry Payment Method</span>
          </button>

          <Link
            to="/cart"
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors block cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Review Items in Basket</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
