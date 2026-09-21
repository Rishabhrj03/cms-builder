'use client';
import { TestimonialsProps } from '@/types/Block';

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= count ? '#f59e0b' : '#d1d5db', fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

export default function TestimonialsBlock({ props: p }: { props: TestimonialsProps }) {
  const cols = p.columns || 3;
  return (
    <section style={{ padding: '72px 40px', background: '#f9fafb' }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        {p.heading && (
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, color: '#111', marginBottom: 10 }}>
              {p.heading}
            </h2>
            {p.subheading && <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 520, margin: '0 auto' }}>{p.subheading}</p>}
          </div>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: p.layout === 'list' ? '1fr' : `repeat(${cols}, 1fr)`,
          gap: 24,
        }}>
          {(p.items || []).map((item) => (
            <div key={item.id} style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
            }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(124,58,237,0.12)'; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; }}
            >
              <Stars count={item.rating} />
              <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, fontStyle: 'italic', flex: 1 }}>
                &ldquo;{item.quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid #f3f4f6', paddingTop: 14 }}>
                <div style={{ fontSize: 32, width: 44, height: 44, background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
