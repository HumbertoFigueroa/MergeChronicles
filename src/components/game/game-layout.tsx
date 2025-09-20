'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from './game-header';
import CharacterDisplay from './character-display';
import MergeBoard from './merge-board';
import type { BoardSlot, Item, ItemType, Order } from '@/lib/types';
import { ITEMS, MERGE_RULES, STORY_DIALOGUES, INITIAL_ORDERS } from '@/lib/game-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { ShoppingCart, ScrollText, BookOpen } from 'lucide-react';
import RewardedAd from './ad-placeholder';
import PlayerStats from './player-stats';
import OrderDisplay from './order-display';
import ShopDialog from './shop-dialog';
import GameBackground from './game-background';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Scroll } from 'lucide-react';
import Link from 'next/link';

const BOARD_SIZE = 70; // 7 columns x 10 rows
const ENERGY_REGEN_RATE = 1.5 * 60 * 1000; // 1.5 minutes in ms
const MAX_ENERGY = 100;

const initialBoard: BoardSlot[] = Array.from({ length: BOARD_SIZE }, (_, i) => ({
  id: `cell-${i}`,
  item: null,
}));
initialBoard[0] = { ...initialBoard[0], item: ITEMS['shoes_1'] };
initialBoard[1] = { ...initialBoard[1], item: ITEMS['shoes_1'] };
initialBoard[2] = { ...initialBoard[2], item: ITEMS['clothing_1'] };

