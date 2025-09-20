import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PlaceHolderImages } from "./placeholder-images";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function findImage(id: string, name?: string): string {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (image) {
    return image.imageUrl;
  }
  
  const textToShow = name || id;
  const formattedName = textToShow.replace(/\s/g, '+');
  // Fallback to picsum to avoid SVG issues if an image is not in the json
  return `https://picsum.photos/seed/${formattedName}/200/200`;
}
