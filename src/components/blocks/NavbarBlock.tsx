'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { NavbarProps } from '@/types/Block';

export default function NavbarBlock({ props }: { props: NavbarProps }) {
  const { totalCount, toggleCart, pincode } = useCart();

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Announcement Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #e21b5a, #ff4081)',
          color: 'white',
          textAlign: 'center',
          padding: '8px 16px',
          fontWeight: 600,
          fontSize: '13px',
          letterSpacing: '0.5px',
        }}
      >
        🎉 <strong>{props.promoText || 'SPECIAL OFFER: Get FLAT 15% OFF'}</strong> | Use Code:{' '}
        <strong>{props.promoCode || 'WELCOME15'}</strong> | ⚡ Express 2-Hour Delivery
      </div>

      {/* Main Navbar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 40px',
          background: '#ffffff',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          flexWrap: 'wrap',
          gap: '15px',
        }}
      >
        {/* Brand & Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/site/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px' }}>{props.logoIcon || '🎂'}</span>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#e21b5a', letterSpacing: '-0.5px' }}>
              {props.brandName || 'bakingo'}
            </span>
          </Link>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f8f9fa',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              color: '#333',
              border: '1px solid #e9ecef',
            }}
          >
            <span style={{ marginRight: '6px', color: '#e21b5a' }}>📍</span> Deliver to:{' '}
            <strong style={{ marginLeft: '4px' }}>{pincode ? `Pin ${pincode}` : 'Delhi NCR'}</strong>
          </div>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: '450px', margin: '0 20px', minWidth: '250px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search for chocolate cake, cupcakes, photo cakes..."
              style={{
                width: '100%',
                padding: '10px 40px 10px 16px',
                borderRadius: '24px',
                border: '1.5px solid #e0e0e0',
                fontSize: '14px',
                outline: 'none',
                background: '#fafafa',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#888' }}>
              🔍
            </span>
          </div>
        </div>

        {/* Actions */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', fontWeight: 600 }}>
          <Link href="/site/cakes" style={{ color: '#333', textDecoration: 'none' }}>
            Cakes
          </Link>
          <Link href="/site/cakes" style={{ color: '#333', textDecoration: 'none' }}>
            Gourmet
          </Link>
          <Link href="/site/track-order" style={{ color: '#e21b5a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            🚚 Track Order
          </Link>
          <button
            onClick={toggleCart}
            style={{
              background: '#e21b5a',
              color: 'white',
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(226,27,90,0.25)',
            }}
          >
            🛒 Cart ({totalCount})
          </button>
        </nav>
      </header>
    </div>
  );
}
