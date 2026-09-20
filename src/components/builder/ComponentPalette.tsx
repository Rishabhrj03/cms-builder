'use client';

import { BlockType } from '@/types/Block';

interface PaletteItem {
  type: BlockType;
  icon: string;
  label: string;
  description: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  { type: 'hero', icon: '🦸', label: 'Hero', description: 'Full-width hero section' },
  { type: 'text', icon: '📝', label: 'Text', description: 'Rich text block' },
  { type: 'image', icon: '🖼️', label: 'Image', description: 'Image with caption' },
  { type: 'cards', icon: '🃏', label: 'Card Grid', description: 'Grid of feature cards' },
  { type: 'button', icon: '🔘', label: 'Button', description: 'CTA button' },
  { type: 'divider', icon: '➖', label: 'Divider', description: 'Section separator' },
  { type: 'custom', icon: '💻', label: 'Custom Code', description: 'HTML/CSS/JS block' },
];

interface Props {
  onAdd: (type: BlockType) => void;
}

export default function ComponentPalette({ onAdd }: Props) {
  return (
    <div className="builder-palette">
      <div className="palette-title">Components</div>
      {PALETTE_ITEMS.map((item) => (
        <button
          key={item.type}
          className="palette-item"
          onClick={() => onAdd(item.type)}
          title={item.description}
        >
          <span className="palette-item-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}

      <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        <div className="palette-title" style={{ marginBottom: 8 }}>Pro Tip</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, padding: '0 6px' }}>
          Click any block to add it to your canvas. Drag blocks to reorder them.
        </div>
      </div>
    </div>
  );
}
