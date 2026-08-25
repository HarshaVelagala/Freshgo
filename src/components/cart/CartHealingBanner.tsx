import React from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, X, Sparkles } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';

export const CartHealingBanner: React.FC = () => {
  const healingNotices = useCartStore((state) => state.healingNotices);
  const dismissNotice = useCartStore((state) => state.dismissNotice);
  const clearAllNotices = useCartStore((state) => state.clearAllNotices);

  if (!healingNotices || healingNotices.length === 0) return null;

  return (
    <div id="cart-healing-notices-container" className="my-3 space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A7C957]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cart Auto-Reconciliation ({healingNotices.length} updates)</span>
        </div>
        {healingNotices.length > 1 && (
          <button
            id="dismiss-all-notices-btn"
            onClick={clearAllNotices}
            className="text-[11px] font-medium text-neutral-400 hover:text-white underline transition-colors cursor-pointer"
          >
            Dismiss all
          </button>
        )}
      </div>

      {healingNotices.map((notice) => {
        const isPrice = notice.type === 'price_changed';
        const isOutOrDelisted = notice.type === 'out_of_stock' || notice.type === 'item_delisted';
        const isHigher =
          isPrice &&
          typeof notice.newValue === 'number' &&
          typeof notice.oldValue === 'number' &&
          notice.newValue > notice.oldValue;

        return (
          <div
            key={notice.id}
            id={`healing-notice-${notice.id}`}
            className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2.5 transition-all ${
              isOutOrDelisted
                ? 'bg-rose-950/40 border-rose-800/40 text-rose-200'
                : isPrice
                ? isHigher
                  ? 'bg-amber-950/40 border-amber-800/40 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200'
                : 'bg-white/5 border-white/10 text-neutral-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isOutOrDelisted ? (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              ) : isPrice ? (
                isHigher ? (
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                )
              ) : (
                <AlertTriangle className="w-4 h-4 text-sky-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold">{notice.message}</p>
              <p className="text-[10px] opacity-75 mt-0.5">
                Item: <span className="font-medium">{notice.productName}</span> • Real-time catalog synced
              </p>
            </div>

            <button
              id={`dismiss-notice-${notice.id}`}
              onClick={() => dismissNotice(notice.id)}
              className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors shrink-0 cursor-pointer"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
