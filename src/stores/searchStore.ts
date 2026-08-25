import { create } from 'zustand';
import { Product, SearchDebugLog } from '../types/grocery';
import { MockApiService } from '../services/mockApi';

interface SearchState {
  query: string;
  results: Product[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  
  // Stale Search Protection state (Challenge A)
  currentSequenceId: number;
  latestCompletedSequenceId: number;
  debugLogs: SearchDebugLog[];
  staleResponsesDiscardedCount: number;
  
  // Abort controller reference
  activeAbortController: AbortController | null;

  // Actions
  setQuery: (query: string) => void;
  performSearch: (query: string, options?: { customLatencyMs?: number; sequenceOverride?: number }) => Promise<void>;
  clearSearch: () => void;
  clearDebugLogs: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  isLoading: false,
  error: null,
  hasSearched: false,
  currentSequenceId: 0,
  latestCompletedSequenceId: 0,
  debugLogs: [],
  staleResponsesDiscardedCount: 0,
  activeAbortController: null,

  setQuery: (query: string) => {
    set({ query });
  },

  clearSearch: () => {
    // Abort any ongoing search
    if (get().activeAbortController) {
      get().activeAbortController?.abort();
    }
    set({
      query: '',
      results: [],
      isLoading: false,
      error: null,
      hasSearched: false,
      activeAbortController: null,
    });
  },

  clearDebugLogs: () => {
    set({ debugLogs: [], staleResponsesDiscardedCount: 0 });
  },

  /**
   * Engineering Challenge A: Stale Search Protection Algorithm
   * 1. Monotonically increasing sequence ID (ticket number)
   * 2. In-flight AbortController cancellation
   * 3. Response validation: If returned sequence ID < latestCompletedSequenceId or sequence ID !== currentSequenceId, DISCARD.
   */
  performSearch: async (searchQuery: string, options?: { customLatencyMs?: number; sequenceOverride?: number }) => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      get().clearSearch();
      return;
    }

    // Abort previous in-flight HTTP request if any
    const prevController = get().activeAbortController;
    if (prevController && !options?.sequenceOverride) {
      prevController.abort();
    }

    const abortController = new AbortController();
    const sequenceId = options?.sequenceOverride ?? (get().currentSequenceId + 1);
    const startTime = Date.now();

    const newLog: SearchDebugLog = {
      id: `req-${sequenceId}-${Date.now()}`,
      sequenceId,
      query: trimmed,
      startedAt: startTime,
      latencyMs: options?.customLatencyMs ?? 0,
      status: 'pending',
    };

    set((state) => ({
      query: searchQuery,
      currentSequenceId: Math.max(state.currentSequenceId, sequenceId),
      isLoading: true,
      error: null,
      hasSearched: true,
      activeAbortController: abortController,
      debugLogs: [newLog, ...state.debugLogs].slice(0, 20),
    }));

    try {
      const results = await MockApiService.searchProducts(trimmed, {
        latencyMs: options?.customLatencyMs,
        signal: abortController.signal,
      });

      const finishTime = Date.now();
      const actualDuration = finishTime - startTime;

      // STALE RESPONSE CHECK:
      // A response is considered stale if:
      // 1. A newer sequence ID has already settled (latestCompletedSequenceId > sequenceId)
      // 2. OR the current active search sequence ID is greater than this sequenceId
      const currentHighestSeq = get().currentSequenceId;
      const latestSettledSeq = get().latestCompletedSequenceId;
      const isStale = sequenceId < latestSettledSeq || sequenceId < currentHighestSeq;

      if (isStale) {
        // DISCARD STALE RESPONSE: Do not update results or active query display
        set((state) => ({
          staleResponsesDiscardedCount: state.staleResponsesDiscardedCount + 1,
          debugLogs: state.debugLogs.map((log) =>
            log.sequenceId === sequenceId
              ? {
                  ...log,
                  status: 'discarded_stale',
                  completedAt: finishTime,
                  latencyMs: actualDuration,
                  resultsCount: results.length,
                }
              : log
          ),
        }));
        return;
      }

      // Valid newest response -> update state
      set((state) => ({
        results,
        isLoading: false,
        latestCompletedSequenceId: sequenceId,
        debugLogs: state.debugLogs.map((log) =>
          log.sequenceId === sequenceId
            ? {
                ...log,
                status: 'completed',
                completedAt: finishTime,
                latencyMs: actualDuration,
                resultsCount: results.length,
              }
            : log
        ),
      }));
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Aborted request log
        set((state) => ({
          debugLogs: state.debugLogs.map((log) =>
            log.sequenceId === sequenceId
              ? { ...log, status: 'aborted', completedAt: Date.now() }
              : log
          ),
        }));
        return;
      }

      // Real or simulated error
      const errorMessage = err instanceof Error ? err.message : 'Failed to search products.';
      set((state) => ({
        error: errorMessage,
        isLoading: false,
        debugLogs: state.debugLogs.map((log) =>
          log.sequenceId === sequenceId
            ? { ...log, status: 'aborted', completedAt: Date.now() }
            : log
        ),
      }));
    }
  },
}));
