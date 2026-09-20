import { ImageProps } from '@/types/Block';

const widthMap = { full: '100%', half: '50%', quarter: '25%' };

export default function ImageBlock({ props: p }: { props: ImageProps }) {
  return (
    <section style={{ padding: '32px 40px', textAlign: 'center' }}>
      {p.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.src}
          alt={p.alt || ''}
          style={{
            width: widthMap[p.width] || '100%',
            maxWidth: '100%',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            margin: '0 auto',
            display: 'block',
          }}
        />
      ) : (
        <div
          style={{
            width: widthMap[p.width] || '100%',
            maxWidth: '100%',
            height: 240,
            background: '#f3f4f6',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: 40,
            margin: '0 auto',
          }}
        >
          🖼️
        </div>
      )}
      {p.caption && (
        <p style={{ marginTop: 12, fontSize: 13, color: '#6b7280', fontStyle: 'italic' }}>
          {p.caption}
        </p>
      )}
    </section>
  );
}
