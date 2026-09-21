'use client';
import { VideoProps } from '@/types/Block';

function getEmbedUrl(url: string, autoplay: boolean, muted: boolean): string | null {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const vid = u.hostname.includes('youtu.be')
        ? u.pathname.slice(1)
        : u.searchParams.get('v') || u.pathname.split('/').pop();
      if (!vid) return null;
      const params = new URLSearchParams({ rel: '0' });
      if (autoplay) params.set('autoplay', '1');
      if (muted) params.set('mute', '1');
      return `https://www.youtube.com/embed/${vid}?${params}`;
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const vid = u.pathname.split('/').pop();
      if (!vid) return null;
      const params = new URLSearchParams();
      if (autoplay) params.set('autoplay', '1');
      if (muted) params.set('muted', '1');
      return `https://player.vimeo.com/video/${vid}?${params}`;
    }
    return null;
  } catch { return null; }
}

const RATIO_MAP: Record<string, string> = { '16:9': '56.25%', '4:3': '75%', '1:1': '100%' };

export default function VideoBlock({ props: p }: { props: VideoProps }) {
  const embedUrl = getEmbedUrl(p.url || '', p.autoplay, p.muted);
  const paddingTop = RATIO_MAP[p.aspectRatio] || '56.25%';

  return (
    <section style={{ padding: '48px 40px', background: '#111', textAlign: 'center' }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        {embedUrl ? (
          <div style={{ position: 'relative', paddingTop, borderRadius: 16, overflow: 'hidden', background: '#000', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <iframe
              src={embedUrl}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="Embedded video"
            />
          </div>
        ) : (
          <div style={{
            paddingTop,
            position: 'relative',
            background: '#1a1a1a',
            borderRadius: 16,
            border: '2px dashed #333',
          }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666', gap: 12 }}>
              <span style={{ fontSize: 40 }}>🎬</span>
              <span style={{ fontSize: 14 }}>Paste a YouTube or Vimeo URL to embed a video</span>
            </div>
          </div>
        )}
        {p.caption && (
          <p style={{ fontSize: 14, color: '#9ca3af', marginTop: 16, lineHeight: 1.5 }}>{p.caption}</p>
        )}
      </div>
    </section>
  );
}
