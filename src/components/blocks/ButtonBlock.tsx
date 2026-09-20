'use client';
import { ButtonProps } from '@/types/Block';

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { background: '#7c3aed', color: '#fff', border: 'none' },
  secondary: { background: '#f3f4f6', color: '#111', border: '1px solid #e5e7eb' },
  outline: { background: 'transparent', color: '#7c3aed', border: '2px solid #7c3aed' },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '8px 20px', fontSize: 13 },
  md: { padding: '12px 28px', fontSize: 15 },
  lg: { padding: '16px 36px', fontSize: 18 },
};

const alignMap: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };

export default function ButtonBlock({ props: p }: { props: ButtonProps }) {
  return (
    <section style={{ padding: '32px 40px', display: 'flex', justifyContent: alignMap[p.align] || 'center' }}>
      <a href={p.url || '#'}>
        <button
          style={{
            ...variantStyles[p.variant] || variantStyles.primary,
            ...sizeStyles[p.size] || sizeStyles.md,
            borderRadius: 10,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 150ms ease',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '1';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          {p.label || 'Click Me'}
        </button>
      </a>
    </section>
  );
}
