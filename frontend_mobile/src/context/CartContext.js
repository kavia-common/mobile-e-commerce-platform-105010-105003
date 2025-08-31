import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// PUBLIC_INTERFACE
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, getAuthHeaders } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // PUBLIC_INTERFACE
  const syncCartWithServer = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ items }),
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.items || items);
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    } finally {
      setLoading(false);
    }
  }, [items, getAuthHeaders]);

  // Sync cart with server when user logs in
  useEffect(() => {
    if (user && items.length > 0) {
      syncCartWithServer();
    }
  }, [user, items.length, syncCartWithServer]);

  // PUBLIC_INTERFACE
  const addToCart = (product, quantity = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...currentItems, { ...product, quantity }];
      }
    });
  };

  // PUBLIC_INTERFACE
  const removeFromCart = (productId) => {
    setItems(currentItems => currentItems.filter(item => item.id !== productId));
  };

  // PUBLIC_INTERFACE
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // PUBLIC_INTERFACE
  const clearCart = () => {
    setItems([]);
  };

  // PUBLIC_INTERFACE
  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // PUBLIC_INTERFACE
  const getCartItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  // PUBLIC_INTERFACE
  const isInCart = (productId) => {
    return items.some(item => item.id === productId);
  };

  // PUBLIC_INTERFACE
  const getCartItem = (productId) => {
    return items.find(item => item.id === productId);
  };

  const value = {
    items,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getCartItem,
    syncCartWithServer,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
