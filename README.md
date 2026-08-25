# FreshGo — Mobile-First Hyperlocal Grocery Delivery Platform

A responsive, production-ready React application built with **Vite**, **TypeScript (Strict Mode)**, **Tailwind CSS**, and **Zustand**. 

FreshGo provides a mobile-first grocery shopping experience paired with an adaptive desktop layout, real-time cart state reconciliation, monotonic ticket race-condition protection for asynchronous search, and an interactive Engineering Lab drawer to test complex asynchronous distributed failure scenarios.

---

## 🌟 Key Features

- **Mobile-First & Thoughtful Desktop Layout**:
  - Full mobile experience with bottom tab bar, sticky actions, swipeable drawers, and compact product cards.
  - Desktop-first responsive expansion with a 4-column product grid, sticky filter sidebars, floating cart overlays, and multi-column checkout flows.
- **Complete End-to-End Grocery Flow**:
  - **Home / Catalog**: Delivery time estimators, dynamic flash deals carousel, curated aisle categories, and promotional banners.
  - **Category / Product Listing**: Filter by dietary attributes (Organic, Vegan, Gluten-Free, Keto), price range slider, in-stock toggles, and sorting (popularity, price, ratings, discount).
  - **Product Detail**: Multi-photo gallery, nutritional breakdowns, origin information, customer reviews, and category-paired item recommendations.
  - **Search Experience**: Protected against out-of-order asynchronous race conditions with real-time ticket indicators.
  - **Shopping Cart & Checkout**: Slide-out drawer, persistent cart storage, delivery time slot scheduler, multiple payment methods (Card, Apple Pay, Cash), courier tip selector, and promo code engine.
  - **Order Outcomes**: Order confirmation with confetti animations and delivery milestone tracker, plus a dedicated checkout recovery screen with retry mechanisms.
- **Interactive Engineering Lab**:
  - Slide-out debugging drawer to simulate simulated edge cases (e.g. price hikes, stock depletion, catalog delisting, slow network responses, and automated race condition tests).

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 19, TypeScript (`strict: true`, no `any`)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with persistent storage (`cartStore`, `searchStore`, `favoritesStore`, `userStore`, `debugStore`)
- **Routing**: React Router v7 (`BrowserRouter`, dynamic routes `/category/:slug`, `/product/:id`, `/order-success/:id`)
- **Animation**: `motion/react` for drawer transitions, toast notifications, and modal backdrops
- **Icons**: `lucide-react`
- **Celebration FX**: `canvas-confetti`

---

## 🔬 Core Engineering Challenges Solved

### Challenge A: Stale Search Race Condition
- **Problem**: When a user types rapidly (e.g. typing "milk" and then "berry"), the first request (`milk`) might experience network latency and resolve *after* the second request (`berry`), corrupting the search results with outdated data.
- **Solution**:
  1. Monotonic Sequence ID ticket incrementation on every keystroke.
  2. Active `AbortController` cancellation for in-flight requests.
  3. Strict sequence ticket validation: `sequenceId < latestCompletedSequenceId` drops outdated responses.

### Challenge B: Persisted Cart Consistency & Healing
- **Problem**: Items stored in `localStorage` can become stale if backend prices change, products go out of stock, or inventory items are delisted while the user was away.
- **Solution**:
  1. Automated `reconcileCartWithCatalog` engine executes on app launch and cart drawer view.
  2. Checks each cart item against current catalog prices, stock availability, and listing status.
  3. Emits `CartHealingNotice` warnings and updates cart totals accurately.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Typecheck & Lint
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
