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
    <div className="grid grid-cols-7 gap-1.5 p-2 sm:p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-solid border-white/30 w-full max-w-2xl mx-auto shadow-lg lg:flex-grow">
      {board.map((slot, index) => (
        <div
          key={slot.id}
          data-slot-id={slot.id}
          onDragOver={handleDragOver}
          onDrop={(e) => onDrop(e, index)}
          onClick={() => onItemClick(index)}
          className="rounded-lg transition-colors aspect-square bg-card/60 shadow-inner"
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
