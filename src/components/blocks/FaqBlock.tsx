'use client';
import { useState } from 'react';
import { FaqProps } from '@/types/Block';

export default function FaqBlock({ props: p }: { props: FaqProps }) {
  const [open, setOpen] = useState<string | null>(null);
  const accent = p.accentColor || '#7c3aed';

  return (
    <section style={{ padding: '72px 40px', background: '#fff' }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        {p.heading && (
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, color: '#111', marginBottom: 10 }}>
              {p.heading}
            </h2>
            {p.subheading && <p style={{ fontSize: 16, color: '#6b7280' }}>{p.subheading}</p>}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(p.items || []).map((item) => {
            const isOpen = open === item.id;
            return (
              <div key={item.id} style={{
                border: `1px solid ${isOpen ? accent : '#e5e7eb'}`,
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'border-color 200ms ease',
                boxShadow: isOpen ? `0 0 0 3px ${accent}22` : 'none',
              }}>
                <button
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '18px 22px',
                    background: isOpen ? `${accent}08` : '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    transition: 'background 200ms ease',
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: isOpen ? accent : '#111', lineHeight: 1.4 }}>
                    {item.question}
                  </span>
                  <span style={{
                    fontSize: 20, color: accent, flexShrink: 0,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 250ms ease',
                    display: 'inline-block',
                  }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 22px 20px', background: `${accent}08` }}>
                    <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
