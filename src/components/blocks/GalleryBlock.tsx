'use client';
import { useState } from 'react';
import { GalleryProps } from '@/types/Block';

export default function GalleryBlock({ props: p }: { props: GalleryProps }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const gap = p.gap === 'tight' ? 8 : p.gap === 'loose' ? 20 : 12;
  const cols = p.columns || 3;

  return (
    <section style={{ padding: '48px 40px', background: '#fff' }}>
      {p.heading && (
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, color: '#111', marginBottom: 36 }}>
          {p.heading}
        </h2>
      )}
      <div style={{
        width: '100%', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
      }}>
        {(p.images || []).map((img) => (
          <div
            key={img.id}
            onClick={() => setLightbox(img.src)}
            style={{
              aspectRatio: '1',
              overflow: 'hidden',
              borderRadius: 12,
              cursor: 'zoom-in',
              position: 'relative',
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 300ms ease' }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'zoom-out',
          }}
        >
          <img src={lightbox} alt="Gallery" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8, objectFit: 'contain' }} />
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 24, width: 44, height: 44, borderRadius: '50%', cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </section>
  );
}
