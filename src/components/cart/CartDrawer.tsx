'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQty, removeItem, subtotal, totalCount, clearCart } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={closeCart}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 25px rgba(0,0,0,0.15)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff0f3',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>🛒</span>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#e21b5a' }}>
              Your Bakingo Cart ({totalCount})
            </h3>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#888',
            }}
          >
            ✕
          </button>
        </div>

        {/* Free Shipping / Promo Bar */}
        <div
          style={{
            background: '#22c55e',
            color: 'white',
            textAlign: 'center',
            padding: '8px',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          🎉 Free 2-Hour Express Delivery Unlocked!
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎂</div>
              <h4 style={{ margin: '0 0 6px', color: '#333' }}>Your Cart is Empty</h4>
              <p style={{ fontSize: '13px', margin: 0 }}>Add some freshly baked cakes & treats!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.weight}`}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #eee',
                    background: '#fafafa',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0 0 4px',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#222',
                        }}
                      >
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        🗑
                      </button>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                      Weight: <strong>{item.weight}</strong>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          background: 'white',
                        }}
                      >
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          style={{
                            border: 'none',
                            background: 'none',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            fontWeight: 700,
                          }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '13px', fontWeight: 700 }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          style={{
                            border: 'none',
                            background: 'none',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            fontWeight: 700,
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#e21b5a' }}>
                        ₹{item.price * item.qty}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid #eee', background: '#ffffff' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: 800,
                marginBottom: '14px',
              }}
            >
              <span>Subtotal:</span>
              <span style={{ color: '#e21b5a' }}>₹{subtotal}</span>
            </div>

            <button
              onClick={() => alert(`🎉 Processing Checkout for ₹${subtotal}!`)}
              style={{
                width: '100%',
                background: '#e21b5a',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(226, 27, 90, 0.3)',
              }}
            >
              PROCEED TO CHECKOUT →
            </button>

            <button
              onClick={clearCart}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: '12px',
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
