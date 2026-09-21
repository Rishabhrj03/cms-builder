'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Block, BlockType, defaultProps } from '@/types/Block';
import { v4 as uuidv4 } from 'uuid';

type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

interface Props {
  slug: string;
  blocks: Block[];
  selectedId: string | null;
  device: Device;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (blocks: Block[]) => void;
  onAddBelow: (afterId: string, type?: BlockType) => void;
}

export default function BuilderCanvas({
  slug,
  blocks,
  selectedId,
  device,
  onSelect,
  onDelete,
  onReorder,
  onAddBelow,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  // Push block data into iframe whenever blocks change
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const send = () => {
      iframe.contentWindow?.postMessage(
        { type: 'BLOCKS_UPDATE', blocks },
        '*'
      );
    };

    // If already loaded, send immediately
    if (iframe.contentDocument?.readyState === 'complete') {
      send();
    }

    iframe.addEventListener('load', send);
    return () => iframe.removeEventListener('load', send);
  }, [blocks]);

  // Push selected block to iframe for highlight
  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'SELECT_BLOCK', selectedBlockId: selectedId },
      '*'
    );
  }, [selectedId]);

  // Listen for messages from iframe
  const handleMessage = useCallback(
    (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      const { type, blockId, dir } = e.data;

      if (type === 'BLOCK_SELECT' && blockId) {
        onSelect(blockId);
      }

      if (type === 'BLOCK_DELETE' && blockId) {
        onDelete(blockId);
      }

      if (type === 'BLOCK_REORDER' && blockId && dir) {
        const curr = blocksRef.current;
        const idx = curr.findIndex((b) => b.id === blockId);
        if (idx === -1) return;
        const newIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= curr.length) return;
        const reordered = [...curr];
        [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
        onReorder(reordered.map((b, i) => ({ ...b, order: i })));
      }

      if (type === 'BLOCK_ADD_BELOW' && blockId) {
        onAddBelow(blockId);
      }

      if (type === 'PREVIEW_READY') {
        // iframe just loaded — push current blocks
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'BLOCKS_UPDATE', blocks: blocksRef.current },
          '*'
        );
      }
    },
    [onSelect, onDelete, onReorder, onAddBelow]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  const iframeUrl = `/preview/${slug.replace(/^\//, '')}?edit=true`;

  return (
    <div className="canvas-iframe-container">
      <div
        className="canvas-iframe-wrapper"
        style={{ width: DEVICE_WIDTHS[device] }}
      >
        {blocks.length === 0 && (
          <div className="canvas-empty-overlay">
            <div className="canvas-empty-icon">🧩</div>
            <div className="canvas-empty-text">Your canvas is empty</div>
            <div className="canvas-empty-hint">
              Click a component from the left panel to add it here.
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          className="canvas-iframe"
          title="Page Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
