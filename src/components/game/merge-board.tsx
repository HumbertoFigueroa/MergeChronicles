'use client';

import type { BoardSlot } from '@/lib/types';
import MergeItem from './merge-item';
import { cn } from '@/lib/utils';

interface MergeBoardProps {
  board: BoardSlot[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onItemClick: (index: number) => void;
  mergingIndex: number | null;
  appearingIndex: number | null;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>, index: number) => void;
  draggedItemIndex: number | null;
}

export default function MergeBoard({ 
    board, 
    onDragStart, 
    onDrop, 
    onItemClick, 
    mergingIndex, 
    appearingIndex, 
    onTouchStart,
    draggedItemIndex
}: MergeBoardProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-7 gap-1.5 p-2 sm:p-4 rounded-lg bg-card/70 backdrop-blur-sm border-2 border-dashed w-full max-w-2xl mx-auto shadow-inner lg:flex-grow">
      {board.map((slot, index) => (
        <div
          key={slot.id}
          data-slot-id={slot.id}
          onDragOver={handleDragOver}
          onDrop={(e) => onDrop(e, index)}
          onClick={() => onItemClick(index)}
          className={cn(
            "rounded-md transition-colors aspect-square",
            slot.item ? "bg-white/20" : "bg-white/10"
          )}
        >
          {slot.item && (
            <MergeItem
              item={slot.item}
              onDragStart={(e) => onDragStart(e, index)}
              onTouchStart={(e) => onTouchStart(e, index)}
              isMerging={mergingIndex === index}
              isAppearing={appearingIndex === index}
              isHidden={draggedItemIndex === index}
            />
          )}
        </div>
      ))}
    </div>
  );
}
