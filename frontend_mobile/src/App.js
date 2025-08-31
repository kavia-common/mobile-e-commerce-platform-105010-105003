import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ErrorBoundary from './components/ErrorBoundary';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('auto');
  const [actualTheme, setActualTheme] = useState('light');

  // Effect to handle theme changes
  useEffect(() => {
    const determineTheme = () => {
      if (theme === 'auto') {
        // Check if matchMedia is available (for testing environment compatibility)
        if (typeof window !== 'undefined' && window.matchMedia) {
          try {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setActualTheme(prefersDark ? 'dark' : 'light');
          } catch (error) {
            console.warn('matchMedia not supported, defaulting to light theme:', error);
            setActualTheme('light');
          }
        } else {
          // Fallback for environments without matchMedia support
          setActualTheme('light');
        }
      } else {
        setActualTheme(theme);
      }
    };

    determineTheme();

    // Listen for system theme changes when in auto mode
    if (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', determineTheme);
        return () => mediaQuery.removeEventListener('change', determineTheme);
      } catch (error) {
        console.warn('Unable to add matchMedia listener:', error);
      }
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'auto';
      return 'light';
    });
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Header theme={actualTheme} onThemeToggle={toggleTheme} />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
