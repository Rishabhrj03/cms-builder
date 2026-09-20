import { DividerProps } from '@/types/Block';

export default function DividerBlock({ props: p }: { props: DividerProps }) {
  const lineStyle: React.CSSProperties = {
    flex: 1,
    height: 1,
    borderTop: `1px ${p.style || 'solid'} ${p.color || '#e5e7eb'}`,
  };

  return (
    <section style={{ padding: '20px 40px' }}>
      {p.label ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={lineStyle} />
          <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {p.label}
          </span>
          <div style={lineStyle} />
        </div>
      ) : (
        <div style={lineStyle} />
      )}
    </section>
  );
}
