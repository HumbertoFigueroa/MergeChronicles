'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import MergeBoard from './merge-board';
import type { BoardSlot, Item, Order, ItemType } from '@/lib/types';
import { ITEMS, MERGE_RULES } from '@/lib/game-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Lock, ShoppingCart } from 'lucide-react';
import PlayerStats from './player-stats';
import OrderDisplay from './order-display';
import ShopDialog from './shop-dialog';
import GameBackground from './game-background';
import { useSearchParams } from 'next/navigation';
import { Badge } from '../ui/badge';
import GhostItem from './ghost-item';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '../ui/toaster';

const BOARD_SIZE = 56; // 7 columns x 8 rows
export const ENERGY_REGEN_RATE = 1.5 * 60 * 1000; // 1.5 minutes in ms
export const MAX_ENERGY = 100;
const ENERGY_COST_PER_ITEM = 1;
const GEMS_PER_LEVEL_UP = 5;
const MAX_ORDERS = 3;

const CUSTOMER_EMOJIS = ['👩‍🌾', '🍓', '🧑‍🎨', '🐮', '🛹', '🧑‍⚕️', '🐖', '🍊', '👘', '🚲', '🧑‍🌾', '🐑', '🍌', '🚌', '👠', '🧑‍🍳', '🐕', '🍍', '🧑‍🔬', '👔', '🐈', '✈️', '🍎', '🧑‍🚀', '🐎', '🧤', '🍐', '🚀', '🐘', '🧑‍🚒', '🧥', '🍑'];

const initialBoard: BoardSlot[] = Array.from({ length: BOARD_SIZE }, (_, i) => ({
  id: `cell-${i}`,
  item: null,
}));

const GENERATOR_UNLOCKS: { [key: string]: { level: number, position: number } } = {
  'generator_animals': { level: 1, position: 2 },
  'generator_food': { level: 3, position: 3 },
  'generator_clothing': { level: 10, position: 4 },
  'generator_professions': { level: 20, position: 10 },
  'generator_vehicles': { level: 30, position: 11 },
};

type Multiplier = 1 | 2 | 4;

