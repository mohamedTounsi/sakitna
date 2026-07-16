"use client";

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { calculateProductPrice } from '@/lib/currency';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItemsState, setCartItemsState] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sakitna_cart');
    if (savedCart) {
      try {
        setCartItemsState(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart items from local storage:", error);
      }
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('sakitna_cart', JSON.stringify(cartItemsState));
  }, [cartItemsState]);

  // Compute prices dynamically based on product total quantities (across all sizes)
  const cartItems = useMemo(() => {
    const productTotals = {};
    cartItemsState.forEach(item => {
      const id = item.product._id;
      if (!productTotals[id]) productTotals[id] = 0;
      productTotals[id] += item.quantity;
    });

    return cartItemsState.map(item => {
      const id = item.product._id;
      const totalQuantity = productTotals[id];
      const totalPriceForGroup = calculateProductPrice(item.product, totalQuantity);
      const unitPrice = totalPriceForGroup / totalQuantity;
      return {
        ...item,
        price: unitPrice * item.quantity
      };
    });
  }, [cartItemsState]);

  const addToCart = (product, quantity, size) => {
    setCartItemsState(prev => {
      // Group by both product._id and size
      const existingIdx = prev.findIndex(item => item.product._id === product._id && item.size === size);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, size }];
    });
  };

  const removeFromCart = (index) => {
    setCartItemsState(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItemsState([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
