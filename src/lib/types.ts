export type ItemType = 'shoe' | 'dress' | 'accessory';

export interface Item {
  id: string;
  name: string;
  level: number;
  type: ItemType;
  image: string;
}

export interface BoardSlot {
  id: string; // e.g., "cell-0"
  item: Item | null;
}
