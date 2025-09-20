export type ItemType = 'animals' | 'flags' | 'professions' | 'clothing' | 'food';

export interface Item {
  id: string;
  name: string;
  level: number;
  type: ItemType;
  emoji: string;
  isGenerator?: boolean;
}

export interface BoardSlot {
  id: string; // e.g., "cell-0"
  item: Item | null;
}

export interface Order {
    id: string;
    customerEmoji: string;
    requiredItems: {
        itemId: string;
        quantity: number;
    }[];
    isCompletable?: boolean;
}
