'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from './game-header';
import MergeBoard from './merge-board';
import type { BoardSlot, Item, ItemType, Order } from '@/lib/types';
import { ITEMS, MERGE_RULES, INITIAL_ORDERS } from '@/lib/game-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { ShoppingCart, ScrollText, BookOpen } from 'lucide-react';
import RewardedAd from './ad-placeholder';
import PlayerStats from './player-stats';
import OrderDisplay from './order-display';
import ShopDialog from './shop-dialog';
import GameBackground from './game-background';
import Link from 'next/link';

const BOARD_SIZE = 56; // 7 columns x 8 rows
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
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isShopOpen, setIsShopOpen] = useState(false);

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
    if (isNaN(sourceIndex)) return;

    const newBoard = [...board];
    const sourceSlot = newBoard[sourceIndex];
    if (!sourceSlot || sourceIndex === targetIndex) return;
    
    const targetSlot = newBoard[targetIndex];

    if (!sourceSlot.item) return;

    if (!targetSlot.item) {
      newBoard[targetIndex] = { ...targetSlot, item: sourceSlot.item };
      newBoard[sourceIndex] = { ...sourceSlot, item: null };
      setBoard(newBoard);
      return;
    }

    const sourceItem = sourceSlot.item;
    const targetItem = targetSlot.item;

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
          title: "¡Fusión Exitosa!",
          description: (
            <div className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-primary" /> ¡Creaste un {newItem.name}!
            </div>
          ),
        });
        
        const currentEquipped = equippedItems[newItem.type];
        if (!currentEquipped || newItem.level > currentEquipped.level) {
          setEquippedItems(prev => ({...prev, [newItem.type]: newItem}));
        }
      }
    } else {
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
            toast({ variant: "destructive", title: "Error", description: "No se pudo encontrar el ítem a generar." });
            return;
        }

        newBoard[emptySlotIndex] = {...newBoard[emptySlotIndex], item: itemToGenerate};
        setBoard(newBoard);
        setAppearingIndex(emptySlotIndex);
        setTimeout(() => setAppearingIndex(null), 500);
        toast({ title: "¡Ha llegado un nuevo objeto!", description: `Recibiste un ${itemToGenerate.name}.` });
    } else {
        toast({ variant: "destructive", title: "¡Tablero lleno!", description: "Libera algo de espacio para obtener nuevos objetos." });
    }
  }, [board, toast]);
  
  const handleCompleteOrder = (completedOrder: Order) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== completedOrder.id));
    setGems(g => g + completedOrder.reward.gems);
    toast({
      title: "¡Orden Completada!",
      description: `¡Ganaste ${completedOrder.reward.gems} gemas!`,
    });
  };

  const addGems = (amount: number) => {
    setGems(g => g + amount);
    toast({ title: "¡Gemas Añadidas!", description: `Recibiste ${amount} gemas.` });
  };

  const addEnergy = (amount: number) => {
    setEnergy(e => Math.min(MAX_ENERGY, e + amount));
     toast({ title: "¡Energía Añadida!", description: `Recibiste ${amount} de energía.` });
  };
  
  const spendGems = (amount: number): boolean => {
    if (gems >= amount) {
        setGems(g => g - amount);
        return true;
    }
    toast({ variant: 'destructive', title: '¡No hay suficientes gemas!', description: 'Necesitas más gemas para hacer esta compra.' });
    return false;
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
      <main className="relative z-10 pt-16 hidden lg:grid grid-cols-12 gap-4 p-4 flex-grow">
        <div className="lg:col-span-3 flex flex-col gap-4">
            <Button asChild size="lg" className="h-20 text-lg">
                <Link href="/story" className='flex-col'>
                    <BookOpen className="w-8 h-8 mb-1" />
                    Historia
                </Link>
            </Button>
          <OrderDisplay orders={orders} onCompleteOrder={handleCompleteOrder} />
        </div>

        <div className="lg:col-span-9 flex flex-col items-center justify-center gap-4">
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
           <RewardedAd onReward={() => generateNewItem()} />
        </div>
      </main>

      {/* Mobile Layout */}
      <main className="relative z-10 pt-16 flex flex-col lg:hidden flex-grow p-2 sm:p-4 overflow-hidden">
        <div className='w-full flex items-start justify-between gap-2 px-1 flex-shrink-0'>
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

        <div className='my-2'>
            <OrderDisplay orders={orders} onCompleteOrder={handleCompleteOrder} />
        </div>

        <div className="flex-grow flex flex-col items-center justify-center min-h-0 my-2">
          <MergeBoard
            board={board}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            mergingIndex={mergingIndex}
            appearingIndex={appearingIndex}
          />
        </div>

        <div className="flex-shrink-0 mt-2">
             <RewardedAd onReward={() => generateNewItem()} />
        </div>
      </main>
    </div>
  );
}
