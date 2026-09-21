'use client';
import { StepsProps } from '@/types/Block';

export default function StepsBlock({ props: p }: { props: StepsProps }) {
  const isHorizontal = p.layout !== 'vertical';
  const accent = p.accentColor || '#7c3aed';

  return (
    <section style={{ padding: '72px 40px', background: '#fff' }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        {p.heading && (
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, color: '#111', marginBottom: 10 }}>{p.heading}</h2>
            {p.subheading && <p style={{ fontSize: 16, color: '#6b7280' }}>{p.subheading}</p>}
          </div>
        )}
        <div style={{
          display: isHorizontal ? 'grid' : 'flex',
          gridTemplateColumns: isHorizontal ? `repeat(${(p.items || []).length}, 1fr)` : undefined,
          flexDirection: isHorizontal ? undefined : 'column',
          gap: isHorizontal ? 0 : 24,
          position: 'relative',
        }}>
          {(p.items || []).map((step, idx) => (
            <div key={step.id} style={{
              display: 'flex',
              flexDirection: isHorizontal ? 'column' : 'row',
              alignItems: isHorizontal ? 'center' : 'flex-start',
              textAlign: isHorizontal ? 'center' : 'left',
              padding: isHorizontal ? '0 16px' : '0',
              gap: isHorizontal ? 16 : 20,
              position: 'relative',
            }}>
              {/* Connector line */}
              {isHorizontal && idx < (p.items?.length ?? 0) - 1 && (
                <div style={{
                  position: 'absolute',
                  top: 28,
                  left: '50%',
                  width: '100%',
                  height: 2,
                  background: `linear-gradient(to right, ${accent}, ${accent}44)`,
                }} />
              )}

              {/* Step number circle */}
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: accent, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 22, flexShrink: 0,
                boxShadow: `0 0 0 6px ${accent}22`,
                zIndex: 1,
              }}>
                {step.icon || idx + 1}
              </div>

              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 6 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, maxWidth: 240, margin: isHorizontal ? '0 auto' : 0 }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
