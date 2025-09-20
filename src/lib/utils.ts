import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PlaceHolderImages } from "./placeholder-images";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function findImage(id: string): string {
  // First, check for special, non-item images
  const specialImage = PlaceHolderImages.find(img => 
    img.id === id && !id.includes('_')
  );
  if (specialImage) {
    return specialImage.imageUrl;
  }
  
  // For game items, construct the URL directly to ensure consistency
  // This avoids race conditions or module loading issues with the large JSON file.
  // The seeds in placeholder-images.json follow this pattern.
  return `https://picsum.photos/seed/${id}/200/200`;
}
