import { HeadingProps } from '@/types/Block';

export default function HeadingBlock({ props }: { props: HeadingProps }) {
  const Tag = props.tag || 'h2';
  const text = props.text || 'Heading Title';
  const subtitle = props.subtitle;
  const align = props.align || 'left';
  const textColor = props.textColor || '#111827';
  const fontSize = props.fontSize || '32px';
  const fontWeight = props.fontWeight || 'bold';

  const weightMap: Record<string, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  };

  return (
    <div style={{ textAlign: align, margin: '16px 0' }}>
      <Tag
        style={{
          fontSize,
          fontWeight: weightMap[fontWeight] || 700,
          color: textColor,
          margin: 0,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        {text}
      </Tag>
      {subtitle && (
        <p
          style={{
            marginTop: 8,
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: 1.5,
            margin: '8px 0 0',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
