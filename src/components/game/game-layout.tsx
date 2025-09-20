'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from './game-header';
import MergeBoard from './merge-board';
import type { BoardSlot, Item, ItemType, Order } from '@/lib/types';
import { ITEMS, MERGE_RULES, INITIAL_ORDERS } from '@/lib/game-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { ShoppingCart, BookOpen, PlusCircle } from 'lucide-react';
import PlayerStats from './player-stats';
import OrderDisplay from './order-display';
import ShopDialog from './shop-dialog';
import GameBackground from './game-background';
import Link from 'next/link';
import GeneratorControls from './generator-controls';

const BOARD_SIZE = 56; // 7 columns x 8 rows
const ENERGY_REGEN_RATE = 1.5 * 60 * 1000; // 1.5 minutes in ms
const MAX_ENERGY = 100;
const ENERGY_COST_PER_ITEM = 10;
const GEMS_PER_LEVEL = 5;

const initialBoard: BoardSlot[] = Array.from({ length: BOARD_SIZE }, (_, i) => ({
  id: `cell-${i}`,
  item: null,
}));
initialBoard[0] = { ...initialBoard[0], item: ITEMS['animals_1'] };
initialBoard[1] = { ...initialBoard[1], item: ITEMS['animals_1'] };
initialBoard[2] = { ...initialBoard[2], item: ITEMS['food_1'] };

export default function GameLayout() {
  const [board, setBoard] = useState<BoardSlot[]>(initialBoard);
  const [mergingIndex, setMergingIndex] = useState<number | null>(null);
  const [appearingIndex, setAppearingIndex] = useState<number | null>(null);
  const [energy, setEnergy] = useState(80);
  const [gems, setGems] = useState(25);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isShopOpen, setIsShopOpen] = useState(false);
  
  const [selectedGenerator, setSelectedGenerator] = useState<ItemType>('animals');
  const [multiplier, setMultiplier] = useState<1 | 2 | 4>(1);

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
              <BookOpen className="mr-2 h-4 w-4 text-primary" /> ¡Creaste un {newItem.name}! {newItem.emoji}
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
  
  const placeNewItem = useCallback((itemId: string) => {
    let placed = false;
    setBoard(currentBoard => {
        const emptySlotIndex = currentBoard.findIndex(slot => !slot.item);
        if (emptySlotIndex !== -1) {
            const newBoard = [...currentBoard];
            const itemToGenerate = ITEMS[itemId];
            
            if (itemToGenerate) {
                newBoard[emptySlotIndex] = {...newBoard[emptySlotIndex], item: itemToGenerate};
                setAppearingIndex(emptySlotIndex);
                setTimeout(() => setAppearingIndex(null), 500);
                placed = true;
                return newBoard;
            }
        }
        return currentBoard;
    });
    return placed;
  }, []);

  const handleGenerateItem = () => {
    const totalCost = ENERGY_COST_PER_ITEM * multiplier;
    if (energy < totalCost) {
      toast({ variant: "destructive", title: "¡No hay suficiente energía!", description: `Necesitas ${totalCost} de energía.` });
      return;
    }

    let itemsGenerated = 0;
    for (let i = 0; i < multiplier; i++) {
        const success = placeNewItem(`${selectedGenerator}_1`);
        if (success) {
            itemsGenerated++;
        } else {
            toast({ variant: "destructive", title: "¡Tablero lleno!", description: "Libera algo de espacio." });
            break; 
        }
    }

    if (itemsGenerated > 0) {
        setEnergy(e => e - (ENERGY_COST_PER_ITEM * itemsGenerated));
        const item = ITEMS[`${selectedGenerator}_1`];
        toast({ title: "¡Nuevos objetos generados!", description: `Creaste ${itemsGenerated} x ${item.name} ${item.emoji}` });
    }
  };

  const cycleMultiplier = () => {
    setMultiplier(m => {
        if (m === 1) return 2;
        if (m === 2) return 4;
        return 1;
    });
  };
  
  useEffect(() => {
    const checkOrders = () => {
      const boardItems = new Map<string, number>();
      board.forEach((slot, index) => {
        if (slot.item) {
          boardItems.set(slot.item.id, index);
        }
      });

      let ordersCompleted = false;
      const updatedOrders = [...orders];
      const completedOrderIds = new Set<string>();

      updatedOrders.forEach(order => {
        if (completedOrderIds.has(order.id)) return;

        const requiredItem = order.requiredItems[0]; // Assuming one item per order for now
        if (boardItems.has(requiredItem.itemId)) {
          const itemIndex = boardItems.get(requiredItem.itemId)!;
          const deliveredItem = board[itemIndex].item!;
          const reward = deliveredItem.level * GEMS_PER_LEVEL;

          setGems(g => g + reward);
          setBoard(b => {
            const newBoard = [...b];
            newBoard[itemIndex] = { ...newBoard[itemIndex], item: null };
            return newBoard;
          });
          
          toast({
            title: "¡Orden Completada!",
            description: `¡Entregaste un ${deliveredItem.name} y ganaste ${reward} gemas!`,
          });
          
          completedOrderIds.add(order.id);
          ordersCompleted = true;
        }
      });

      if (ordersCompleted) {
        setOrders(currentOrders => currentOrders.filter(o => !completedOrderIds.has(o.id)));
      }
    };

    checkOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);


  const purchaseGems = (amount: number, price: string) => {
    toast({
        title: "Procesando compra...",
        description: `Iniciando pago seguro para ${amount} gemas.`
    });

    setTimeout(() => {
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
        onGenerateItem={placeNewItem}
        onSpendGems={spendGems}
        gems={gems}
      />
      <main className="relative z-10 pt-16 flex flex-col lg:grid lg:grid-cols-12 gap-4 p-2 sm:p-4 flex-grow overflow-hidden">
        
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            <Button asChild size="lg" className="h-20 text-lg">
                <Link href="/story" className='flex-col'>
                    <BookOpen className="w-8 h-8 mb-1" />
                    Historia
                </Link>
            </Button>
          <OrderDisplay orders={orders} />
        </div>

        <div className="lg:col-span-9 flex flex-col items-center gap-4 flex-grow min-h-0">
          
          <div className='w-full flex items-center justify-center gap-2 px-1 flex-shrink-0'>
            <PlayerStats level={57} xp={75} energy={energy} maxEnergy={MAX_ENERGY} gems={gems} />
            <Button variant="secondary" size="icon" className='h-14 w-14 rounded-2xl flex-shrink-0' onClick={() => setIsShopOpen(true)}>
                <ShoppingCart className="h-7 w-7" />
            </Button>
          </div>

          <div className='lg:hidden w-full my-2'>
              <OrderDisplay orders={orders} />
          </div>
          
          <div className="flex-grow flex flex-col items-center justify-center w-full min-h-0">
            <MergeBoard
              board={board}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              mergingIndex={mergingIndex}
              appearingIndex={appearingIndex}
            />
          </div>
          
          <div className='flex items-center justify-between gap-4 w-full max-w-2xl mx-auto'>
            <GeneratorControls
                selectedType={selectedGenerator}
                onTypeSelect={setSelectedGenerator}
            />
            <div className='flex items-center gap-2'>
                <Button
                    variant="outline"
                    onClick={cycleMultiplier}
                    className="w-20 font-bold text-lg"
                >
                    x{multiplier}
                </Button>
                <Button size="lg" className="w-full" onClick={handleGenerateItem}>
                    <PlusCircle className="mr-2"/>
                    Añadir Ítem ({ENERGY_COST_PER_ITEM * multiplier})
                </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
