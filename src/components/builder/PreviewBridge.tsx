'use client';

import { useEffect, useState, useRef } from 'react';
import { Block } from '@/types/Block';
import BlockRenderer from '@/components/blocks/BlockRenderer';

interface Props {
  initialBlocks: Block[];
}

export default function PreviewBridge({ initialBlocks }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isEditMode = useRef(false);

  useEffect(() => {
    // Detect if we are inside the builder iframe
    isEditMode.current = window.self !== window.top;
    if (!isEditMode.current) return;

    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      const { type, blocks: newBlocks, selectedBlockId } = e.data;

      if (type === 'BLOCKS_UPDATE' && Array.isArray(newBlocks)) {
        setBlocks(newBlocks);
      }
      if (type === 'SELECT_BLOCK') {
        setSelectedId(selectedBlockId ?? null);
      }
    };

    window.addEventListener('message', handleMessage);
    // Tell parent we are ready
    window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleBlockClick = (blockId: string) => {
    if (!isEditMode.current) return;
    setSelectedId(blockId);
    window.parent.postMessage({ type: 'BLOCK_SELECT', blockId }, '*');
  };

  const handleBlockReorder = (dir: 'up' | 'down', blockId: string) => {
    window.parent.postMessage({ type: 'BLOCK_REORDER', blockId, dir }, '*');
  };

  const handleBlockDelete = (blockId: string) => {
    window.parent.postMessage({ type: 'BLOCK_DELETE', blockId }, '*');
  };

  const handleAddBelow = (blockId: string) => {
    window.parent.postMessage({ type: 'BLOCK_ADD_BELOW', blockId }, '*');
  };

  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <>
      {sorted.map((block) => {
        const isSelected = block.id === selectedId;
        const isHovered = block.id === hoveredId;

        return (
          <div
            key={block.id}
            data-block-id={block.id}
            className={`pf-block-wrapper${isSelected ? ' pf-selected' : ''}`}
            style={{ position: 'relative' }}
            onClick={() => handleBlockClick(block.id)}
            onMouseEnter={() => setHoveredId(block.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <BlockRenderer block={block} />

            {/* Floating toolbar — shown on hover or select */}
            {isEditMode.current && (isHovered || isSelected) && (
              <div
                className="pf-block-toolbar"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="pf-block-label">
                  {getBlockLabel(block.type)}
                </span>
                <div className="pf-toolbar-actions">
                  <button
                    className="pf-toolbar-btn"
                    title="Move up"
                    onClick={() => handleBlockReorder('up', block.id)}
                  >↑</button>
                  <button
                    className="pf-toolbar-btn"
                    title="Move down"
                    onClick={() => handleBlockReorder('down', block.id)}
                  >↓</button>
                  <button
                    className="pf-toolbar-btn"
                    title="Add block below"
                    onClick={() => handleAddBelow(block.id)}
                  >＋</button>
                  <button
                    className="pf-toolbar-btn pf-toolbar-btn--danger"
                    title="Delete block"
                    onClick={() => handleBlockDelete(block.id)}
                  >✕</button>
                </div>
              </div>
            )}

            {/* Selected border glow */}
            {isEditMode.current && isSelected && (
              <div className="pf-selected-ring" />
            )}
          </div>
        );
      })}
    </>
  );
}

const BLOCK_LABELS: Record<string, string> = {
  hero: '🦸 Hero',
  text: '📝 Text',
  image: '🖼️ Image',
  cards: '🃏 Card Grid',
  button: '🔘 Button',
  divider: '➖ Divider',
  custom: '💻 Custom Code',
  navbar: '🧭 Navbar',
  'product-grid': '🛍️ Product Grid',
  'pincode-checker': '📍 Pincode Checker',
};

function getBlockLabel(type: string) {
  return BLOCK_LABELS[type] ?? type;
}
