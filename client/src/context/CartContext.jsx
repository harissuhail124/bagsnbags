import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bnb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState(null); // { code, discountType, discountValue }

  // Sync with localStorage for guest/offline persistence
  useEffect(() => {
    localStorage.setItem('bnb_cart', JSON.stringify(items));
  }, [items]);

  // When user signs in, merge guest cart with server cart
  useEffect(() => {
    if (user) {
      syncWithServerCart();
    }
  }, [user]);

  const syncWithServerCart = async () => {
    try {
      // Send current items to server to merge
      const res = await axios.post('/api/cart/sync', { items }, { withCredentials: true });
      if (res.data?.items) {
        setItems(res.data.items);
      }
    } catch (err) {
      // Fallback silently if offline or endpoint not yet loaded
    }
  };

  const addItem = (product, quantity = 1, selectedVariant = null) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product._id === product._id && i.variant === selectedVariant
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, quantity, variant: selectedVariant }];
      }
    });
    toast.success(`Added ${product.title} to bag.`);
    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId, variant, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, variant);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId && item.variant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (productId, variant) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product._id === productId && item.variant === variant)
      )
    );
    toast('Item removed from bag.', { icon: '•' });
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    localStorage.removeItem('bnb_cart');
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  let discountAmount = 0;
  if (promoCode) {
    if (promoCode.discountType === 'percentage') {
      discountAmount = (subtotal * promoCode.discountValue) / 100;
    } else if (promoCode.discountType === 'fixed') {
      discountAmount = Math.min(subtotal, promoCode.discountValue);
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  // Free shipping over $150
  const shippingFee = subtotalAfterDiscount >= 150 || items.length === 0 ? 0 : 15;
  const grandTotal = subtotalAfterDiscount + shippingFee;
  const totalItemCount = items.reduce((count, i) => count + i.quantity, 0);

  const applyPromo = async (codeStr) => {
    try {
      const res = await axios.post('/api/promo-codes/validate', { code: codeStr });
      setPromoCode(res.data.promo);
      toast.success(`Promo code ${res.data.promo.code} applied.`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Invalid or expired promo code.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const removePromo = () => {
    setPromoCode(null);
    toast('Promo code removed.', { icon: '•' });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        promoCode,
        applyPromo,
        removePromo,
        discountAmount,
        shippingFee,
        grandTotal,
        totalItemCount,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
