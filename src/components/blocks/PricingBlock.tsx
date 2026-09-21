'use client';
import { PricingProps } from '@/types/Block';

export default function PricingBlock({ props: p }: { props: PricingProps }) {
  return (
    <section style={{ padding: '72px 40px', background: '#f9fafb' }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        {p.heading && (
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, color: '#111', marginBottom: 10 }}>{p.heading}</h2>
            {p.subheading && <p style={{ fontSize: 16, color: '#6b7280' }}>{p.subheading}</p>}
          </div>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(p.plans?.length || 3, 4)}, 1fr)`,
          gap: 24,
          alignItems: 'stretch',
        }}>
          {(p.plans || []).map((plan) => (
            <div key={plan.id} style={{
              background: plan.popular ? (plan.accentColor || '#7c3aed') : '#fff',
              color: plan.popular ? '#fff' : '#111',
              border: plan.popular ? 'none' : '1px solid #e5e7eb',
              borderRadius: 20,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              position: 'relative',
              boxShadow: plan.popular ? '0 20px 60px rgba(124,58,237,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
              transform: plan.popular ? 'scale(1.04)' : 'none',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
            }}
              onMouseOver={(e) => { if (!plan.popular) { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; } }}
              onMouseOut={(e) => { if (!plan.popular) { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'none'; } }}
            >
              {plan.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#111', padding: '4px 16px', borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: '0.06em' }}>
                  ⭐ MOST POPULAR
                </div>
              )}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: 14, opacity: 0.6 }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.5 }}>{plan.description}</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {(plan.features || []).map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, opacity: 0.9 }}>
                    <span style={{ color: plan.popular ? '#86efac' : '#10b981', fontWeight: 700, fontSize: 16 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={plan.ctaUrl || '#'} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '14px',
                  background: plan.popular ? 'rgba(255,255,255,0.2)' : (plan.accentColor || '#7c3aed'),
                  color: '#fff',
                  border: plan.popular ? '2px solid rgba(255,255,255,0.4)' : 'none',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 200ms ease',
                }}>
                  {plan.ctaLabel || 'Get Started'}
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
