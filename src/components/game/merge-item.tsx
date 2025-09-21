'use client';

import type { Item } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MergeItemProps {
  item: Item;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  isMerging: boolean;
  isAppearing: boolean;
  isDragging: boolean;
  isSelectedGenerator?: boolean;
}

export default function MergeItem({ 
  item, 
  onDragStart, 
  onDragEnd, 
  onTouchStart, 
  isMerging, 
  isAppearing, 
  isDragging, 
  isSelectedGenerator 
}: MergeItemProps) {
  
  return (
    <div
      draggable={!item.isGenerator}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onTouchStart={onTouchStart}
      className={cn(
          "w-full h-full p-1 flex flex-col items-center justify-center rounded-lg bg-card/50 transition-all duration-200 ease-in-out will-change-transform touch-none",
          item.isGenerator 
            ? "cursor-pointer hover:bg-green-300/50" 
            : "cursor-grab active:cursor-grabbing hover:bg-accent/50",
          isSelectedGenerator && "ring-4 ring-green-400 ring-inset",
          isMerging && "animate-merge-pop",
          isAppearing && "animate-pop-in",
          isDragging && "opacity-50",
      )}
    >
      <div className="relative aspect-square w-full flex items-center justify-center">
        <span className="text-4xl sm:text-5xl drop-shadow-lg" role="img" aria-label={item.name}>
          {item.emoji}
        </span>
      </div>
    </div>
  );
}
