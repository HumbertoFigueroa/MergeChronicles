'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MergeBoard from './merge-board';
import type { BoardSlot, Item, Order, ItemType } from '@/lib/types';
import { ITEMS, MERGE_RULES } from '@/lib/game-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import PlayerStats from './player-stats';
import OrderDisplay from './order-display';
import ShopDialog from './shop-dialog';
import GameBackground from './game-background';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '../ui/badge';

const BOARD_SIZE = 56; // 7 columns x 8 rows
export const ENERGY_REGEN_RATE = 1.5 * 60 * 1000; // 1.5 minutes in ms
export const MAX_ENERGY = 100;
const ENERGY_COST_PER_ITEM = 1;
const GEMS_PER_LEVEL = 5;
const MAX_ORDERS = 3;

const CUSTOMER_EMOJIS = ['👩‍🌾', '🍓', '🧑‍🎨', '🐮', '🛹', '🧑‍⚕️', '🐖', '🍊', '👘', '🚲', '🧑‍🌾', '🐑', '🍌', '🚌', '👠', '🧑‍🍳', '🐕', '🍍', '🧑‍🔬', '👔', '🐈', '✈️', '🍎', '🧑‍🚀', '🐎', '🧤', '🍐', '🚀', '🐘', '🧑‍🚒', '🧥', '🍑'];

const initialBoard: BoardSlot[] = Array.from({ length: BOARD_SIZE }, (_, i) => ({
  id: `cell-${i}`,
  item: null,
}));

initialBoard[2] = { ...initialBoard[2], item: ITEMS['generator_animals'] };
initialBoard[3] = { ...initialBoard[3], item: ITEMS['generator_food'] };
initialBoard[4] = { ...initialBoard[4], item: ITEMS['generator_clothing'] };
initialBoard[10] = { ...initialBoard[10], item: ITEMS['generator_professions'] };
initialBoard[11] = { ...initialBoard[11], item: ITEMS['generator_vehicles'] };


type Multiplier = 1 | 2 | 4;

const getXpNeededForLevel = (level: number): number => {
    if (level === 1) return 10;
    
    let xpNeeded = 10; // XP for level 1 to reach 2
    let currentLevel = 1;

    while (currentLevel < level) {
        currentLevel++;
        if (currentLevel <= 2) {
             xpNeeded = 12;
        } else if (currentLevel <= 10) {
            xpNeeded += 2;
        } else if (currentLevel <= 30) {
            xpNeeded += 3;
        } else if (currentLevel <= 50) {
            xpNeeded += 4;
        } else {
            xpNeeded += 5;
        }
    }
    
    // The loop calculates the XP needed to REACH the next level, so we need a special calculation for returning the value for the current level.
    if (level === 2) return 12;

    let baseXP = 10;
    let nextLevelXP = 12;
    for (let l = 2; l < level; l++) {
      baseXP = nextLevelXP;
      if (l < 10) {
        nextLevelXP += 2;
      } else if (l < 30) {
        nextLevelXP += 3;
      } else if (l < 50) {
        nextLevelXP += 4;
      } else {
        nextLevelXP += 5;
      }
    }
    return level > 1 ? nextLevelXP : 10;
};

const getRandomItemForMultiplier = (multiplier: Multiplier, itemType: ItemType): string => {
    const rand = Math.random();

    if (multiplier === 1) { // 80% Lvl 1, 20% Lvl 2
        const level = rand < 0.8 ? 1 : 2;
        return `${itemType}_${level}`;
    }
    
    if (multiplier === 2) { // 10% Lvl 1, 70% Lvl 2, 20% Lvl 3
        if (rand < 0.1) return `${itemType}_1`;
        if (rand < 0.8) return `${itemType}_2`; // 0.1 + 0.7
        return `${itemType}_3`;
    }

    if (multiplier === 4) { // 10% Lvl 3, 50% Lvl 4, 25% Lvl 5, 15% Lvl 6
        if (rand < 0.1) return `${itemType}_3`;
        if (rand < 0.6) return `${itemType}_4`; // 0.1 + 0.5
        if (rand < 0.85) return `${itemType}_5`; // 0.6 + 0.25
        return `${itemType}_6`;
    }

    // Default fallback to level 1, should not be reached
    return `${itemType}_1`;
};


