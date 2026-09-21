'use client';
import { CardsProps } from '@/types/Block';

export default function CardGridBlock({ props: p }: { props: CardsProps }) {
  const cols = p.columns || 3;

  return (
    <section style={{ padding: '64px 40px', background: '#fafafa' }}>
      {p.heading && (
        <h2
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 700,
            marginBottom: 40,
            color: '#111',
          }}
        >
          {p.heading}
        </h2>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 24,
          maxWidth: '100%',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {(p.items || []).map((item) => (
          <div
            key={item.id}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              padding: 28,
              transition: 'box-shadow 200ms ease, transform 200ms ease',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(124,58,237,0.15)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 6 }}>
              {item.title}
            </h3>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
