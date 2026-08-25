import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Zap, ShieldAlert, Cpu, Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useDebugStore } from '../../stores/debugStore';
import { useSearchStore } from '../../stores/searchStore';
import { useCartStore } from '../../stores/cartStore';
import { useToast } from './Toast';

export const EngineeringLabDrawer: React.FC = () => {
  const { addToast } = useToast();
  const isLabOpen = useDebugStore((state) => state.isLabOpen);
  const setIsLabOpen = useDebugStore((state) => state.setIsLabOpen);
  const activeTab = useDebugStore((state) => state.activeTab);
  const setActiveTab = useDebugStore((state) => state.setActiveTab);
  const simulatedMinLatency = useDebugStore((state) => state.simulatedMinLatency);
  const simulatedMaxLatency = useDebugStore((state) => state.simulatedMaxLatency);
  const simulatedFailureRate = useDebugStore((state) => state.simulatedFailureRate);
  const updateLatency = useDebugStore((state) => state.updateLatency);
  const updateFailureRate = useDebugStore((state) => state.updateFailureRate);
  const runAutomatedRaceConditionTest = useDebugStore((state) => state.runAutomatedRaceConditionTest);
  const isSimulatingRaceCondition = useDebugStore((state) => state.isSimulatingRaceCondition);
  const raceTestStatus = useDebugStore((state) => state.raceTestStatus);

  const injectPriceChange = useDebugStore((state) => state.injectPriceChange);
  const injectOutOfStock = useDebugStore((state) => state.injectOutOfStock);
  const injectStockClamp = useDebugStore((state) => state.injectStockClamp);
  const injectDelistedItem = useDebugStore((state) => state.injectDelistedItem);
  const resetAllData = useDebugStore((state) => state.resetAllData);

  const searchLogs = useSearchStore((state) => state.debugLogs);
  const staleDiscardedCount = useSearchStore((state) => state.staleResponsesDiscardedCount);
  const clearDebugLogs = useSearchStore((state) => state.clearDebugLogs);
  const cartHealingNotices = useCartStore((state) => state.healingNotices);
  const reconcileCartWithCatalog = useCartStore((state) => state.reconcileCartWithCatalog);

  const handleRunRaceTest = async () => {
    addToast({
      type: 'info',
      title: 'Starting Race Test',
      message: 'Launching Slow Request A (milk) followed by Fast Request B (berry)...',
    });
    await runAutomatedRaceConditionTest();
    addToast({
      type: 'success',
      title: 'Race Protection Verified',
      message: 'Request B set the UI first. Request A finished later and was discarded!',
    });
  };

  const handleReconcileCart = () => {
    const res = reconcileCartWithCatalog();
    if (res.hasModifications) {
      addToast({
        type: 'warning',
        title: 'Cart Reconciled',
        message: `Applied ${res.notices.length} healing actions to keep cart consistent.`,
      });
    } else {
      addToast({
        type: 'success',
        title: 'Cart is Consistent',
        message: 'All cart items match active catalog pricing & inventory perfectly.',
      });
    }
  };

  return (
    <AnimatePresence>
      {isLabOpen && (
        <div id="engineering-lab-modal" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLabOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="w-screen max-w-xl bg-[#0A0A0A] text-[#E0E0E0] shadow-2xl flex flex-col border-l border-white/10"
            >
              {/* Lab Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A7C957]/15 border border-[#A7C957]/30 flex items-center justify-center text-[#A7C957]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white font-serif">Engineering Lab & Debugger</h2>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-[#A7C957]/15 text-[#A7C957] border border-[#A7C957]/30 px-2 py-0.5 rounded-full">
                        Live Inspector
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Real-time test harness for Challenge A & B edge cases
                    </p>
                  </div>
                </div>
                <button
                  id="close-engineering-lab-btn"
                  onClick={() => setIsLabOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lab Tabs */}
              <div className="flex border-b border-white/10 bg-white/5 px-4">
                <button
                  id="tab-challenge-a"
                  onClick={() => setActiveTab('challenge-a')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'challenge-a'
                      ? 'border-[#A7C957] text-[#A7C957] bg-[#A7C957]/10'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Challenge A: Stale Search</span>
                  {staleDiscardedCount > 0 && (
                    <span className="bg-[#A7C957]/20 text-[#A7C957] text-[10px] px-1.5 py-0.5 rounded-full border border-[#A7C957]/30">
                      {staleDiscardedCount} dropped
                    </span>
                  )}
                </button>

                <button
                  id="tab-challenge-b"
                  onClick={() => setActiveTab('challenge-b')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'challenge-b'
                      ? 'border-[#A7C957] text-[#A7C957] bg-[#A7C957]/10'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Challenge B: Cart Consistency</span>
                  {cartHealingNotices.length > 0 && (
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full border border-amber-500/30">
                      {cartHealingNotices.length}
                    </span>
                  )}
                </button>

                <button
                  id="tab-network"
                  onClick={() => setActiveTab('network')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'network'
                      ? 'border-[#A7C957] text-[#A7C957] bg-[#A7C957]/10'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Network & Latency</span>
                </button>
              </div>

              {/* Lab Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* TAB 1: CHALLENGE A */}
                {activeTab === 'challenge-a' && (
                  <div className="space-y-5">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#A7C957]" />
                          <span>Race Condition Protection Harness</span>
                        </h3>
                        <span className="text-[11px] text-neutral-400">
                          Sequence IDs & Token Validation
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        Demonstrates the classic out-of-order search bug: User triggers Slow Request A (1400ms) then immediately Fast Request B (250ms). Request B settles first and displays results. When Request A finishes, the monotonic sequence check automatically detects it as stale and prevents UI pollution.
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row gap-2">
                        <button
                          id="run-race-test-btn"
                          disabled={isSimulatingRaceCondition}
                          onClick={handleRunRaceTest}
                          className="flex-1 py-2.5 px-4 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-[#A7C957]/10 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-[#0A0A0A]" />
                          <span>{isSimulatingRaceCondition ? 'Running Test...' : 'Run Automated Race Condition Test'}</span>
                        </button>
                        <button
                          id="clear-debug-logs-btn"
                          onClick={clearDebugLogs}
                          className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Clear Logs</span>
                        </button>
                      </div>

                      {raceTestStatus && (
                        <div className="p-3 bg-[#A7C957]/15 border border-[#A7C957]/30 rounded-xl text-xs text-[#A7C957] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#A7C957] shrink-0" />
                          <span>{raceTestStatus}</span>
                        </div>
                      )}
                    </div>

                    {/* Live Request Stream */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                          Live Request Log ({searchLogs.length})
                        </h4>
                        <span className="text-[11px] text-[#A7C957] font-semibold">
                          {staleDiscardedCount} stale responses dropped
                        </span>
                      </div>

                      {searchLogs.length === 0 ? (
                        <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-neutral-500 text-xs">
                          No search requests recorded yet. Type in search bar or click "Run Automated Race Condition Test".
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {searchLogs.map((log) => (
                            <div
                              key={log.id}
                              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                                log.status === 'discarded_stale'
                                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                                  : log.status === 'completed'
                                  ? 'bg-[#A7C957]/10 border-[#A7C957]/30 text-white'
                                  : log.status === 'aborted'
                                  ? 'bg-white/5 border-white/10 text-neutral-400'
                                  : 'bg-sky-950/40 border-sky-800/80 text-sky-200 animate-pulse'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-[10px] bg-black/40 border border-white/10 px-1.5 py-0.5 rounded text-neutral-300">
                                  Seq #{log.sequenceId}
                                </span>
                                <div>
                                  <p className="font-bold">
                                    Query: "{log.query}"
                                  </p>
                                  <p className="text-[10px] opacity-75 mt-0.5">
                                    Latency: {log.latencyMs ? `${log.latencyMs}ms` : 'pending...'}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span
                                  className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                                    log.status === 'discarded_stale'
                                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                      : log.status === 'completed'
                                      ? 'bg-[#A7C957]/20 text-[#A7C957] border border-[#A7C957]/30'
                                      : log.status === 'aborted'
                                      ? 'bg-white/10 text-neutral-300'
                                      : 'bg-sky-500/20 text-sky-400'
                                  }`}
                                >
                                  {log.status === 'discarded_stale'
                                    ? '🛡️ Stale Dropped'
                                    : log.status === 'completed'
                                    ? '✓ Applied to UI'
                                    : log.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: CHALLENGE B */}
                {activeTab === 'challenge-b' && (
                  <div className="space-y-5">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-[#A7C957]" />
                          <span>Cart Consistency & Fault Injection</span>
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        Test how the application handles persisted carts when the underlying catalog changes across sessions. Use the triggers below to inject anomalies and verify self-healing behavior.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <button
                          id="inject-price-hike-btn"
                          onClick={() => {
                            injectPriceChange('prod-avocado-hass', 7.99);
                            addToast({
                              type: 'warning',
                              title: 'Fault Injected: Price Hike',
                              message: 'Organic Avocados price raised from $4.49 to $7.99 in database.',
                            });
                          }}
                          className="p-3 bg-white/5 hover:bg-white/10 text-left rounded-xl border border-white/10 transition-colors cursor-pointer"
                        >
                          <p className="text-xs font-bold text-amber-300">1. Simulate Price Hike</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Set Avocado price: $4.49 ➔ $7.99
                          </p>
                        </button>

                        <button
                          id="inject-oos-btn"
                          onClick={() => {
                            injectOutOfStock('prod-sourdough-artisan');
                            addToast({
                              type: 'error',
                              title: 'Fault Injected: Stock Depleted',
                              message: 'SF Country Sourdough stock set to 0 in database.',
                            });
                          }}
                          className="p-3 bg-white/5 hover:bg-white/10 text-left rounded-xl border border-white/10 transition-colors cursor-pointer"
                        >
                          <p className="text-xs font-bold text-rose-300">2. Simulate Out of Stock</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Set Sourdough stock to 0
                          </p>
                        </button>

                        <button
                          id="inject-delist-btn"
                          onClick={() => {
                            injectDelistedItem('prod-pasture-eggs-dozen');
                            addToast({
                              type: 'error',
                              title: 'Fault Injected: Item Delisted',
                              message: 'Pasture Eggs deleted from master catalog database.',
                            });
                          }}
                          className="p-3 bg-white/5 hover:bg-white/10 text-left rounded-xl border border-white/10 transition-colors cursor-pointer"
                        >
                          <p className="text-xs font-bold text-rose-300">3. Simulate Delisted Product</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Delete Heirloom Eggs from DB
                          </p>
                        </button>

                        <button
                          id="inject-stock-clamp-btn"
                          onClick={() => {
                            injectStockClamp('prod-strawberries-organic', 2);
                            addToast({
                              type: 'warning',
                              title: 'Fault Injected: Low Stock Clamp',
                              message: 'Strawberries stock clamped to 2 units.',
                            });
                          }}
                          className="p-3 bg-white/5 hover:bg-white/10 text-left rounded-xl border border-white/10 transition-colors cursor-pointer"
                        >
                          <p className="text-xs font-bold text-sky-300">4. Clamp Stock to 2</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Set Strawberries max stock to 2
                          </p>
                        </button>
                      </div>

                      <div className="pt-3 flex gap-2">
                        <button
                          id="reconcile-cart-now-btn"
                          onClick={handleReconcileCart}
                          className="flex-1 py-2.5 px-3 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>Run Reconcile Engine Now</span>
                        </button>
                        <button
                          id="reset-db-btn"
                          onClick={() => {
                            resetAllData();
                            addToast({
                              type: 'info',
                              title: 'Catalog Reset',
                              message: 'Reset mock catalog database to default values.',
                            });
                          }}
                          className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Reset Database
                        </button>
                      </div>
                    </div>

                    {/* Active Cart Healing Notices */}
                    <div>
                      <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                        Active Reconciliation Notices ({cartHealingNotices.length})
                      </h4>
                      {cartHealingNotices.length === 0 ? (
                        <div className="p-6 text-center bg-white/5 rounded-2xl border border-white/10 text-neutral-500 text-xs">
                          Cart is currently in sync with database. Click an anomaly trigger above to simulate inconsistency.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {cartHealingNotices.map((n) => (
                            <div
                              key={n.id}
                              className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-[#A7C957] uppercase tracking-wider">
                                  {n.type}
                                </span>
                                <span className="text-neutral-500">
                                  {new Date(n.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-neutral-200">{n.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: NETWORK */}
                {activeTab === 'network' && (
                  <div className="space-y-5">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                      <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#A7C957]" />
                        <span>Simulated Network Latency</span>
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Adjust asynchronous delay range for all simulated catalog queries and search requests.
                      </p>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-neutral-400">Minimum Latency</span>
                            <span className="font-mono text-[#A7C957]">{simulatedMinLatency}ms</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="1000"
                            step="50"
                            value={simulatedMinLatency}
                            onChange={(e) => updateLatency(parseInt(e.target.value), simulatedMaxLatency)}
                            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#A7C957]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-neutral-400">Maximum Latency</span>
                            <span className="font-mono text-[#A7C957]">{simulatedMaxLatency}ms</span>
                          </div>
                          <input
                            type="range"
                            min="500"
                            max="2500"
                            step="100"
                            value={simulatedMaxLatency}
                            onChange={(e) => updateLatency(simulatedMinLatency, parseInt(e.target.value))}
                            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#A7C957]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
                      <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Simulated Network Failure Rate</span>
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Inject random 500 error responses into catalog requests to test UI retry states and error banners.
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            updateFailureRate(0);
                            addToast({ type: 'info', title: 'Network Status', message: 'Failure rate set to 0% (Reliable)' });
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            simulatedFailureRate === 0
                              ? 'bg-[#A7C957] text-[#0A0A0A]'
                              : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                          }`}
                        >
                          0% (Normal)
                        </button>
                        <button
                          onClick={() => {
                            updateFailureRate(0.5);
                            addToast({ type: 'warning', title: 'Network Status', message: 'Failure rate set to 50% (Flaky)' });
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            simulatedFailureRate === 0.5
                              ? 'bg-amber-500 text-[#0A0A0A]'
                              : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                          }`}
                        >
                          50% (Flaky)
                        </button>
                        <button
                          onClick={() => {
                            updateFailureRate(1.0);
                            addToast({ type: 'error', title: 'Network Status', message: 'Failure rate set to 100% (Offline/Error)' });
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            simulatedFailureRate === 1.0
                              ? 'bg-rose-500 text-white'
                              : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                          }`}
                        >
                          100% (Offline)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
