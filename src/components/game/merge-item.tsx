import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Item } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MergeItemProps {
  item: Item;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  isMerging: boolean;
}

export default function MergeItem({ item, onDragStart, isMerging }: MergeItemProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
          "w-full h-full p-1.5 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing rounded-lg bg-card/50 hover:bg-accent/50 transition-all duration-200 ease-in-out will-change-transform",
          isMerging && "animate-merge-pop"
      )}
    >
      <div className="relative aspect-square w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain drop-shadow-lg"
          sizes="(max-width: 768px) 10vw, (max-width: 1200px) 8vw, 6vw"
          draggable="false"
        />
      </div>
      <Badge variant="secondary" className="mt-1">
        Lvl {item.level}
      </Badge>
    </div>
  );
}
