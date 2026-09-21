'use client';
import { RichHtmlProps } from '@/types/Block';

const PADDING_MAP: Record<string, string> = {
  none: '0',
  sm: '16px 24px',
  md: '32px 40px',
  lg: '56px 40px',
};

export default function RichHtmlBlock({ props: p }: { props: RichHtmlProps }) {
  return (
    <div
      style={{ padding: PADDING_MAP[p.padding || 'md'] }}
      dangerouslySetInnerHTML={{ __html: p.html || '' }}
    />
  );
}
