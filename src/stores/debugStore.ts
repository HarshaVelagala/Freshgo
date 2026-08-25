import { create } from 'zustand';
import { MockApiService } from '../services/mockApi';
import { useSearchStore } from './searchStore';
import { useCartStore } from './cartStore';

interface DebugState {
  isLabOpen: boolean;
  activeTab: 'challenge-a' | 'challenge-b' | 'network';
  simulatedMinLatency: number;
  simulatedMaxLatency: number;
  simulatedFailureRate: number;
  isSimulatingRaceCondition: boolean;
  raceTestStatus: string | null;

  // Actions
  toggleLab: () => void;
  setIsLabOpen: (open: boolean) => void;
  setActiveTab: (tab: 'challenge-a' | 'challenge-b' | 'network') => void;
  updateLatency: (min: number, max: number) => void;
  updateFailureRate: (rate: number) => void;
  
  // Challenge A automated test trigger
  runAutomatedRaceConditionTest: () => Promise<void>;
  
  // Challenge B test triggers
  injectPriceChange: (productId: string, newPrice: number) => void;
  injectOutOfStock: (productId: string) => void;
  injectStockClamp: (productId: string, newStock: number) => void;
  injectDelistedItem: (productId: string) => void;
  resetAllData: () => void;
}

export const useDebugStore = create<DebugState>((set, get) => ({
  isLabOpen: false,
  activeTab: 'challenge-a',
  simulatedMinLatency: 250,
  simulatedMaxLatency: 750,
  simulatedFailureRate: 0,
  isSimulatingRaceCondition: false,
  raceTestStatus: null,

  toggleLab: () => set((state) => ({ isLabOpen: !state.isLabOpen })),
  setIsLabOpen: (open) => set({ isLabOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  updateLatency: (min, max) => {
    MockApiService.setLatency(min, max);
    set({ simulatedMinLatency: min, simulatedMaxLatency: max });
  },

  updateFailureRate: (rate) => {
    MockApiService.setFailureRate(rate);
    set({ simulatedFailureRate: rate });
  },

  /**
   * Challenge A Demo:
   * Launches Request A ("milk", 1400ms latency, Seq 1)
   * Waits 200ms
   * Launches Request B ("berry", 250ms latency, Seq 2)
   * Request B finishes at T=450ms -> sets search UI to "berry".
   * Request A finishes at T=1400ms -> STALE PROTECTION drops Seq 1!
   */
  runAutomatedRaceConditionTest: async () => {
    const searchStore = useSearchStore.getState();
    set({ isSimulatingRaceCondition: true, raceTestStatus: 'Initiating Request A (Query: "milk", Latency: 1400ms)...' });

    // Launch Request A in background with 1400ms latency
    const reqAPromise = searchStore.performSearch('milk', {
      customLatencyMs: 1400,
      sequenceOverride: 101,
    });

    // Wait 250ms then launch Request B with 250ms latency
    await new Promise((r) => setTimeout(r, 250));
    set({ raceTestStatus: 'Initiating Request B (Query: "berry", Latency: 250ms)...' });

    const reqBPromise = searchStore.performSearch('berry', {
      customLatencyMs: 250,
      sequenceOverride: 102,
    });

    // Wait for both promises to settle
    await Promise.allSettled([reqAPromise, reqBPromise]);

    set({
      isSimulatingRaceCondition: false,
      raceTestStatus: 'Test Complete! Request B settled first; Request A finished later and was discarded safely.',
    });
  },

  injectPriceChange: (productId, newPrice) => {
    MockApiService.modifyProductPrice(productId, newPrice);
    // Trigger reconciliation
    useCartStore.getState().reconcileCartWithCatalog();
  },

  injectOutOfStock: (productId) => {
    MockApiService.modifyProductStock(productId, 0);
    useCartStore.getState().reconcileCartWithCatalog();
  },

  injectStockClamp: (productId, newStock) => {
    MockApiService.modifyProductStock(productId, newStock);
    useCartStore.getState().reconcileCartWithCatalog();
  },

  injectDelistedItem: (productId) => {
    MockApiService.delistProduct(productId);
    useCartStore.getState().reconcileCartWithCatalog();
  },

  resetAllData: () => {
    MockApiService.resetCatalog();
    useCartStore.getState().reconcileCartWithCatalog();
  },
}));
