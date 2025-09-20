'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ItemType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GeneratorControlsProps {
  selectedType: ItemType;
  onTypeSelect: (type: ItemType) => void;
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
}: GeneratorControlsProps) {
  return (
    <ToggleGroup 
      type="single"
      value={selectedType}
      onValueChange={(value) => {
        if (value) onTypeSelect(value as ItemType);
      }}
      className="justify-start"
    >
      {typeOptions.map(opt => (
        <ToggleGroupItem 
          key={opt.value} 
          value={opt.value} 
          aria-label={`Seleccionar ${opt.label}`} 
          className="w-14 h-14"
        >
          <span className="text-2xl" role="img" aria-label={opt.label}>{opt.emoji}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
