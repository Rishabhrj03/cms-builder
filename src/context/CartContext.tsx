'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  weight: string;
  qty: number;
}

export interface PincodeStatus {
  checked: boolean;
  isExpress: boolean;
  message: string;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  pincode: string;
  pincodeStatus: PincodeStatus;
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  checkPincode: (pin: string) => void;
  subtotal: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PageForge?: any;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pincode, setPincode] = useState('110001');
  const [pincodeStatus, setPincodeStatus] = useState<PincodeStatus>({
    checked: true,
    isExpress: true,
    message: '⚡ Express 2-Hour Delivery Available in Delhi NCR',
  });

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pageforge_bakingo_cart');
      if (saved) setItems(JSON.parse(saved));

      const savedPin = localStorage.getItem('pageforge_bakingo_pin');
      if (savedPin) setPincode(savedPin);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pageforge_bakingo_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id && i.weight === newItem.weight);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id && i.weight === newItem.weight ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...newItem, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const clearCart = () => setItems([]);
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const checkPincode = (pin: string) => {
    setPincode(pin);
    localStorage.setItem('pageforge_bakingo_pin', pin);
    if (!/^\d{6}$/.test(pin)) {
      setPincodeStatus({
        checked: true,
        isExpress: false,
        message: '❌ Please enter a valid 6-digit Pincode',
      });
      return;
    }
    if (pin.startsWith('11') || pin.startsWith('20') || pin.startsWith('56') || pin.startsWith('40')) {
      setPincodeStatus({
        checked: true,
        isExpress: true,
        message: `⚡ Express 2-Hour Delivery Available for Pincode ${pin}!`,
      });
    } else {
      setPincodeStatus({
        checked: true,
        isExpress: false,
        message: `📦 Standard Next-Day Delivery Available for Pincode ${pin}.`,
      });
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalCount = items.reduce((acc, item) => acc + item.qty, 0);

  // Expose window.PageForge JavaScript plugin bridge
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.PageForge = {
        addToCart: (item: Omit<CartItem, 'qty'>) => addItem(item),
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        checkPincode: (pin: string) => checkPincode(pin),
        getCart: () => items,
      };
    }
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        pincode,
        pincodeStatus,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        checkPincode,
        subtotal,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
