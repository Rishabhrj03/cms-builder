'use client';
import { useState } from 'react';
import { NewsletterProps } from '@/types/Block';

export default function NewsletterBlock({ props: p }: { props: NewsletterProps }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    setError('');
    setSubmitted(true);
  };

  return (
    <section style={{
      background: p.bgColor || '#7c3aed',
      color: p.textColor || '#fff',
      padding: '72px 40px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {p.heading && (
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, marginBottom: 12 }}>{p.heading}</h2>
        )}
        {p.subheading && (
          <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 36, lineHeight: 1.6 }}>{p.subheading}</p>
        )}
        {submitted ? (
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 14,
            padding: '24px 32px',
            fontSize: 17,
            fontWeight: 600,
          }}>
            🎉 You're subscribed! Check your inbox for a welcome gift.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={p.placeholder || 'Enter your email address'}
              style={{
                flex: '1 1 240px',
                maxWidth: 320,
                padding: '14px 18px',
                borderRadius: 10,
                border: 'none',
                fontSize: 15,
                outline: 'none',
                color: '#111',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: 10,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 200ms ease',
                whiteSpace: 'nowrap',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            >
              {p.buttonLabel || 'Subscribe'}
            </button>
            {error && <div style={{ width: '100%', fontSize: 13, color: '#fecaca', marginTop: 4 }}>{error}</div>}
          </form>
        )}
        <p style={{ fontSize: 12, opacity: 0.5, marginTop: 18 }}>No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
