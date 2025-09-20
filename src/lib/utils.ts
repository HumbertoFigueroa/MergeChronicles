import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ITEMS } from './game-data';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function findImage(id: string): string {
  const item = ITEMS[id];
  const name = item ? item.name.replace(/\s/g, '+') : 'Item';
  // Using placehold.co to generate placeholders with item names
  return `https://placehold.co/200x200/FFFFFF/A149F8?text=${name}&font=fredoka`;
}
