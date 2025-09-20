'use client';

import { Badge } from '@/components/ui/badge';
import type { Item } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MergeItemProps {
  item: Item;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  isMerging: boolean;
  isAppearing: boolean;
}

export default function MergeItem({ item, onDragStart, isMerging, isAppearing }: MergeItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
          "w-full h-full p-1.5 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing rounded-lg bg-card/50 hover:bg-accent/50 transition-all duration-200 ease-in-out will-change-transform",
          isMerging && "animate-merge-pop",
          isAppearing && "animate-appear"
      )}
    >
      <div className="relative aspect-square w-full flex items-center justify-center">
        <span className="text-4xl sm:text-5xl drop-shadow-lg" role="img" aria-label={item.name}>
          {item.emoji}
        </span>
      </div>
      <Badge variant="secondary" className="mt-1 text-xs">
        Lvl {item.level}
      </Badge>
    </div>
  );
}
