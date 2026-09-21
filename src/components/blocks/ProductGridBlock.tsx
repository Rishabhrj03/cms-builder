'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ProductGridProps, ProductItem } from '@/types/Block';

function ProductCard({ product }: { product: ProductItem }) {
  const { addItem } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<'0.5 kg' | '1.0 kg' | '2.0 kg'>('0.5 kg');

  const weightMultipliers = {
    '0.5 kg': 1,
    '1.0 kg': 1.8,
    '2.0 kg': 3.4,
  };

  const finalPrice = Math.round(product.price * weightMultipliers[selectedWeight]);
  const finalOriginal = Math.round(product.originalPrice * weightMultipliers[selectedWeight]);

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #eee',
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Discount Badge */}
      {product.discount && (
        <span
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#e21b5a',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            zIndex: 2,
          }}
        >
          {product.discount}
        </span>
      )}

      {/* Image */}
      <div style={{ overflow: 'hidden', height: '200px' }}>
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Rating & Veg Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ background: '#22c55e', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
            ★ {product.rating} ({product.reviewCount})
          </span>
          <span style={{ color: '#15803d', fontSize: '12px', fontWeight: 600 }}>
            🌿 {product.eggless ? '100% Eggless' : 'Eggless Available'}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#222', margin: '4px 0 8px', lineHeight: 1.3 }}>
          <Link href="/site/fresh-fruit-cake" style={{ textDecoration: 'none', color: 'inherit' }}>
            {product.title}
          </Link>
        </h3>

        {/* Weight Selector */}
        <div style={{ margin: '8px 0 12px', display: 'flex', gap: '6px' }}>
          {(['0.5 kg', '1.0 kg', '2.0 kg'] as const).map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '6px',
                border: selectedWeight === w ? '1.5px solid #e21b5a' : '1px solid #ddd',
                background: selectedWeight === w ? '#fff0f3' : 'white',
                color: selectedWeight === w ? '#e21b5a' : '#555',
                cursor: 'pointer',
              }}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Pricing */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px', marginTop: 'auto' }}>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#e21b5a' }}>₹{finalPrice}</span>
          <span style={{ fontSize: '14px', color: '#888', textDecoration: 'line-through' }}>₹{finalOriginal}</span>
          <span style={{ fontSize: '12px', color: '#666' }}>({selectedWeight})</span>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={() =>
            addItem({
              id: product.id,
              title: product.title,
              price: finalPrice,
              image: product.image,
              weight: selectedWeight,
            })
          }
          style={{
            width: '100%',
            textAlign: 'center',
            background: '#e21b5a',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(226,27,90,0.2)',
          }}
        >
          🛒 Add to Cart - ₹{finalPrice}
        </button>
      </div>
    </div>
  );
}

export default function ProductGridBlock({ props }: { props: ProductGridProps }) {
  return (
    <div style={{ padding: '50px 20px', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
          <div>
            <span style={{ background: '#ffe0e6', color: '#e21b5a', padding: '4px 12px', borderRadius: '12px', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>
              {props.subheading || 'Most Loved'}
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111', marginTop: '6px' }}>
              {props.heading || 'Bestselling Cakes'}
            </h2>
          </div>
          <Link href="/site/cakes" style={{ color: '#e21b5a', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}>
            View All Cakes →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {(props.products ?? []).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
