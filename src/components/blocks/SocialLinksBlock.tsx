'use client';
import { SocialLinksProps } from '@/types/Block';

const PLATFORM_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  instagram: { icon: '📸', color: '#e1306c', label: 'Instagram' },
  facebook: { icon: '👤', color: '#1877f2', label: 'Facebook' },
  twitter: { icon: '🐦', color: '#1da1f2', label: 'Twitter / X' },
  youtube: { icon: '▶️', color: '#ff0000', label: 'YouTube' },
  whatsapp: { icon: '💬', color: '#25d366', label: 'WhatsApp' },
  linkedin: { icon: '💼', color: '#0077b5', label: 'LinkedIn' },
  tiktok: { icon: '🎵', color: '#010101', label: 'TikTok' },
  pinterest: { icon: '📌', color: '#e60023', label: 'Pinterest' },
};

const SIZE_MAP: Record<string, number> = { sm: 40, md: 52, lg: 64 };

export default function SocialLinksBlock({ props: p }: { props: SocialLinksProps }) {
  const alignMap: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };
  const size = SIZE_MAP[p.iconSize || 'md'];

  return (
    <section style={{ padding: '48px 40px', background: '#fff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: p.align || 'center' }}>
        {p.heading && (
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 24 }}>{p.heading}</h2>
        )}
        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: alignMap[p.align || 'center'],
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {(p.links || []).map((link) => {
            const cfg = PLATFORM_CONFIG[link.platform] || { icon: '🔗', color: '#6b7280', label: link.platform };
            return (
              <a
                key={link.id}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label || cfg.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  width: p.style === 'icon-only' ? size : 'auto',
                  height: p.style === 'icon-only' ? size : 'auto',
                  padding: p.style === 'icon-only' ? 0 : '10px 20px',
                  background: cfg.color,
                  color: '#fff',
                  borderRadius: p.style === 'icon-only' ? '50%' : 10,
                  textDecoration: 'none',
                  fontSize: p.style === 'icon-only' ? size * 0.45 : 15,
                  fontWeight: 700,
                  justifyContent: 'center',
                  transition: 'transform 200ms ease, opacity 200ms ease',
                  boxShadow: `0 4px 12px ${cfg.color}44`,
                }}
                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.05)'; }}
                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              >
                {cfg.icon}
                {p.style === 'icon-label' && <span>{link.label || cfg.label}</span>}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
