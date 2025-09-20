import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function findImage(id: string): string {
  // Directly construct the URL based on the item ID.
  // This is more reliable than searching an array during module initialization.
  // The seeds in placeholder-images.json follow this pattern.
  // Example: `https://picsum.photos/seed/jewelry_1/200/200`
  return `https://picsum.photos/seed/${id}/200/200`;
}
