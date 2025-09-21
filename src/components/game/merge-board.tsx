'use client';

import type { BoardSlot } from '@/lib/types';
import MergeItem from './merge-item';
import { cn } from '@/lib/utils';

interface MergeBoardProps {
  board: BoardSlot[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onItemClick: (index: number) => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>, index: number) => void;
  draggedItemIndex: number | null;
}

export default function MergeBoard({ 
    board, 
    onDragStart,
    onDragEnd, 
    onDrop, 
    onItemClick, 
    onTouchStart,
    draggedItemIndex
}: MergeBoardProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-7 gap-1.5 p-2 sm:p-4 rounded-lg bg-gray-900 backdrop-blur-sm border-2 border-dashed w-full max-w-2xl mx-auto shadow-inner lg:flex-grow">
      {board.map((slot, index) => (
        <div
          key={slot.id}
          data-slot-id={slot.id}
          onDragOver={handleDragOver}
          onDrop={(e) => onDrop(e, index)}
          onClick={() => onItemClick(index)}
          className="rounded-md transition-colors aspect-square bg-card/50"
        >
          {slot.item && (
            <MergeItem
              item={slot.item}
              onDragStart={(e) => onDragStart(e, index)}
              onDragEnd={onDragEnd}
              onTouchStart={(e) => onTouchStart(e, index)}
              isDragging={draggedItemIndex === index}
            />
          )}
        </div>
      ))}
    </div>
  );
}
