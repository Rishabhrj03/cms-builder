import { TextProps } from '@/types/Block';

const sizeMap = { sm: '0.9rem', md: '1.05rem', lg: '1.25rem' };

export default function TextBlock({ props: p }: { props: TextProps }) {
  return (
    <section style={{ padding: '48px 40px', maxWidth: 840, margin: '0 auto' }}>
      <div
        style={{
          fontSize: sizeMap[p.fontSize] || '1.05rem',
          textAlign: p.align || 'left',
          lineHeight: 1.8,
          color: '#1a1a1a',
          whiteSpace: 'pre-wrap',
        }}
      >
        {p.content}
      </div>
    </section>
  );
}