const getXpNeededForLevel = (level: number): number => {
    if (level === 1) return 10;

    let xpNeeded = 10;
    for (let l = 2; l <= level; l++) {
        if (l <= 10) {
            xpNeeded += 2;
        } else if (l <= 30) {
            xpNeeded += 3;
        } else if (l <= 50) {
            xpNeeded += 4;
        } else {
            xpNeeded += 5;
        }
    }
    return xpNeeded;
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
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const [level, setLevel] = useState(() => searchParams.get('level') ? parseInt(searchParams.get('level')!, 10) : 1);
  const [xp, setXp] = useState(() => searchParams.get('xp') ? parseInt(searchParams.get('xp')!, 10) : 0);
  const [energy, setEnergy] = useState(() => searchParams.get('energy') ? parseInt(searchParams.get('energy')!, 10) : 100);
  const [gems, setGems] = useState(() => searchParams.get('gems') ? parseInt(searchParams.get('gems')!, 10) : 25);
  
  const [board, setBoard] = useState<BoardSlot[]>(initialBoard);
  const [mergingIndex, setMergingIndex] = useState<number | null>(null);
  const [appearingIndex, setAppearingIndex] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [multiplier, setMultiplier] = useState<Multiplier>(1);

  const [draggedItem, setDraggedItem] = useState<{ item: Item; index: number } | null>(null);
  const [ghostPosition, setGhostPosition] = useState<{ x: number; y: number } | null>(null);
  const [draggedItemHidden, setDraggedItemHidden] = useState(false);

  const { toast } = useToast();
  
  const xpNeeded = getXpNeededForLevel(level);

  const placeNewItem = (boardState: BoardSlot[], itemId: string, preferredIndex?: number): { newBoard: BoardSlot[], success: boolean, placedIndex: number | null } => {
    const newBoard = [...boardState];
    const itemToPlace = ITEMS[itemId];
    if (!itemToPlace) {
      return { newBoard: boardState, success: false, placedIndex: null };
    }
  
    const findEmptySlot = (startIndex?: number): number => {
      // Try adjacent slots first
      if (startIndex !== undefined) {
        const adjacentIndexes = [
          startIndex - 7, startIndex + 7, // Up, Down
          (startIndex % 7 !== 0) ? startIndex - 1 : -1, // Left
          ((startIndex + 1) % 7 !== 0) ? startIndex + 1 : -1, // Right
        ].filter(i => i >= 0 && i < BOARD_SIZE && !newBoard[i].item);
        
        if (adjacentIndexes.length > 0) {
          return adjacentIndexes[Math.floor(Math.random() * adjacentIndexes.length)];
        }
      }
      
      // Find any empty slot
      const emptyIndex = newBoard.findIndex(slot => !slot.item);
      return emptyIndex;
    };
  
    const emptySlotIndex = findEmptySlot(preferredIndex);
  
    if (emptySlotIndex !== -1) {
      newBoard[emptySlotIndex] = {...newBoard[emptySlotIndex], item: itemToPlace};
      return { newBoard, success: true, placedIndex: emptySlotIndex };
    }
    
    return { newBoard: boardState, success: false, placedIndex: null };
  };

  useEffect(() => {
    setBoard(currentBoard => {
      let currentGenerators = new Set(currentBoard.map(slot => slot.item?.id).filter(id => id?.startsWith('generator_')));
      const newBoard = [...currentBoard];
      let boardChanged = false;

      // Ensure only one animal generator exists at the start
      const animalGenerators = newBoard.map((slot, index) => ({...slot, index})).filter(slot => slot.item?.id === 'generator_animals');
      if (animalGenerators.length > 1) {
        // Keep the one at the correct position if it exists, otherwise the first one.
        const correctPosAnimalGen = animalGenerators.find(g => g.index === GENERATOR_UNLOCKS['generator_animals'].position);
        let toKeep = correctPosAnimalGen || animalGenerators[0];
        
        animalGenerators.forEach(gen => {
          if (gen.index !== toKeep.index) {
            newBoard[gen.index].item = null;
            boardChanged = true;
          }
        });
        // After cleanup, our generator set might be outdated, so we rebuild it
        currentGenerators = new Set(newBoard.map(slot => slot.item?.id).filter(id => id?.startsWith('generator_')));
      }

      Object.entries(GENERATOR_UNLOCKS).forEach(([generatorId, unlock]) => {
        if (level >= unlock.level && !currentGenerators.has(generatorId)) {
          let placed = false;
          // Try to place at predefined position first
          if (!newBoard[unlock.position].item) {
            newBoard[unlock.position].item = ITEMS[generatorId];
            placed = true;
          } else {
            // If occupied, find any other empty spot
            const emptySpot = newBoard.findIndex(slot => !slot.item);
            if (emptySpot !== -1) {
              newBoard[emptySpot].item = ITEMS[generatorId];
              placed = true;
            }
          }
          if (placed) {
            boardChanged = true;
          }
        }
      });
      return boardChanged ? newBoard : currentBoard;
    });
  
  }, [level]);

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
      let hasLeveledUp = false;
      let gemsEarnedOnLevelUp = 0;
      
      while (newXp >= xpForNext) {
        newXp -= xpForNext;
        newLevel++;
        hasLeveledUp = true;
        gemsEarnedOnLevelUp += GEMS_PER_LEVEL_UP;
        xpForNext = getXpNeededForLevel(newLevel);
      }
      
      if (hasLeveledUp) {
        setGems(currentGems => currentGems + gemsEarnedOnLevelUp);
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

    const availableGenerators = Object.keys(GENERATOR_UNLOCKS).filter(genId => level >= GENERATOR_UNLOCKS[genId].level);
    const availableItemTypes = availableGenerators.map(genId => ITEMS[genId].type);

    const availableItems = Object.values(ITEMS).filter(item => 
        !item.isGenerator && 
        item.level >= minItemLevel && 
        item.level <= maxItemLevel &&
        availableItemTypes.includes(item.type)
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
    if (orders.length < MAX_ORDERS) {
      const newOrder = generateNewOrder();
      if (newOrder) {
        setOrders(currentOrders => [...currentOrders, newOrder]);
      }
    }
  }, [level, orders.length, generateNewOrder]);

  const handleDrop = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;
  
    setBoard(currentBoard => {
      const newBoard = [...currentBoard];
      const sourceSlot = newBoard[sourceIndex];
      if (!sourceSlot || !sourceSlot.item) return newBoard;
    
      const targetSlot = newBoard[targetIndex];
    
      if (!targetSlot.item) {
        // Move to empty slot
        newBoard[targetIndex] = { ...targetSlot, item: sourceSlot.item };
        newBoard[sourceIndex] = { ...sourceSlot, item: null };
      } else {
        const sourceItem = sourceSlot.item;
        const targetItem = targetSlot.item;
    
        if (!sourceItem.isGenerator && !targetItem.isGenerator && sourceItem.id === targetItem.id && MERGE_RULES[sourceItem.id]) {
          // Merge items
          const newItemId = MERGE_RULES[sourceItem.id];
          const newItem = ITEMS[newItemId];
    
          if (newItem) {
            newBoard[targetIndex] = { ...targetSlot, item: newItem };
            newBoard[sourceIndex] = { ...sourceSlot, item: null };
    
            setMergingIndex(targetIndex);
            setTimeout(() => setMergingIndex(null), 400);
          }
        } else {
          // Swap items
          newBoard[targetIndex] = { ...targetSlot, item: sourceItem };
          newBoard[sourceIndex] = { ...sourceSlot, item: targetItem };
        }
      }
      return newBoard;
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('sourceIndex', index.toString());
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData('sourceIndex');
    if (sourceIndexStr === null) return;
    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (isNaN(sourceIndex)) return;
    handleDrop(sourceIndex, targetIndex);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, index: number) => {
    const item = board[index].item;
    if (item && !item.isGenerator) {
        setDraggedItem({ item, index });
        setDraggedItemHidden(true);
        const touch = e.touches[0];
        setGhostPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (draggedItem) {
        const touch = e.touches[0];
        setGhostPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (draggedItem) {
        const touch = e.changedTouches[0];
        const dropTargetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        
        const getSlotIndexFromElement = (el: Element | null): number => {
            if (!el) return -1;
            const slotDiv = el.closest('[data-slot-id]');
            if (slotDiv) {
                const slotId = slotDiv.getAttribute('data-slot-id');
                const match = slotId?.match(/cell-(\d+)/);
                if (match && match[1]) {
                    return parseInt(match[1], 10);
                }
            }
            return -1;
        };

        const targetIndex = getSlotIndexFromElement(dropTargetElement);
        
        if (targetIndex !== -1 && targetIndex !== draggedItem.index) {
            handleDrop(draggedItem.index, targetIndex);
        }
        
        setDraggedItem(null);
        setGhostPosition(null);
        setDraggedItemHidden(false);
    }
  };

  const handleItemClick = (index: number) => {
    const clickedItem = board[index].item;
    if (!clickedItem || !clickedItem.isGenerator) {
      return;
    }
  
    const totalEnergyCost = ENERGY_COST_PER_ITEM * multiplier;
    if (energy < totalEnergyCost) {
      toast({
        variant: 'destructive',
        title: '¡No hay suficiente energía!',
        description: `Necesitas ${totalEnergyCost} de energía para esta acción.`,
      });
      return;
    }
  
    let tempBoard = [...board];
    let itemsGenerated = 0;
    
    // Check for space BEFORE spending energy
    const emptySlots = tempBoard.filter(slot => !slot.item).length;
    if (emptySlots < multiplier) {
        toast({
            variant: 'destructive',
            title: '¡Tablero Lleno!',
            description: 'No hay espacio para generar más objetos.',
        });
        return;
    }
    
    setEnergy(e => e - totalEnergyCost);
  
    for (let i = 0; i < multiplier; i++) {
      const itemId = getRandomItemForMultiplier(multiplier, clickedItem.type);
      const { newBoard, success, placedIndex } = placeNewItem(tempBoard, itemId, index);
      
      tempBoard = newBoard;
  
      if (success && placedIndex !== null) {
        itemsGenerated++;
        // We use a timeout to show multiple appearing animations in sequence
        setTimeout(() => {
          setAppearingIndex(placedIndex);
          setTimeout(() => setAppearingIndex(null), 500);
        }, i * 100);
      } else {
        // This part should ideally not be reached due to the initial check, but as a safeguard:
        toast({
            variant: 'destructive',
            title: '¡Tablero Lleno!',
            description: 'No hay espacio para generar más objetos.',
        });
        // If we failed to place an item, we should stop trying to place more.
        break; 
      }
    }
  
    setBoard(tempBoard);
  };
  
  const handleDeliverOrder = (orderId: string) => {
    const orderToDeliver = orders.find(o => o.id === orderId);
    if (!orderToDeliver) return;

    const requiredItemId = orderToDeliver.requiredItems[0].itemId;
    const itemIndexOnBoard = board.findIndex(slot => slot.item?.id === requiredItemId);

    if (itemIndexOnBoard !== -1) {
      const deliveredItem = board[itemIndexOnBoard].item!;
      
      const xpReward = deliveredItem.level; 
      addXp(xpReward);

      // Gem reward logic
      const gemRewardChance = Math.random();
      if (gemRewardChance > 0.3) { // 70% chance to get gems
        const gemAmount = Math.floor(deliveredItem.level / 2);
        if (gemAmount > 0) {
          setGems(g => g + gemAmount);
        }
      }

      setBoard(b => {
        const newBoard = [...b];
        newBoard[itemIndexOnBoard] = { ...newBoard[itemIndexOnBoard], item: null };
        return newBoard;
      });
      
      setOrders(currentOrders => {
        const updatedOrders = currentOrders.filter(o => o.id !== orderId);
        const newOrder = generateNewOrder();
        if (newOrder) {
          updatedOrders.push(newOrder);
        }
        return updatedOrders;
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
  };
  
  const spendGems = (amount: number): boolean => {
    if (gems >= amount) {
        setGems(g => g - amount);
        return true;
    }
    toast({ variant: 'destructive', title: '¡No hay suficientes gemas!', description: 'Necesitas más gemas para hacer esta compra.' });
    return false;
  }

  const toggleMultiplier = () => {
      setMultiplier(m => {
          if (m === 1) {
              if (level >= 10) return 2;
              toast({ title: "Multiplicador Bloqueado", description: "Alcanza el nivel 10 para desbloquear x2.", variant: "destructive" });
              return 1;
          }
          if (m === 2) {
              if (level >= 30) return 4;
              toast({ title: "Multiplicador Bloqueado", description: "Alcanza el nivel 30 para desbloquear x4.", variant: "destructive" });
              return 2;
          }
          return 1; // From x4, loop back to x1
      });
  };

  return (
    <div 
        className="relative min-h-screen w-full flex flex-col"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
      <GameBackground />
      <Toaster />
      {draggedItem && ghostPosition && <GhostItem item={draggedItem.item} position={ghostPosition} />}

      <ShopDialog 
        isOpen={isShopOpen} 
        onOpenChange={setIsShopOpen}
        onPurchaseGems={purchaseGems}
        onAddEnergy={addEnergy}
        onSpendGems={spendGems}
        gems={gems}
      />
      
      <main className="relative z-10 pt-4 flex flex-col lg:flex-row gap-4 p-2 sm:p-4 flex-grow overflow-hidden">
        
        <div className="hidden lg:flex lg:w-64 flex-col gap-4">
            <Button size="lg" className="h-20 text-lg" disabled>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mb-1 mx-auto"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    Historia
                    <span className="text-xs font-normal block">(Próximamente)</span>
                </div>
            </Button>
        </div>

        <div className="flex flex-col items-center gap-4 flex-grow min-h-0 w-full">
          
          <div className='w-full flex items-start justify-center gap-2 px-1 flex-shrink-0'>
             <div className="flex flex-col items-center">
                <PlayerStats 
                    level={level} 
                    xp={xp} 
                    xpNeeded={xpNeeded} 
                    energy={energy} 
                    maxEnergy={MAX_ENERGY} 
                    gems={gems}
                    isMobile={isMobile}
                />
                <Button onClick={toggleMultiplier} variant='secondary' size='sm' className='h-8 w-16 rounded-xl relative mt-2'>
                    <Badge className='text-sm'>x{multiplier}</Badge>
                    {(level < 10 && multiplier === 1) || (level < 30 && multiplier === 2) ? (
                      <div className='absolute -top-1 -right-1 p-1 bg-gray-600 rounded-full'>
                          <Lock className='w-2 h-2 text-white' />
                      </div>
                    ) : null}
                </Button>
            </div>
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
              onDrop={handleDragDrop}
              onItemClick={handleItemClick}
              mergingIndex={mergingIndex}
              appearingIndex={appearingIndex}
              onTouchStart={handleTouchStart}
              draggedItemIndex={draggedItemHidden ? draggedItem?.index : null}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
