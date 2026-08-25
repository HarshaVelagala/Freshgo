import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { EngineeringLabDrawer } from './components/common/EngineeringLabDrawer';
import { ToastProvider, ToastContainer } from './components/common/Toast';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderFailurePage } from './pages/OrderFailurePage';
import { ProfilePage } from './pages/ProfilePage';
import { useCartStore } from './stores/cartStore';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export function App() {
  const reconcileCartWithCatalog = useCartStore((state) => state.reconcileCartWithCatalog);

  // Initialize cart reconciliation on initial load
  useEffect(() => {
    reconcileCartWithCatalog();
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex flex-col font-sans antialiased selection:bg-[#A7C957]/30 selection:text-[#A7C957]">
          {/* Persistent Global Header */}
          <Header />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 pb-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/order-failure" element={<OrderFailurePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Fallback route */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          {/* Global Drawers and Modals */}
          <CartDrawer />
          <EngineeringLabDrawer />
          <ToastContainer />

          {/* Mobile Bottom Navigation (Visible on mobile screens) */}
          <BottomNav />

          {/* Responsive Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
