# Debugging Guide & Challenge Verification

This document provides a detailed breakdown of how **Challenge A** (Stale Search Race Conditions) and **Challenge B** (Cart State Drift) are tested, verified, and diagnosed.

---

## 🏎️ Challenge A: Stale Search Race Condition

### Root Cause
When searching for items in quick succession, API latency fluctuations cause network promises to resolve out-of-order. If an older request resolves after a newer request, the search UI shows results that don't match the current text in the search input.

### Algorithmic Solution
```typescript
// 1. Monotonic Ticket Assignment
const sequenceId = ++currentSequenceId;

// 2. Abort previous in-flight controller
if (currentAbortController) {
  currentAbortController.abort();
}
const abortController = new AbortController();

// 3. Execution & Verification upon resolution
try {
  const results = await MockApiService.searchProducts(query, {
    signal: abortController.signal,
    sequenceId,
  });

  // Guard: Drop if a newer sequence has already completed
  if (sequenceId < get().latestCompletedSequenceId) {
    set((s) => ({ staleResponsesDiscardedCount: s.staleResponsesDiscardedCount + 1 }));
    return; // DISCARD STALE RESPONSE
  }

  // Accept valid response
  set({
    results,
    latestCompletedSequenceId: sequenceId,
    isLoading: false,
  });
} catch (err) {
  if (err.name === 'AbortError') {
    // Gracefully handled request cancellation
  }
}
```

### How to Reproduce & Verify in FreshGo:
1. Navigate to the **Search** page (`/search`).
2. Click the **"Simulate Race Condition"** button (or open the **Engineering Lab** drawer from the top bar).
3. The automated test executes:
   - **Request 1 (Slow)**: Searches `"milk"` with an injected 1,500ms artificial network delay (Sequence #1).
   - **Request 2 (Fast)**: Searches `"berry"` 200ms later with an instant 100ms response (Sequence #2).
4. **Observed Result**:
   - Request 2 completes first and sets the screen to Strawberry/Berry items.
   - When Request 1 completes 1.3 seconds later, its Sequence #1 ticket is detected as stale (`1 < 2`) and discarded.
   - The Stale Dropped counter increments, and the berry results remain intact on screen.

---

## 🛒 Challenge B: Cart Consistency & State Drift

### Root Cause
Persisted cart state in `localStorage` gets out-of-sync when catalog prices fluctuate, suppliers change quantities, or items sell out while the customer is away.

### Algorithmic Solution
```typescript
reconcileCartWithCatalog: () => {
  const { items } = get();
  const catalog = MockApiService.getRawCatalog();
  const updatedItems: CartItem[] = [];
  const notices: CartHealingNotice[] = [];

  for (const item of items) {
    const freshProduct = catalog.find((p) => p.id === item.product.id);

    // Case 1: Product delisted
    if (!freshProduct) {
      notices.push({
        id: `notice-delist-${item.product.id}`,
        type: 'item_delisted',
        productName: item.product.name,
        message: `${item.product.name} is no longer available in our store.`,
      });
      continue;
    }

    // Case 2: Out of stock
    if (freshProduct.stock <= 0) {
      notices.push({
        id: `notice-oos-${item.product.id}`,
        type: 'out_of_stock',
        productName: item.product.name,
        message: `${item.product.name} is currently out of stock and was removed.`,
      });
      continue;
    }

    // Case 3: Price Changed
    if (freshProduct.price !== item.product.price) {
      notices.push({
        id: `notice-price-${item.product.id}`,
        type: 'price_changed',
        productName: item.product.name,
        oldValue: item.product.price,
        newValue: freshProduct.price,
        message: `Price for ${item.product.name} changed from $${item.product.price.toFixed(2)} to $${freshProduct.price.toFixed(2)}.`,
      });
    }

    updatedItems.push({
      ...item,
      product: freshProduct,
      quantity: Math.min(item.quantity, freshProduct.stock),
    });
  }

  set({
    items: updatedItems,
    healingNotices: notices,
  });
}
```

### How to Reproduce & Verify in FreshGo:
1. Add **Organic Hass Avocados** ($4.49) to your basket.
2. Open the **Engineering Lab** (click the "Lab" badge in the header).
3. Under **Catalog Mutation**:
   - Click **"Hike Avocado Price ($7.99)"** to simulate inflation/market shifts.
   - Click **"Zero Sourdough Stock (0)"** to simulate depletion.
4. Open the Shopping Basket.
5. **Observed Result**:
   - The yellow/amber **Cart State Reconciled** banner appears immediately.
   - Prices and totals recalculate with zero manual refreshes required.
   - Clear explanations are itemized with one-click dismissal.
