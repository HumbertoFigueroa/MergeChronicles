'use client';

import type { Item } from '@/lib/types';
import MergeItem from './merge-item';

interface DraggedItemGhostProps {
  item: Item;
  x: number;
  y: number;
}

export default function DraggedItemGhost({ item, x, y }: DraggedItemGhostProps) {
  if (!item) return null;

  const style: React.CSSProperties = {
    position: 'fixed',
    top: y,
    left: x,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 9999,
    width: '80px', // Adjust size as needed
    height: '80px', // Adjust size as needed
  };

  return (
    <div style={style}>
      <MergeItem
        item={item}
        isDragging={false}
        onDragStart={() => {}}
        onDragEnd={() => {}}
      />
    </div>
  );
}
