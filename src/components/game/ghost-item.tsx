'use client';

import type { Item } from '@/lib/types';
import MergeItem from './merge-item';

interface GhostItemProps {
  item: Item;
  position: { x: number; y: number };
}

export default function GhostItem({ item, position }: GhostItemProps) {
  if (!item) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        width: '80px', // Adjust size as needed
        height: '80px',
      }}
    >
      <MergeItem
        item={item}
        onDragStart={() => {}}
        onTouchStart={() => {}}
        isMerging={false}
        isAppearing={false}
      />
    </div>
  );
}
