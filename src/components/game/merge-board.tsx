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
  draggedOverIndex?: number | null;
  isSellMode: boolean;
}

export default function MergeBoard({ 
    board, 
    onDragStart,
    onDragEnd, 
    onDrop, 
    onItemClick, 
    onTouchStart,
    draggedItemIndex,
    draggedOverIndex,
    isSellMode,
}: MergeBoardProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className={cn(
      "grid grid-cols-7 gap-1.5 p-2 sm:p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-solid border-white/30 w-full max-w-2xl mx-auto shadow-lg",
      isSellMode && "cursor-pointer"
    )}>
      {board.map((slot, index) => (
        <div
          key={slot.id}
          data-slot-id={slot.id}
          onDragOver={handleDragOver}
          onDrop={(e) => onDrop(e, index)}
          onClick={() => onItemClick(index)}
          onTouchStart={(e) => onTouchStart(e, index)}
          className={cn(
            "rounded-lg transition-colors aspect-square bg-card/60 shadow-inner",
            draggedOverIndex === index && "bg-accent/50",
            isSellMode && slot.item && !slot.item.isGenerator && "hover:bg-red-500/50"
          )}
        >
          {slot.item && (
            <MergeItem
              item={slot.item}
              onDragStart={(e) => onDragStart(e, index)}
              onDragEnd={onDragEnd}
              isDragging={draggedItemIndex === index}
              isSellMode={isSellMode}
            />
          )}
        </div>
      ))}
    </div>
  );
}
