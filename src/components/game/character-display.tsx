import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shirt, Gem } from 'lucide-react';
import type { Item } from '@/lib/types';
import { findImage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CharacterDisplayProps {
  equippedItems: {
    dress: Item | null;
    shoe: Item | null;
    accessory: Item | null;
  };
}

const ShoeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-muted-foreground/50">
        <path d="M7 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V17a2 2 0 0 1-2 2H7Z"/>
        <path d="M16 13.5V9"/>
        <path d="M16 13.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
    </svg>
)

const ItemSlot = ({ item, icon, type }: { item: Item | null, icon: React.ReactNode, type: string }) => (
  <div className={cn(
    "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center relative bg-background/50",
    item && "border-solid border-primary/50"
    )}>
    {item ? (
      <Image
        src={item.image}
        alt={item.name}
        width={80}
        height={80}
        className="object-contain p-1"
      />
    ) : (
      icon
    )}
    <div className="absolute bottom-1 right-1 text-xs capitalize text-muted-foreground">{type}</div>
  </div>
);


export default function CharacterDisplay({ equippedItems }: CharacterDisplayProps) {
  const avatarUrl = findImage('character_avatar');
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Character</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-muted">
          <Image
            src={avatarUrl}
            alt="Character Avatar"
            fill
            className="object-cover"
            data-ai-hint="fashion model"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <ItemSlot item={equippedItems.dress} icon={<Shirt className="h-8 w-8 text-muted-foreground/50" />} type="dress" />
          <ItemSlot item={equippedItems.shoe} icon={<ShoeIcon />} type="shoe" />
          <ItemSlot item={equippedItems.accessory} icon={<Gem className="h-8 w-8 text-muted-foreground/50" />} type="accessory" />
        </div>
      </CardContent>
    </Card>
  );
}
