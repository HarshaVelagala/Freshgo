# Architecture & Engineering Decisions

## 1. State Management: Zustand over Redux / Context API

### Context:
Grocery delivery applications require frequent, atomic state updates (e.g. quantity increments, cart reconciliation notices, live search sequence increments, address switching) across deeply nested UI components.

### Decision:
We selected **Zustand** as the unified state manager for all global stores (`cartStore`, `searchStore`, `favoritesStore`, `userStore`, `debugStore`).

### Rationale:
- **No Unnecessary Re-renders**: Zustand allows atomic selector subscriptions (e.g., `useCartStore(s => s.getItemCount())`), avoiding blanket component re-renders that plague React Context when objects change.
- **Strict Boilerplate Minimization**: Eliminates Redux action creators, reducers, and dispatch wrappers while maintaining strict TypeScript contracts.
- **Built-in Storage Middleware**: Enables selective, versioned persistence (`freshgo_cart_storage_v1`, `freshgo_user_storage_v1`) into browser storage.
- **Outside-React Access**: Zustand stores can be inspected and modified directly in asynchronous API services and test utilities without React hook lifecycles.

---

## 2. Asynchronous Race Condition Handling: Sequence IDs + AbortController

### Context:
When search inputs trigger asynchronous network queries with variable server latency, responses can return out of chronological order (e.g., a slow 800ms query for "m" resolving after a fast 150ms query for "milk").

### Decision:
We implemented a **two-tier defense strategy**:
1. **Network Layer Abort**: `AbortController.abort()` cancels existing in-flight `fetch` requests before dispatching new ones.
2. **State Store Monotonic Sequence Tickets**:
   - Every search dispatch increments `currentSequenceId`.
   - The returned response carries its origin ticket `sequenceId`.
   - The store asserts `sequenceId >= latestCompletedSequenceId`. If `false`, the response is immediately dropped and recorded in `staleResponsesDiscardedCount`.

### Why both?
`AbortController` cannot cancel requests that have already completed on the wire or are queued in microtask execution. The monotonic sequence ticket guarantees absolute client-side state consistency even if cancellation is delayed.

---

## 3. Cart Consistency & Auto-Healing Engine

### Context:
Users frequently add grocery items to a persistent cart and return hours or days later. During that time, items may have increased in price, dropped out of stock, or been removed from the catalog.

### Decision:
We built an automated **Cart Reconciliation Engine** (`reconcileCartWithCatalog`) executed on:
- App initialization
- Cart drawer toggle
- Navigating to the checkout screen
- Catalog mutation events from the Engineering Lab

### Behavior:
- **Price Drift**: Updates the cart item's price to the latest catalog value and displays a `price_changed` warning banner informing the user.
- **Out of Stock**: Drops unavailable items and raises an `out_of_stock` alert banner.
- **Delisted Products**: Cleanses discontinued items and surfaces an `item_delisted` notification.
- **Zero Silent Mutating**: All changes are clearly itemized in the `CartHealingBanner` component.

---

## 4. Engineering Lab Drawer for Edge Case Verification

### Context:
Testing asynchronous race conditions, price spikes, and payment failure states in a live UI typically requires complex mock server proxies or manual database mutations.

### Decision:
We embedded an **Engineering Lab Drawer** into the application. It allows evaluators and engineers to:
- Mutate live catalog prices (e.g. increase Haas Avocado to $7.99) to verify cart healing.
- Deplete stock counts to zero to test stock protection.
- Inject network latency (0ms to 2000ms) and simulated API failure rates.
- Trigger an automated race condition test ("Milk" slow vs "Berry" fast) with a single click.