export default function GameLayout() {
  const [board, setBoard] = useState<BoardSlot[]>(initialBoard);
  const [equippedItems, setEquippedItems] = useState<Partial<Record<ItemType, Item | null>>>({
    clothing: null,
    shoes: null,
    jewelry: null,
    makeup: null,
    bags: null,
  });
  const [mergingIndex, setMergingIndex] = useState<number | null>(null);
  const [appearingIndex, setAppearingIndex] = useState<number | null>(null);
  const [energy, setEnergy] = useState(80);
  const [gems, setGems] = useState(25);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS.slice(0, 1));
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
        setEnergy(currentEnergy => {
            if (currentEnergy < MAX_ENERGY) {
                return currentEnergy + 1;
            }
            return currentEnergy;
        });
    }, ENERGY_REGEN_RATE);

    return () => clearInterval(timer);
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('sourceIndex', index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData('sourceIndex');
    if (sourceIndexStr === null) return;

    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (sourceIndex === targetIndex) return;

    const newBoard = [...board];
    const sourceSlot = newBoard[sourceIndex];
    const targetSlot = newBoard[targetIndex];

    if (!sourceSlot.item) return;

    // Case 1: Dropping on an empty slot (Move)
    if (!targetSlot.item) {
      newBoard[targetIndex] = { ...targetSlot, item: sourceSlot.item };
      newBoard[sourceIndex] = { ...sourceSlot, item: null };
      setBoard(newBoard);
      return;
    }

    // Case 2: Dropping on another item
    const sourceItem = sourceSlot.item;
    const targetItem = targetSlot.item;

    // Check for merge
    if (sourceItem.id === targetItem.id && MERGE_RULES[sourceItem.id]) {
      const newItemId = MERGE_RULES[sourceItem.id];
      const newItem = ITEMS[newItemId];

      if (newItem) {
        newBoard[targetIndex] = { ...targetSlot, item: newItem };
        newBoard[sourceIndex] = { ...sourceSlot, item: null };

        setMergingIndex(targetIndex);
        setTimeout(() => setMergingIndex(null), 400);

        setBoard(newBoard);

        toast({
          title: "Merge Successful!",
          description: (
            <div className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-primary" /> You created a {newItem.name}!
            </div>
          ),
        });
        
        const currentEquipped = equippedItems[newItem.type];
        if (!currentEquipped || newItem.level > currentEquipped.level) {
          setEquippedItems(prev => ({...prev, [newItem.type]: newItem}));
        }
      }
    } else {
      // Not mergeable, swap items
      newBoard[targetIndex] = { ...targetSlot, item: sourceItem };
      newBoard[sourceIndex] = { ...sourceSlot, item: targetItem };
      setBoard(newBoard);
    }
  };
  
  const generateNewItem = useCallback((itemId?: string) => {
    const emptySlotIndex = board.findIndex(slot => !slot.item);
    if (emptySlotIndex !== -1) {
        const newBoard = [...board];
        const itemToGenerate = itemId 
          ? ITEMS[itemId] 
          : ITEMS[Object.keys(ITEMS).filter(k => ITEMS[k].level === 1)[Math.floor(Math.random() * 5)]];
        
        if (!itemToGenerate) {
            toast({ variant: "destructive", title: "Error", description: "Could not find the item to generate." });
            return;
        }

        newBoard[emptySlotIndex] = {...newBoard[emptySlotIndex], item: itemToGenerate};
        setBoard(newBoard);
        setAppearingIndex(emptySlotIndex);
        setTimeout(() => setAppearingIndex(null), 500);
        toast({ title: "A new item has arrived!", description: `You received a ${itemToGenerate.name}.` });
    } else {
        toast({ variant: "destructive", title: "Board is full!", description: "Clear some space to get new items." });
    }
  }, [board, toast]);
  
  const handleCompleteOrder = (order: Order) => {
    // This is a placeholder. Logic to check inventory and grant rewards will go here.
    console.log("Attempting to complete order:", order.id);
    toast({
      title: "Order Completed!",
      description: `You earned ${order.reward.gems} gems!`,
    });
    setGems(g => g + order.reward.gems);
    // Generate new order
    const currentOrderIndex = INITIAL_ORDERS.findIndex(o => o.id === order.id);
    const nextOrderIndex = (currentOrderIndex + 1) % INITIAL_ORDERS.length;
    setOrders([INITIAL_ORDERS[nextOrderIndex]]);
  };

  const addGems = (amount: number) => {
    setGems(g => g + amount);
    toast({ title: "Gems Added!", description: `You received ${amount} gems.` });
  };

  const addEnergy = (amount: number) => {
    setEnergy(e => Math.min(MAX_ENERGY, e + amount));
     toast({ title: "Energy Added!", description: `You received ${amount} energy.` });
  };
  
  const spendGems = (amount: number): boolean => {
    if (gems >= amount) {
        setGems(g => g - amount);
        return true;
    }
    toast({ variant: 'destructive', title: 'Not enough gems!', description: 'You need more gems to make this purchase.' });
    return false;
  }
  
  const handleTabChange = (value: string) => {
    if (activeTab === value) {
        setActiveTab(undefined);
    } else {
        setActiveTab(value);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      <GameBackground />
      <GameHeader />
      <ShopDialog 
        isOpen={isShopOpen} 
        onOpenChange={setIsShopOpen}
        onAddGems={addGems}
        onAddEnergy={addEnergy}
        onGenerateItem={generateNewItem}
        onSpendGems={spendGems}
        gems={gems}
      />
      {/* Desktop Layout */}
      <main className="relative z-10 pt-16 hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 flex-grow">
        <div className="lg:col-span-3 flex flex-col gap-4">
            <Button asChild size="lg" className="h-20 text-lg">
                <Link href="/story" className='flex-col'>
                    <BookOpen className="w-8 h-8 mb-1" />
                    Story
                </Link>
            </Button>
          <OrderDisplay orders={orders} onCompleteOrder={handleCompleteOrder} />
          <RewardedAd onReward={() => generateNewItem()} />
        </div>

        <div className="lg:col-span-6 flex flex-col items-center justify-center gap-4">
          <div className='w-full flex items-center justify-center gap-4 px-2'>
            <PlayerStats level={57} xp={75} energy={energy} maxEnergy={MAX_ENERGY} gems={gems} />
            <Button variant="secondary" size="icon" className='h-14 w-14 rounded-2xl flex-shrink-0' onClick={() => setIsShopOpen(true)}>
                <ShoppingCart className="h-7 w-7" />
            </Button>
          </div>
          <MergeBoard
            board={board}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            mergingIndex={mergingIndex}
            appearingIndex={appearingIndex}
          />
        </div>

        <div className="lg:col-span-3">
          <CharacterDisplay equippedItems={equippedItems} />
        </div>
      </main>

      {/* Mobile Layout */}
      <main className="relative z-10 pt-16 flex flex-col lg:hidden flex-grow p-2 sm:p-4">
        <div className='w-full flex items-start justify-between gap-2 px-1'>
          <PlayerStats level={57} xp={75} energy={energy} maxEnergy={MAX_ENERGY} gems={gems} isMobile />
          <div className="flex gap-2 flex-shrink-0">
            <Button asChild variant="secondary" size="icon" className='h-12 w-12 rounded-2xl'>
                <Link href="/story">
                    <ScrollText className="h-6 w-6" />
                </Link>
            </Button>
            <Button variant="secondary" size="icon" className='h-12 w-12 rounded-2xl' onClick={() => setIsShopOpen(true)}>
                <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center gap-2 my-2">
          <MergeBoard
            board={board}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            mergingIndex={mergingIndex}
            appearingIndex={appearingIndex}
          />
        </div>

        <div className={activeTab ? 'pb-0' : 'pb-20'}>
             <RewardedAd onReward={() => generateNewItem()} />
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 z-50 p-2 bg-background/80 backdrop-blur-sm border-t">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="orders" className="py-3 text-sm">
                        <Scroll className="mr-2" />
                        Orders
                    </TabsTrigger>
                    <TabsTrigger value="character" className="py-3 text-sm">
                        <User className="mr-2" />
                        Character
                    </TabsTrigger>
                </TabsList>
                {activeTab && (
                    <div className="fixed bottom-[72px] left-0 right-0 max-h-[45vh] overflow-y-auto p-4 bg-background/95 animate-in slide-in-from-bottom-full">
                        <TabsContent value="orders">
                            <OrderDisplay orders={orders} onCompleteOrder={handleCompleteOrder} />
                        </TabsContent>
                        <TabsContent value="character">
                             <CharacterDisplay equippedItems={equippedItems} />
                        </TabsContent>
                    </div>
                )}
            </Tabs>
        </div>
      </main>
    </div>
  );
}
