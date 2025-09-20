import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function findImage(id: string, name?: string): string {
  const textToShow = name || id;
  const formattedName = textToShow.replace(/\s/g, '+');
  return `https://placehold.co/200x200/FFFFFF/A149F8?text=${formattedName}&font=fredoka`;
}
