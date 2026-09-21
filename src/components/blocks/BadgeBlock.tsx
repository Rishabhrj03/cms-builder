import { BadgeProps } from '@/types/Block';

export default function BadgeBlock({ props }: { props: BadgeProps }) {
  const text = props.text || 'BADGE';
  const variant = props.variant || 'soft';
  const icon = props.icon;
  const bgColor = props.bgColor || '#7c3aed';
  const textColor = props.textColor || '#7c3aed';
  const align = props.align || 'center';
  const size = props.size || 'md';

  const sizeMap = {
    sm: { padding: '3px 10px', fontSize: 11 },
    md: { padding: '5px 14px', fontSize: 13 },
    lg: { padding: '8px 18px', fontSize: 15 },
  };

  const s = sizeMap[size] || sizeMap.md;

  let styleProps: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: s.padding,
    fontSize: s.fontSize,
    transition: 'all 150ms ease',
  };

  if (variant === 'filled') {
    styleProps = {
      ...styleProps,
      backgroundColor: bgColor,
      color: '#ffffff',
    };
  } else if (variant === 'outline') {
    styleProps = {
      ...styleProps,
      backgroundColor: 'transparent',
      border: `1.5px solid ${bgColor}`,
      color: textColor,
    };
  } else {
    // soft
    styleProps = {
      ...styleProps,
      backgroundColor: `${bgColor}18`, // 10% opacity hex tint
      color: textColor,
      border: `1px solid ${bgColor}30`,
    };
  }

  return (
    <div style={{ textAlign: align, margin: '8px 0' }}>
      <span style={styleProps}>
        {icon && <span>{icon}</span>}
        {text}
      </span>
    </div>
  );
}
