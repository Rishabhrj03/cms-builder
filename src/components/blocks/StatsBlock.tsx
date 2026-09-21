'use client';
import { StatsProps } from '@/types/Block';

export default function StatsBlock({ props: p }: { props: StatsProps }) {
  const cols = p.columns || 4;

  return (
    <section style={{
      background: p.bgColor || '#f8fafc',
      color: p.textColor || '#111',
      padding: '72px 40px',
    }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        {p.heading && (
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, marginBottom: 10 }}>{p.heading}</h2>
            {p.subheading && <p style={{ fontSize: 16, opacity: 0.6 }}>{p.subheading}</p>}
          </div>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 24,
        }}>
          {(p.items || []).map((stat) => (
            <div key={stat.id} style={{
              textAlign: 'center',
              padding: '32px 20px',
              background: 'rgba(255,255,255,0.6)',
              borderRadius: 16,
              border: '1px solid rgba(0,0,0,0.06)',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
            }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              {stat.icon && (
                <div style={{ fontSize: 36, marginBottom: 12 }}>{stat.icon}</div>
              )}
              <div style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: p.accentColor || '#7c3aed', lineHeight: 1, marginBottom: 6 }}>
                {stat.value}<span style={{ fontSize: '0.55em', fontWeight: 700 }}>{stat.suffix}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.7 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
