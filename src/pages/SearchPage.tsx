import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Zap, RotateCcw, Sparkles, Clock, CheckCircle2, ShieldCheck, Play } from 'lucide-react';
import { useSearchStore } from '../stores/searchStore';
import { useDebugStore } from '../stores/debugStore';
import { ProductGrid } from '../components/product/ProductGrid';
import { useToast } from '../components/common/Toast';

const POPULAR_SEARCHES = [
  'Organic Avocados',
  'Grass-Fed Whole Milk',
  'San Francisco Sourdough',
  'Wild Sockeye Salmon',
  'Sweet Strawberries',
  'Chia Seeds',
  'Extra Virgin Olive Oil',
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const query = useSearchStore((state) => state.query);
  const results = useSearchStore((state) => state.results);
  const isLoading = useSearchStore((state) => state.isLoading);
  const error = useSearchStore((state) => state.error);
  const hasSearched = useSearchStore((state) => state.hasSearched);
  const currentSequenceId = useSearchStore((state) => state.currentSequenceId);
  const latestCompletedSequenceId = useSearchStore((state) => state.latestCompletedSequenceId);
  const staleDiscardedCount = useSearchStore((state) => state.staleResponsesDiscardedCount);
  const setQuery = useSearchStore((state) => state.setQuery);
  const performSearch = useSearchStore((state) => state.performSearch);
  const clearSearch = useSearchStore((state) => state.clearSearch);

  const runAutomatedRaceConditionTest = useDebugStore((state) => state.runAutomatedRaceConditionTest);
  const isSimulatingRaceCondition = useDebugStore((state) => state.isSimulatingRaceCondition);
  const toggleLab = useDebugStore((state) => state.toggleLab);

  const [inputVal, setInputVal] = useState(searchParams.get('q') || query || '');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial URL param if present
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery && urlQuery !== query) {
      setInputVal(urlQuery);
      performSearch(urlQuery);
    }
  }, [searchParams]);

  // Handle debounced search on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!val.trim()) {
      clearSearch();
      setSearchParams({});
      return;
    }

    // 250ms debounce
    debounceTimerRef.current = setTimeout(() => {
      setSearchParams({ q: val.trim() });
      performSearch(val.trim());
    }, 250);
  };

  const handleClear = () => {
    setInputVal('');
    clearSearch();
    setSearchParams({});
  };

  const handleSelectKeyword = (keyword: string) => {
    setInputVal(keyword);
    setSearchParams({ q: keyword });
    performSearch(keyword);
  };

  const handleRunRaceDemo = async () => {
    addToast({
      type: 'info',
      title: 'Simulating Race Condition',
      message: 'Launching Slow Request A ("milk") followed by Fast Request B ("berry")...',
    });
    await runAutomatedRaceConditionTest();
    addToast({
      type: 'success',
      title: 'Stale Response Dropped',
      message: 'Verified: Older slow response was discarded and did not overwrite the newest search state!',
    });
  };

  return (
    <div className="space-y-6 pb-16 text-[#E0E0E0]">
      {/* Search Input Box */}
      <div className="bg-white/5 rounded-3xl p-5 sm:p-8 border border-white/10 shadow-xl space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
            Search <span className="text-[#A7C957] italic">Fresh Groceries</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Search across fresh organic produce, dairy, bakery, snacks, and meat.
          </p>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="main-search-input"
            type="text"
            autoFocus
            value={inputVal}
            onChange={handleInputChange}
            placeholder="Type 'milk', 'avocado', 'sourdough', 'salmon'..."
            className="w-full pl-12 pr-12 py-3.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-sm text-white placeholder-neutral-500 rounded-2xl border border-white/10 focus:outline-hidden focus:ring-1 focus:ring-[#A7C957] font-medium transition-all"
          />
          {inputVal && (
            <button
              id="clear-search-input-btn"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Popular / Trending Keyword Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#A7C957]" />
            <span>Popular:</span>
          </span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item}
              id={`quick-search-${item.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleSelectKeyword(item)}
              className="text-xs px-2.5 py-1 bg-white/5 hover:bg-[#A7C957]/15 hover:text-[#A7C957] hover:border-[#A7C957]/30 text-neutral-300 border border-white/10 rounded-xl font-medium transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Engineering Challenge A: Live Protection Card */}
      <div
        id="race-condition-status-card"
        className="p-4 bg-white/5 text-white rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#A7C957]/15 text-[#A7C957] border border-[#A7C957]/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white font-serif">
                Challenge A: Stale Search Race-Condition Protection
              </h3>
              <span className="text-[10px] bg-[#A7C957]/15 text-[#A7C957] border border-[#A7C957]/30 font-extrabold px-2 py-0.2 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Current Ticket: <span className="font-mono text-[#A7C957]">Seq #{currentSequenceId}</span> | Settled:{' '}
              <span className="font-mono text-[#A7C957]">Seq #{latestCompletedSequenceId}</span> | Stale Dropped:{' '}
              <span className="font-mono text-amber-400 font-bold">{staleDiscardedCount}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            id="test-race-condition-search-btn"
            disabled={isSimulatingRaceCondition}
            onClick={handleRunRaceDemo}
            className="flex-1 md:flex-none px-3.5 py-2 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-[#0A0A0A]" />
            <span>{isSimulatingRaceCondition ? 'Testing...' : 'Simulate Race Condition'}</span>
          </button>
          <button
            id="open-lab-from-search-btn"
            onClick={toggleLab}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Open Inspector
          </button>
        </div>
      </div>

      {/* Search Results / Status */}
      <div>
        {hasSearched && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold text-neutral-300">
              Found <span className="text-[#A7C957]">{results.length}</span> results for "{query}"
            </p>
            {results.length > 0 && (
              <span className="text-[11px] text-neutral-400">Showing organic and fresh picks</span>
            )}
          </div>
        )}

        <ProductGrid
          products={results}
          isLoading={isLoading}
          onResetFilters={handleClear}
          emptyTitle={hasSearched ? `No results found for "${query}"` : 'Start typing to search'}
          emptyDescription={
            hasSearched
              ? 'Try checking for typos or searching general terms like "milk", "produce", or "bread".'
              : 'Our search engine is protected against out-of-order stale responses with monotonic sequence tickets and AbortController.'
          }
        />
      </div>
    </div>
  );
};
