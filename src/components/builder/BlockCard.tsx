'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, BlockType } from '@/types/Block';

const TYPE_LABELS: Record<BlockType, string> = {
  hero: '🦸 Hero',
  text: '📝 Text',
  image: '🖼️ Image',
  cards: '🃏 Card Grid',
  button: '🔘 Button',
  divider: '➖ Divider',
  custom: '💻 Custom Code',
};

interface Props {
  block: Block;
  selected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

function BlockPreview({ block }: { block: Block }) {
  const p = block.props;
  switch (block.type) {
    case 'hero':
      return (
        <div style={{ padding: '10px 12px', background: p.bgColor || '#1a1a2e', borderRadius: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: p.textColor || '#fff', marginBottom: 3 }}>
            {p.title || 'Hero Title'}
          </div>
          <div style={{ fontSize: 11, color: p.textColor || '#fff', opacity: 0.7 }}>
            {p.subtitle || 'Subtitle text'}
          </div>
        </div>
      );
    case 'text':
      return (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {String(p.content || '').slice(0, 80)}{String(p.content || '').length > 80 ? '…' : ''}
        </div>
      );
    case 'image':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ fontSize: 20 }}>🖼️</span>
          <span>{p.alt || 'Image'} {p.caption ? `— ${p.caption}` : ''}</span>
        </div>
      );
    case 'cards':
      return (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 600 }}>{p.heading || 'Card Grid'}</span>
          <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>
            {(p.items as unknown[])?.length ?? 0} cards · {p.columns} cols
          </span>
        </div>
      );
    case 'button':
      return (
        <div>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {p.label || 'Button'}
          </span>
        </div>
      );
    case 'divider':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: p.color || 'var(--border)' }} />
          {p.label && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.label}</span>}
          {p.label && <div style={{ flex: 1, height: 1, background: p.color || 'var(--border)' }} />}
        </div>
      );
  }
}

export default function BlockCard({ block, selected, onClick, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`block-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="block-card-header">
        <span
          className="block-drag-handle"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder"
        >
          ⠿
        </span>
        <span className="block-type-label">{TYPE_LABELS[block.type]}</span>
        <div className="block-actions">
          <button
            className="btn btn-ghost btn-icon"
            style={{ fontSize: 13 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete block"
          >
            🗑
          </button>
        </div>
      </div>
      <div className="block-preview">
        <BlockPreview block={block} />
      </div>
    </div>
  );
}
