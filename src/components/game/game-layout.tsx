'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MergeBoard from './merge-board';
import type { BoardSlot, Item } from '@/lib/types';
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
export const ENERGY_REGEN_RATE = 1.5 * 60 * 1000; // 1.5 minutes in ms
export const MAX_ENERGY = 100;
const ENERGY_COST_PER_GENERATION = 1;
const GEMS_PER_LEVEL = 5;

const initialBoard: BoardSlot[] = Array.from({ length: BOARD_SIZE }, (_, i) => ({
  id: `cell-${i}`,
  item: null,
}));

// Place generators on the board
initialBoard[2] = { ...initialBoard[2], item: ITEMS['generator_animals'] };
initialBoard[3] = { ...initialBoard[3], item: ITEMS['generator_food'] };
initialBoard[4] = { ...initialBoard[4], item: ITEMS['generator_clothing'] };


export default function GameLayout() {
  const [board, setBoard] = useState<BoardSlot[]>(initialBoard);
  const [mergingIndex, setMergingIndex] = useState<number | null>(null);
  const [appearingIndex, setAppearingIndex] = useState<number | null>(null);
  const [energy, setEnergy] = useState(100);
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

    // If target is empty, move the item
    if (!targetSlot.item) {
      newBoard[targetIndex] = { ...targetSlot, item: sourceSlot.item };
      newBoard[sourceIndex] = { ...sourceSlot, item: null };
      setBoard(newBoard);
      return;
    }

    const sourceItem = sourceSlot.item;
    const targetItem = targetSlot.item;

    // If both are not generators and can be merged
    if (!sourceItem.isGenerator && !targetItem.isGenerator && sourceItem.id === targetItem.id && MERGE_RULES[sourceItem.id]) {
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
              <BookOpen className="mr-2 h-4 w-4 text-primary" /> ¡Creaste un {newItem.name}! {newItem.emoji}
            </div>
          ),
        });
      }
    } else { // Otherwise, swap items
      newBoard[targetIndex] = { ...targetSlot, item: sourceItem };
      newBoard[sourceIndex] = { ...sourceSlot, item: targetItem };
      setBoard(newBoard);
    }
  };
  
  const placeNewItem = useCallback((itemId: string, preferredIndex?: number): boolean => {
    let placed = false;
    setBoard(currentBoard => {
      const newBoard = [...currentBoard];
      const itemToPlace = ITEMS[itemId];
      if (!itemToPlace) return currentBoard;

      // Try to place adjacent to the generator first
      if (preferredIndex !== undefined) {
        const adjacentIndexes = [
            preferredIndex - 7, preferredIndex + 7, // Above, Below
            (preferredIndex % 7 !== 0) ? preferredIndex - 1 : -1, // Left
            ((preferredIndex + 1) % 7 !== 0) ? preferredIndex + 1 : -1, // Right
        ].filter(i => i >= 0 && i < BOARD_SIZE && !newBoard[i].item);
        
        if (adjacentIndexes.length > 0) {
            const index = adjacentIndexes[0];
            newBoard[index] = {...newBoard[index], item: itemToPlace};
            setAppearingIndex(index);
            setTimeout(() => setAppearingIndex(null), 500);
            placed = true;
            return newBoard;
        }
      }

      // If no adjacent slot, find any empty slot
      const emptySlotIndex = newBoard.findIndex(slot => !slot.item);
      if (emptySlotIndex !== -1) {
          newBoard[emptySlotIndex] = {...newBoard[emptySlotIndex], item: itemToPlace};
          setAppearingIndex(emptySlotIndex);
          setTimeout(() => setAppearingIndex(null), 500);
          placed = true;
          return newBoard;
      }
      
      return currentBoard; // No changes if board is full
    });
    return placed;
  }, []);

  const handleItemClick = (index: number) => {
    const clickedItem = board[index].item;
    if (!clickedItem || !clickedItem.isGenerator) return;

    if (energy < ENERGY_COST_PER_GENERATION) {
      toast({ variant: "destructive", title: "¡No hay suficiente energía!", description: `Necesitas ${ENERGY_COST_PER_GENERATION} de energía.` });
      return;
    }

    const itemToGenerateId = `${clickedItem.type}_1`;
    const success = placeNewItem(itemToGenerateId, index);

    if (success) {
      setEnergy(e => e - ENERGY_COST_PER_GENERATION);
      const generatedItem = ITEMS[itemToGenerateId];
      toast({ title: "¡Nuevo objeto generado!", description: `Creaste 1 x ${generatedItem.name} ${generatedItem.emoji}` });
    } else {
      toast({ variant: "destructive", title: "¡Tablero lleno!", description: "Libera algo de espacio." });
    }
  };
  
  const handleDeliverOrder = (orderId: string) => {
    const orderToDeliver = orders.find(o => o.id === orderId && o.isCompletable);
    if (!orderToDeliver) return;

    const requiredItemId = orderToDeliver.requiredItems[0].itemId;
    const itemIndexOnBoard = board.findIndex(slot => slot.item?.id === requiredItemId);

    if (itemIndexOnBoard !== -1) {
      const deliveredItem = board[itemIndexOnBoard].item!;
      const reward = deliveredItem.level * GEMS_PER_LEVEL;

      setGems(g => g + reward);
      setBoard(b => {
        const newBoard = [...b];
        newBoard[itemIndexOnBoard] = { ...newBoard[itemIndexOnBoard], item: null };
        return newBoard;
      });

      setOrders(currentOrders => currentOrders.filter(o => o.id !== orderId));
      
      toast({
        title: "¡Orden Completada!",
        description: `¡Entregaste un ${deliveredItem.name} y ganaste ${reward} gemas!`,
      });
    }
  };

  useEffect(() => {
    const boardItemIds = new Set(board.map(slot => slot.item?.id).filter(Boolean));
    
    setOrders(currentOrders => 
      currentOrders.map(order => {
        const isCompletable = order.requiredItems.every(req => boardItemIds.has(req.itemId));
        return { ...order, isCompletable };
      })
    );
  }, [board]);

  const purchaseGems = (amount: number, price: string) => {
    toast({
        title: "Procesando token de pago...",
        description: `Iniciando pago seguro para ${amount} gemas.`
    });

    setTimeout(() => {
        setGems(g => g + amount);
        toast({
          title: "¡Compra Exitosa!",
          description: `Has añadido ${amount} gemas por ${price}.`
        });
        setIsShopOpen(false);
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
      <ShopDialog 
        isOpen={isShopOpen} 
        onOpenChange={setIsShopOpen}
        onPurchaseGems={purchaseGems}
        onAddEnergy={addEnergy}
        onGenerateItem={(itemId) => placeNewItem(itemId)}
        onSpendGems={spendGems}
        gems={gems}
      />
      <main className="relative z-10 pt-4 flex flex-col lg:flex-row gap-4 p-2 sm:p-4 flex-grow overflow-hidden">
        
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            <Button asChild size="lg" className="h-20 text-lg">
                <Link href="/story" className='flex-col'>
                    <BookOpen className="w-8 h-8 mb-1" />
                    Historia
                </Link>
            </Button>
        </div>

        <div className="flex flex-col items-center gap-4 flex-grow min-h-0 w-full lg:col-span-9">
          
          <div className='w-full flex items-center justify-center gap-2 px-1 flex-shrink-0'>
            <PlayerStats level={57} xp={75} energy={energy} maxEnergy={MAX_ENERGY} gems={gems} />
            <Button variant="secondary" size="icon" className='h-14 w-14 rounded-2xl flex-shrink-0' onClick={() => setIsShopOpen(true)}>
                <ShoppingCart className="h-7 w-7" />
            </Button>
          </div>

          <div className='w-full my-2'>
              <OrderDisplay orders={orders} onDeliverOrder={handleDeliverOrder} />
          </div>
          
          <div className="flex-grow flex flex-col items-center justify-center w-full min-h-0">
            <MergeBoard
              board={board}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onItemClick={handleItemClick}
              mergingIndex={mergingIndex}
              appearingIndex={appearingIndex}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
