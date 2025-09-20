'use client';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ItemType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GeneratorControlsProps {
  selectedType: ItemType;
  onTypeSelect: (type: ItemType) => void;
  multiplier: 1 | 2 | 4;
  onMultiplierChange: () => void;
}

const typeOptions: { value: ItemType; label: string; emoji: string }[] = [
  { value: 'animals', label: 'Animales', emoji: '🐣' },
  { value: 'flags', label: 'Banderas', emoji: '🏳️' },
  { value: 'professions', label: 'Profesiones', emoji: '🧑‍🎓' },
  { value: 'clothing', label: 'Ropa', emoji: '🧢' },
  { value: 'food', label: 'Comida', emoji: '🍇' },
];

export default function GeneratorControls({
  selectedType,
  onTypeSelect,
  multiplier,
  onMultiplierChange,
}: GeneratorControlsProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
      <ToggleGroup 
        type="single"
        value={selectedType}
        onValueChange={(value) => {
          if (value) onTypeSelect(value as ItemType);
        }}
        className="w-full sm:w-auto justify-start"
      >
        {typeOptions.map(opt => (
          <ToggleGroupItem 
            key={opt.value} 
            value={opt.value} 
            aria-label={`Seleccionar ${opt.label}`} 
            className="flex-grow"
          >
            <span className="text-xl" role="img" aria-label={opt.label}>{opt.emoji}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      
      <Button
        variant="outline"
        onClick={onMultiplierChange}
        className="w-full sm:w-auto font-bold text-lg"
      >
        x{multiplier}
      </Button>
    </div>
  );
}
