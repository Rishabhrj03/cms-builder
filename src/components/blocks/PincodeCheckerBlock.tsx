'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { PincodeCheckerProps } from '@/types/Block';

export default function PincodeCheckerBlock({ props }: { props: PincodeCheckerProps }) {
  const { pincode, pincodeStatus, checkPincode } = useCart();
  const [inputPin, setInputPin] = useState(pincode || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkPincode(inputPin);
  };

  return (
    <div style={{ padding: '20px', background: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>
      <div
        style={{
          maxWidth: '500px',
          margin: '0 auto',
          background: '#f8f9fa',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e9ecef',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        }}
      >
        <label style={{ fontWeight: 800, fontSize: '15px', color: '#222', display: 'block', marginBottom: '8px' }}>
          📍 {props.title || 'Check Delivery Availability'}
        </label>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value)}
            placeholder={props.placeholder || 'Enter Pincode (e.g. 110001)'}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid #ccc',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#e21b5a',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Check
          </button>
        </form>

        {pincodeStatus.checked && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              background: pincodeStatus.isExpress ? '#dcfce7' : '#fef3c7',
              color: pincodeStatus.isExpress ? '#15803d' : '#b45309',
            }}
          >
            {pincodeStatus.message}
          </div>
        )}
      </div>
    </div>
  );
}
