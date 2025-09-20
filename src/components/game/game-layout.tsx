'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from './game-header';
import MergeBoard from './merge-board';
import type { BoardSlot, Item, ItemType, Order } from '@/lib/types';
import { ITEMS, MERGE_RULES, INITIAL_ORDERS } from '@/lib/game-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { ShoppingCart, BookOpen } from 'lucide-react';
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
    
    // Fix: Add a check to ensure sourceSlot is not undefined
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

  const purchaseGems = (amount: number, price: string) => {
    // In a real app, this would trigger the payment flow.
    // Here we simulate getting a payment token and then confirming the purchase.
    toast({
        title: "Procesando compra...",
        description: `Iniciando pago seguro para ${amount} gemas.`
    });

    // Simulate a delay for payment processing
    setTimeout(() => {
        // This is where you would handle the response from your payment provider using a token.
        // For now, we'll just add the gems directly.
        setGems(g => g + amount);
        toast({
          title: "¡Compra Exitosa!",
          description: `Has añadido ${amount} gemas por ${price}.`
        });
    }, 1500);
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
        onPurchaseGems={purchaseGems}
        onAddEnergy={addEnergy}
        onGenerateItem={generateNewItem}
        onSpendGems={spendGems}
        gems={gems}
      />
      {/* Main content area */}
      <main className="relative z-10 pt-16 flex flex-col lg:grid lg:grid-cols-12 gap-4 p-2 sm:p-4 flex-grow overflow-hidden">
        
        {/* Left Column (Desktop) / Hidden on Mobile */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            <Button asChild size="lg" className="h-20 text-lg">
                <Link href="/story" className='flex-col'>
                    <BookOpen className="w-8 h-8 mb-1" />
                    Historia
                </Link>
            </Button>
          <OrderDisplay orders={orders} onCompleteOrder={handleCompleteOrder} />
        </div>

        {/* Center/Main Column */}
        <div className="lg:col-span-9 flex flex-col items-center gap-4 flex-grow min-h-0">
          
          {/* Top Bar with Stats & Shop */}
          <div className='w-full flex items-center justify-center gap-2 px-1 flex-shrink-0'>
            <PlayerStats level={57} xp={75} energy={energy} maxEnergy={MAX_ENERGY} gems={gems} />
            <Button variant="secondary" size="icon" className='h-14 w-14 rounded-2xl flex-shrink-0' onClick={() => setIsShopOpen(true)}>
                <ShoppingCart className="h-7 w-7" />
            </Button>
          </div>

          {/* Mobile Orders Display */}
          <div className='lg:hidden w-full my-2'>
              <OrderDisplay orders={orders} onCompleteOrder={handleCompleteOrder} />
          </div>
          
          {/* Merge Board */}
          <div className="flex-grow flex flex-col items-center justify-center w-full min-h-0">
            <MergeBoard
              board={board}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              mergingIndex={mergingIndex}
              appearingIndex={appearingIndex}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
