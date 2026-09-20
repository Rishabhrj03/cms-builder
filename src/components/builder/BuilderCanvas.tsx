'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Block } from '@/types/Block';
import BlockCard from './BlockCard';

interface Props {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (blocks: Block[]) => void;
}

export default function BuilderCanvas({
  blocks,
  selectedId,
  onSelect,
  onDelete,
  onReorder,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({
      ...b,
      order: i,
    }));
    onReorder(reordered);
  }

  if (blocks.length === 0) {
    return (
      <div className="builder-canvas">
        <div className="canvas-empty">
          <div className="canvas-empty-icon">🧩</div>
          <div className="canvas-empty-text">Your canvas is empty</div>
          <div className="canvas-empty-hint text-muted">
            Click a component from the left panel to add it here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-canvas">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <BlockCard
              key={block.id}
              block={block}
              selected={block.id === selectedId}
              onClick={() => onSelect(block.id)}
              onDelete={() => onDelete(block.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
