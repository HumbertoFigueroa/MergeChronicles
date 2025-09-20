'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, Shirt, ShoppingBag, SprayCan, Footprints } from 'lucide-react';
import type { Item, ItemType } from '@/lib/types';
import { findImage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CharacterDisplayProps {
  equippedItems: Partial<Record<ItemType, Item | null>>;
}

const itemTypeIcons: Record<ItemType, React.ReactNode> = {
  clothing: <Shirt className="h-8 w-8 text-muted-foreground/50" />,
  shoes: <Footprints className="h-8 w-8 text-muted-foreground/50" />,
  jewelry: <Gem className="h-8 w-8 text-muted-foreground/50" />,
  bags: <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />,
  makeup: <SprayCan className="h-8 w-8 text-muted-foreground/50" />,
};

const ItemSlot = ({ item, type }: { item: Item | null, type: ItemType }) => (
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
        className="object-contain p-1 drop-shadow-lg"
      />
    ) : (
      itemTypeIcons[type]
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
          <ItemSlot item={equippedItems.clothing ?? null} type="clothing" />
          <ItemSlot item={equippedItems.shoes ?? null} type="shoes" />
          <ItemSlot item={equippedItems.jewelry ?? null} type="jewelry" />
          <ItemSlot item={equippedItems.bags ?? null} type="bags" />
          <ItemSlot item={equippedItems.makeup ?? null} type="makeup" />
        </div>
      </CardContent>
    </Card>
  );
}
