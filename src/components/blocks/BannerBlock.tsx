'use client';
import { useState } from 'react';
import { BannerProps } from '@/types/Block';

export default function BannerBlock({ props: p }: { props: BannerProps }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div style={{
      background: p.bgColor || '#7c3aed',
      color: p.textColor || '#fff',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.4,
      position: 'relative',
    }}>
      {p.icon && <span style={{ fontSize: 18 }}>{p.icon}</span>}
      <span style={{ textAlign: 'center' }}>{p.text}</span>
      {p.linkLabel && p.linkUrl && (
        <a
          href={p.linkUrl}
          style={{
            color: 'inherit',
            fontWeight: 700,
            textDecoration: 'underline',
            whiteSpace: 'nowrap',
          }}
        >
          {p.linkLabel} →
        </a>
      )}
      {p.dismissible && (
        <button
          onClick={() => setDismissed(true)}
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: 'inherit',
            width: 28,
            height: 28,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
