export type ItemType = 'jewelry' | 'makeup' | 'shoes' | 'clothing' | 'bags';

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

export interface Order {
    id: string;
    requiredItems: {
        itemId: string;
        quantity: number;
    }[];
    reward: {
        gems: number;
    };
}