export default function GameLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [level, setLevel] = useState(() => searchParams.get('level') ? parseInt(searchParams.get('level')!, 10) : 1);
  const [xp, setXp] = useState(() => searchParams.get('xp') ? parseInt(searchParams.get('xp')!, 10) : 0);
  const [energy, setEnergy] = useState(() => searchParams.get('energy') ? parseInt(searchParams.get('energy')!, 10) : 100);
  const [gems, setGems] = useState(() => searchParams.get('gems') ? parseInt(searchParams.get('gems')!, 10) : 25);
  const [unlockedStoryParts, setUnlockedStoryParts] = useState(() => searchParams.get('unlocked') ? parseInt(searchParams.get('unlocked')!, 10) : 1);

  const [board, setBoard] = useState<BoardSlot[]>(initialBoard);
  const [mergingIndex, setMergingIndex] = useState<number | null>(null);
  const [appearingIndex, setAppearingIndex] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [selectedGeneratorType, setSelectedGeneratorType] = useState<ItemType>('animals');
  const [multiplier, setMultiplier] = useState<Multiplier>(1);

  const { toast } = useToast();
  
  const xpNeeded = getXpNeededForLevel(level);

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

  const addXp = (amount: number) => {
    setXp(currentXp => {
      let newXp = currentXp + amount;
      let newLevel = level;
      let xpForNext = getXpNeededForLevel(newLevel);
      
      while (newXp >= xpForNext) {
        newXp -= xpForNext;
        newLevel++;
        setGems(currentGems => currentGems + GEMS_PER_LEVEL * newLevel);
        toast({
          title: "¡Subiste de nivel!",
          description: `¡Alcanzaste el nivel ${newLevel}! Has ganado ${GEMS_PER_LEVEL * newLevel} gemas.`,
        });
        xpForNext = getXpNeededForLevel(newLevel);
      }
      
      setLevel(newLevel);
      return newXp;
    });
  };

  const generateNewOrder = useCallback(() => {
    let minItemLevel = 1;
    let maxItemLevel = 4;

    if (level >= 5 && level <= 9) {
        minItemLevel = 3;
        maxItemLevel = 6;
    } else if (level >= 10 && level <= 14) {
        minItemLevel = 3;
        maxItemLevel = 8;
    } else if (level >= 15 && level <= 19) {
        minItemLevel = 3;
        maxItemLevel = 10;
    } else if (level >= 20 && level <= 29) {
        minItemLevel = 4;
        maxItemLevel = 11;
    } else if (level >= 30) {
        minItemLevel = 4;
        maxItemLevel = 12;
    }

    const availableItems = Object.values(ITEMS).filter(item => 
        !item.isGenerator && item.level >= minItemLevel && item.level <= maxItemLevel
    );

    if (availableItems.length === 0) return null;

    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    const randomCustomer = CUSTOMER_EMOJIS[Math.floor(Math.random() * CUSTOMER_EMOJIS.length)];
    
    const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random()}`,
        customerEmoji: randomCustomer,
        requiredItems: [{ itemId: randomItem.id, quantity: 1 }],
    };

    return newOrder;
  }, [level]);

  useEffect(() => {
    setOrders(currentOrders => {
      const newOrders = [...currentOrders];
      while (newOrders.length < MAX_ORDERS) {
          const newOrder = generateNewOrder();
          if (newOrder) {
              newOrders.push(newOrder);
          } else {
              break; 
          }
      }
      return newOrders;
    });
  }, [level, orders.length, generateNewOrder]);


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

    if (!sourceItem.isGenerator && !targetItem.isGenerator && sourceItem.id === targetItem.id && MERGE_RULES[sourceItem.id]) {
      const newItemId = MERGE_RULES[sourceItem.id];
      const newItem = ITEMS[newItemId];

      if (newItem) {
        newBoard[targetIndex] = { ...targetSlot, item: newItem };
        newBoard[sourceIndex] = { ...sourceSlot, item: null };

        setMergingIndex(targetIndex);
        setTimeout(() => setMergingIndex(null), 400);

        setBoard(newBoard);
        addXp(sourceItem.level); // Grant XP on merge

        toast({
          title: "¡Fusión Exitosa!",
          description: (
            <div className="flex items-center">
              ¡Creaste un {newItem.name}! {newItem.emoji}
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
  
  const placeNewItem = useCallback((itemId: string, preferredIndex?: number): boolean => {
    let placed = false;
    let placedIndex = -1;
    
    setBoard(currentBoard => {
      const newBoard = [...currentBoard];
      const itemToPlace = ITEMS[itemId];
      if (!itemToPlace) {
        placed = false;
        return currentBoard;
      }

      if (preferredIndex !== undefined) {
        const adjacentIndexes = [
          preferredIndex - 7, preferredIndex + 7,
          (preferredIndex % 7 !== 0) ? preferredIndex - 1 : -1,
          ((preferredIndex + 1) % 7 !== 0) ? preferredIndex + 1 : -1,
        ].filter(i => i >= 0 && i < BOARD_SIZE && !newBoard[i].item);
        
        if (adjacentIndexes.length > 0) {
          const index = adjacentIndexes[Math.floor(Math.random() * adjacentIndexes.length)];
          newBoard[index] = {...newBoard[index], item: itemToPlace};
          placedIndex = index;
          placed = true;
          return newBoard;
        }
      }

      const emptySlotIndex = newBoard.findIndex(slot => !slot.item);
      if (emptySlotIndex !== -1) {
        newBoard[emptySlotIndex] = {...newBoard[emptySlotIndex], item: itemToPlace};
        placedIndex = emptySlotIndex;
        placed = true;
        return newBoard;
      }
      
      placed = false;
      return currentBoard;
    });

    if (placed && placedIndex !== -1) {
        setAppearingIndex(placedIndex);
        setTimeout(() => setAppearingIndex(null), 500);
        return true;
    }
    
    return placed;
  }, []);

  const handleGeneratorClick = (index: number) => {
    const clickedItem = board[index].item;
    if (!clickedItem || !clickedItem.isGenerator) {
        if(clickedItem?.isGenerator) {
            setSelectedGeneratorType(clickedItem.type);
        }
        return;
    };
    
    if (clickedItem.type !== selectedGeneratorType) {
        setSelectedGeneratorType(clickedItem.type);
        return;
    }

    const totalEnergyCost = ENERGY_COST_PER_ITEM * multiplier;
    if (energy < totalEnergyCost) {
      return;
    }

    setEnergy(e => e - totalEnergyCost);

    for (let i = 0; i < multiplier; i++) {
        const itemToGenerateId = getRandomItemForMultiplier(multiplier, clickedItem.type);
        const success = placeNewItem(itemToGenerateId, index);
        if (!success) {
            break; 
        }
    }
  };
  
  const handleDeliverOrder = (orderId: string) => {
    const orderToDeliver = orders.find(o => o.id === orderId);
    if (!orderToDeliver) return;

    const requiredItemId = orderToDeliver.requiredItems[0].itemId;
    const itemIndexOnBoard = board.findIndex(slot => slot.item?.id === requiredItemId);

    if (itemIndexOnBoard !== -1) {
      const deliveredItem = board[itemIndexOnBoard].item!;
      const gemReward = deliveredItem.level * GEMS_PER_LEVEL;
      const xpReward = deliveredItem.level;

      setGems(g => g + gemReward);
      addXp(xpReward);

      setBoard(b => {
        const newBoard = [...b];
        newBoard[itemIndexOnBoard] = { ...newBoard[itemIndexOnBoard], item: null };
        return newBoard;
      });
      
      setOrders(currentOrders => currentOrders.filter(o => o.id !== orderId));
      
      toast({
        title: "¡Orden Completada!",
        description: `¡Entregaste un ${deliveredItem.name}! Ganaste ${gemReward} gemas y ${xpReward} XP.`,
      });
    }
  };

  useEffect(() => {
    const boardItemIds = new Set(board.map(slot => slot.item?.id).filter(Boolean));
    setOrders(currentOrders => 
      currentOrders.map(order => ({ ...order, isCompletable: order.requiredItems.every(req => boardItemIds.has(req.itemId)) }))
    );
  }, [board]);

  const purchaseGems = (amount: number, price: string) => {
    toast({
        variant: "destructive",
        title: "¡Función deshabilitada!",
        description: `La compra de gemas está desactivada en esta versión.`
    });
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

  const createStoryLink = () => {
    const params = new URLSearchParams();
    params.set('level', level.toString());
    params.set('xp', xp.toString());
    params.set('energy', energy.toString());
    params.set('gems', gems.toString());
    params.set('unlocked', unlockedStoryParts.toString());
    return `/story?${params.toString()}`;
  }

  const toggleMultiplier = () => {
    setMultiplier(m => {
        if (m === 1) return 2;
        if (m === 2) return 4;
        return 1;
    });
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      <GameBackground />
      <ShopDialog 
        isOpen={isShopOpen} 
        onOpenChange={setIsShopOpen}
        onPurchaseGems={purchaseGems}
        onAddEnergy={addEnergy}
        onSpendGems={spendGems}
        gems={gems}
      />
      <main className="relative z-10 pt-4 flex flex-col lg:flex-row gap-4 p-2 sm:p-4 flex-grow overflow-hidden">
        
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
            <Button asChild size="lg" className="h-20 text-lg">
                <Link href={createStoryLink()} className='flex-col'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mb-1"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    Historia
                </Link>
            </Button>
        </div>

        <div className="flex flex-col items-center gap-4 flex-grow min-h-0 w-full lg:col-span-9">
          
          <div className='w-full flex items-center justify-center gap-2 px-1 flex-shrink-0'>
            <PlayerStats level={level} xp={xp} xpNeeded={xpNeeded} energy={energy} maxEnergy={MAX_ENERGY} gems={gems} />
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
              onItemClick={handleGeneratorClick}
              mergingIndex={mergingIndex}
              appearingIndex={appearingIndex}
              selectedGeneratorType={selectedGeneratorType}
            />
          </div>

          <div className='w-full flex items-center justify-between gap-2 mt-4 px-2'>
              <ToggleGroup type="single" value={selectedGeneratorType} onValueChange={(value: ItemType) => value && setSelectedGeneratorType(value)} className='gap-1.5'>
                  <ToggleGroupItem value="animals" aria-label="Toggle Animals" className='w-12 h-12 text-2xl rounded-xl'>
                      {ITEMS.generator_animals.emoji}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="vehicles" aria-label="Toggle Vehicles" className='w-12 h-12 text-2xl rounded-xl'>
                      {ITEMS.generator_vehicles.emoji}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="professions" aria-label="Toggle Professions" className='w-12 h-12 text-2xl rounded-xl'>
                      {ITEMS.generator_professions.emoji}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="clothing" aria-label="Toggle Clothing" className='w-12 h-12 text-2xl rounded-xl'>
                      {ITEMS.generator_clothing.emoji}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="food" aria-label="Toggle Food" className='w-12 h-12 text-2xl rounded-xl'>
                      {ITEMS.generator_food.emoji}
                  </ToggleGroupItem>
              </ToggleGroup>

              <div className='flex items-center gap-2'>
                  <Button onClick={toggleMultiplier} variant='secondary' size='icon' className='w-14 h-14 rounded-2xl'>
                      <Badge className='text-lg'>x{multiplier}</Badge>
                  </Button>
              </div>
          </div>

        </div>
      </main>
    </div>
  );
}

    