'use client';

import { useState } from 'react';
import { AlertProps } from '@/types/Block';

export default function AlertBlock({ props }: { props: AlertProps }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const variant = props.variant || 'info';
  const title = props.title || 'Notice';
  const message = props.message || 'Alert message content goes here.';
  const icon = props.icon || (variant === 'info' ? 'ℹ️' : variant === 'success' ? '✅' : variant === 'warning' ? '⚠️' : '🚨');
  const dismissible = props.dismissible ?? true;

  const themeMap = {
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', iconColor: '#3b82f6' },
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', iconColor: '#22c55e' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', iconColor: '#f59e0b' },
    error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', iconColor: '#ef4444' },
  };

  const theme = themeMap[variant] || themeMap.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '16px 20px',
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        color: theme.text,
        boxSizing: 'border-box',
        margin: '12px 0',
        position: 'relative',
      }}
    >
      <div style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        {title && <h5 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: theme.text }}>{title}</h5>}
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, opacity: 0.9 }}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            color: theme.text,
            opacity: 0.6,
            padding: 2,
            lineHeight: 1,
          }}
          title="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
