import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @deprecated This function is no longer used as the game now uses emojis instead of images.
 */
export function findImage(id: string, name?: string): string {
  // This function is kept to avoid breaking imports, but it's not actively used.
  // In a real project, this and its dependencies would be removed.
  const textToShow = name || id;
  const formattedName = textToShow.replace(/\s/g, '+');
  return `https://picsum.photos/seed/${formattedName}/200/200`;
}
