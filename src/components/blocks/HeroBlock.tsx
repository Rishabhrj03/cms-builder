'use client';
import { HeroProps } from '@/types/Block';

export default function HeroBlock({ props: p }: { props: HeroProps }) {
  const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' };

  return (
    <section
      style={{
        background: p.bgColor || '#1a1a2e',
        color: p.textColor || '#ffffff',
        padding: '80px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignMap[p.align] || 'center',
        textAlign: p.align || 'center',
      }}
    >
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16, maxWidth: 720 }}>
        {p.title}
      </h1>
      {p.subtitle && (
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', opacity: 0.8, maxWidth: 560, marginBottom: 32 }}>
          {p.subtitle}
        </p>
      )}
      {p.ctaLabel && (
        <a href={p.ctaUrl || '#'}>
          <button
            style={{
              background: '#7c3aed',
              color: '#fff',
              border: 'none',
              padding: '14px 32px',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 150ms ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {p.ctaLabel}
          </button>
        </a>
      )}
    </section>
  );
}
