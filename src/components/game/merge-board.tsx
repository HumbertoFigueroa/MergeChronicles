import type { BoardSlot } from '@/lib/types';
import MergeItem from './merge-item';
import { cn } from '@/lib/utils';

interface MergeBoardProps {
  board: BoardSlot[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  mergingIndex: number | null;
  appearingIndex: number | null;
}

export default function MergeBoard({ board, onDragStart, onDrop, mergingIndex, appearingIndex }: MergeBoardProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-7 gap-1.5 p-2 sm:p-4 rounded-lg bg-card/70 border-2 border-dashed h-full w-full max-w-2xl mx-auto aspect-[7/10] shadow-inner">
      {board.map((slot, index) => (
        <div
          key={slot.id}
          onDragOver={handleDragOver}
          onDrop={(e) => onDrop(e, index)}
          className={cn(
              "rounded-md bg-background/50 transition-colors",
              slot.item && 'bg-transparent'
            )}
        >
          {slot.item && (
            <MergeItem
              item={slot.item}
              onDragStart={(e) => onDragStart(e, index)}
              isMerging={mergingIndex === index}
              isAppearing={appearingIndex === index}
            />
          )}
        </div>
      ))}
    </div>
  );
}
