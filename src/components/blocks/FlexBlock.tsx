import { FlexProps } from '@/types/Block';

export default function FlexBlock({ props }: { props: FlexProps }) {
  const direction = props.direction || 'row';
  const wrap = props.wrap || 'wrap';
  const justifyContent = props.justifyContent || 'center';
  const alignItems = props.alignItems || 'center';
  const gap = props.gap || '16px';
  const padding = props.padding || '24px';
  const bgColor = props.bgColor || '#ffffff';
  const borderColor = props.borderColor || '#e2e8f0';
  const borderRadius = props.borderRadius || '12px';
  const items = props.items || [];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        flexWrap: wrap,
        justifyContent,
        alignItems,
        gap,
        padding,
        backgroundColor: bgColor,
        border: borderColor && borderColor !== 'transparent' ? `1px solid ${borderColor}` : undefined,
        borderRadius,
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            flex: '1 1 240px',
            minWidth: '220px',
            padding: '16px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {item.icon && <span style={{ fontSize: 24 }}>{item.icon}</span>}
            {item.badge && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 999,
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {item.badge}
              </span>
            )}
          </div>
          {item.title && <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827' }}>{item.title}</h4>}
          {item.content && <p style={{ margin: 0, fontSize: 14, color: '#4b5563', lineHeight: 1.4 }}>{item.content}</p>}
          {item.linkUrl && item.linkUrl !== '#' && (
            <a
              href={item.linkUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 13,
                fontWeight: 600,
                color: '#7c3aed',
                textDecoration: 'none',
                marginTop: 'auto',
              }}
            >
              Learn more &rarr;
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
