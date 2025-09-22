'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import MergeBoard from '@/components/game/merge-board';
import type { BoardSlot, Item, Order, ItemType, Reward } from '@/lib/types';
import { ITEMS, MERGE_RULES, REWARDS } from '@/lib/game-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Lock, ShoppingCart, Loader, Settings, Gem, DollarSign } from 'lucide-react';
import PlayerStats from '@/components/game/player-stats';
import OrderDisplay from '@/components/game/order-display';
import ShopDialog from '@/components/game/shop-dialog';
import GameBackground from '@/components/game/game-background';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/toaster';
import LevelUpReward from '@/components/game/level-up-reward';
import GameHeader from '@/components/game/game-header';
import DraggedItemGhost from '@/components/game/dragged-item-ghost';
import SettingsDialog from '@/components/game/settings-dialog';

const BOARD_SIZE = 56; // 7 columns x 8 rows
export const ENERGY_REGEN_RATE = 1.5 * 60 * 1000; // 1.5 minutes in ms
export const MAX_ENERGY_REGEN_STOP = 100;
const ENERGY_COST_PER_ITEM = 1;
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
    let xpNeeded = 10;
    let currentLevel = 1;
    
    while(currentLevel < level) {
      currentLevel++;
      if (currentLevel <= 10) {
          xpNeeded += 2;
      } else if (currentLevel <= 30) {
          xpNeeded += 3;
      } else if (currentLevel <= 50) {
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

const getRewardByProbability = (): Reward => {
  const rand = Math.random();
  let cumulativeProbability = 0;

  for (let i = 0; i < REWARDS.length; i++) {
    cumulativeProbability += REWARDS[i].probability;
    if (rand < cumulativeProbability) {
      return REWARDS[i];
    }
  }
  return REWARDS[0]; // Fallback
};

export default function GameLayout() {
  const [isGameDataLoading, setIsGameDataLoading] = useState(true);
  
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [gems, setGems] = useState(25);
  
  const [board, setBoard] = useState<BoardSlot[]>(initialBoard);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSellMode, setIsSellMode] = useState(false);

  const [multiplier, setMultiplier] = useState<Multiplier>(1);
  
  const [levelUpReward, setLevelUpReward] = useState<Reward | null>(null);

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [draggedItemGhost, setDraggedItemGhost] = useState<{ item: Item; x: number; y: number } | null>(null);

  const { toast } = useToast();

  const isInitialLoad = useRef(true);
  
  useEffect(() => {
    const loadGameData = () => {
      setIsGameDataLoading(true);
      const savedData = localStorage.getItem('fusionHistoriaGameData');

      if (savedData) {
        const data = JSON.parse(savedData);
        setLevel(data.level ?? 1);
        setXp(data.xp ?? 0);
        setEnergy(data.energy ?? 100);
        setGems(data.gems ?? 25);
        setOrders(data.orders ?? []);
        const savedBoard = data.board ?? initialBoard;
        const hydratedBoard = savedBoard.map((slot: BoardSlot) => ({
          ...slot,
          item: slot.item ? ITEMS[slot.item.id] : null,
        }));
        setBoard(hydratedBoard);
      } else {
        setBoard(currentBoard => {
            const newBoard = [...currentBoard];
            newBoard[GENERATOR_UNLOCKS.generator_animals.position].item = ITEMS.generator_animals;
            return newBoard;
        });
      }
      setIsGameDataLoading(false);
      isInitialLoad.current = false;
    };
    
    loadGameData();
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) return;
    
    const saveData = () => {
        const gameData = {
            level,
            xp,
            energy,
            gems,
            board: board.map(slot => ({...slot, item: slot.item ? { id: slot.item.id } : null })),
            orders,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('fusionHistoriaGameData', JSON.stringify(gameData));
    };
    
    const handler = setTimeout(() => {
        saveData();
    }, 1000); 

    return () => {
        clearTimeout(handler);
    };

  }, [level, xp, energy, gems, board, orders]);

  const xpNeeded = getXpNeededForLevel(level);

  const placeNewItem = (boardState: BoardSlot[], itemId: string, preferredIndex?: number): { newBoard: BoardSlot[], success: boolean, placedIndex: number | null } => {
    const newBoard = [...boardState];
    const itemToPlace = ITEMS[itemId];
    if (!itemToPlace) {
      return { newBoard: boardState, success: false, placedIndex: null };
    }
  
    const findEmptySlot = (startIndex?: number): number => {
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
    if (isGameDataLoading) return;
    setBoard(currentBoard => {
      let currentGenerators = new Set(currentBoard.map(slot => slot.item?.id).filter(id => id?.startsWith('generator_')));
      const newBoard = [...currentBoard];
      let boardChanged = false;

      const animalGenerators = newBoard.map((slot, index) => ({...slot, index})).filter(slot => slot.item?.id === 'generator_animals');
      if (animalGenerators.length > 1) {
        const correctPosAnimalGen = animalGenerators.find(g => g.index === GENERATOR_UNLOCKS['generator_animals'].position);
        let toKeep = correctPosAnimalGen || animalGenerators[0];
        
        animalGenerators.forEach(gen => {
          if (gen.index !== toKeep.index) {
            newBoard[gen.index].item = null;
            boardChanged = true;
          }
        });
        currentGenerators = new Set(newBoard.map(slot => slot.item?.id).filter(id => id?.startsWith('generator_')));
      }

      Object.entries(GENERATOR_UNLOCKS).forEach(([generatorId, unlock]) => {
        if (level >= unlock.level && !currentGenerators.has(generatorId)) {
          let placed = false;
          if (!newBoard[unlock.position].item) {
            newBoard[unlock.position].item = ITEMS[generatorId];
            placed = true;
          } else {
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
  
  }, [level, isGameDataLoading]);

  const lastEnergyUpdateTime = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const timePassed = now - lastEnergyUpdateTime.current;
      
      setEnergy(currentEnergy => {
          if (currentEnergy >= MAX_ENERGY_REGEN_STOP) {
              lastEnergyUpdateTime.current = now;
              return currentEnergy;
          }
          
          const energyToRegen = Math.floor(timePassed / ENERGY_REGEN_RATE);
          if (energyToRegen > 0) {
            lastEnergyUpdateTime.current += energyToRegen * ENERGY_REGEN_RATE;
            return Math.min(MAX_ENERGY_REGEN_STOP, currentEnergy + energyToRegen);
          }
          
          return currentEnergy;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addXp = (amount: number) => {
    setXp(currentXp => {
      let newXp = currentXp + amount;
      let currentLevel = level;
      let xpForNext = getXpNeededForLevel(currentLevel);
      let levelsGained = 0;
      
      while (newXp >= xpForNext) {
        newXp -= xpForNext;
        currentLevel++;
        levelsGained++;
        xpForNext = getXpNeededForLevel(currentLevel);
      }
      
      if (levelsGained > 0) {
        setLevel(currentLevel);
        const reward = getRewardByProbability();
        setLevelUpReward(reward);
      }

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
    if (isGameDataLoading) return;
    if (orders.length < MAX_ORDERS) {
      const newOrder = generateNewOrder();
      if (newOrder) {
        setOrders(currentOrders => [...currentOrders, newOrder]);
      }
    }
  }, [level, orders.length, generateNewOrder, isGameDataLoading]);

  const handleDrop = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;
  
    setBoard(currentBoard => {
      const newBoard = [...currentBoard];
      const sourceSlot = newBoard[sourceIndex];
      if (!sourceSlot || !sourceSlot.item) return newBoard;
    
      const targetSlot = newBoard[targetIndex];
    
      if (!targetSlot.item) {
        newBoard[targetIndex] = { ...targetSlot, item: sourceSlot.item };
        newBoard[sourceIndex] = { ...sourceSlot, item: null };
      } else {
        const sourceItem = sourceSlot.item;
        const targetItem = targetSlot.item;
    
        if (!sourceItem.isGenerator && !targetItem.isGenerator && sourceItem.id === targetItem.id && MERGE_RULES[sourceItem.id]) {
          const newItemId = MERGE_RULES[sourceItem.id];
          const newItem = ITEMS[newItemId];
    
          if (newItem) {
            newBoard[targetIndex] = { ...targetSlot, item: newItem };
            newBoard[sourceIndex] = { ...sourceSlot, item: null };
          }
        } else {
          newBoard[targetIndex] = { ...targetSlot, item: sourceItem };
          newBoard[sourceIndex] = { ...sourceSlot, item: targetItem };
        }
      }
      return newBoard;
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isSellMode) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('sourceIndex', index.toString());
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (isSellMode) return;
    const sourceIndexStr = e.dataTransfer.getData('sourceIndex');
    if (sourceIndexStr === null) return;
    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (isNaN(sourceIndex)) return;
    handleDrop(sourceIndex, targetIndex);
    setDraggedItemIndex(null);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, index: number) => {
    if (isSellMode) return;
    const item = board[index].item;
    if (item && !item.isGenerator) {
      setDraggedItemIndex(index);
      const touch = e.touches[0];
      setDraggedItemGhost({ item, x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (draggedItemIndex === null || isSellMode) return;

    const touch = e.touches[0];
    setDraggedItemGhost(g => g ? { ...g, x: touch.clientX, y: touch.clientY } : null);

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
    if(targetIndex !== -1 && targetIndex !== draggedOverIndex) {
        setDraggedOverIndex(targetIndex);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (draggedItemIndex === null || isSellMode) return;
  
    if (draggedOverIndex !== null && draggedOverIndex !== -1 && draggedOverIndex !== draggedItemIndex) {
      handleDrop(draggedItemIndex, draggedOverIndex);
    }
  
    setDraggedItemIndex(null);
    setDraggedOverIndex(null);
    setDraggedItemGhost(null);
  };

  const handleSellItem = (index: number) => {
    const itemToSell = board[index].item;
    if (!itemToSell || itemToSell.isGenerator) {
      toast({
        title: 'No se puede vender',
        description: 'Los generadores no se pueden vender.',
        variant: 'destructive',
      });
      return;
    }
  
    const gemsEarned = Math.floor(itemToSell.level / 3);
    if (gemsEarned > 0) {
      setGems(g => g + gemsEarned);
    }
  
    setBoard(currentBoard => {
      const newBoard = [...currentBoard];
      newBoard[index] = { ...newBoard[index], item: null };
      return newBoard;
    });

    toast({
      title: '¡Objeto Vendido!',
      description: `Has ganado ${gemsEarned} gemas.`,
    });
  
    setIsSellMode(false);
  };

  const handleItemClick = (index: number) => {
    if (isSellMode) {
      handleSellItem(index);
      return;
    }

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
      const { newBoard, success } = placeNewItem(tempBoard, itemId, index);
      
      tempBoard = newBoard;
  
      if (!success) {
        toast({
            variant: 'destructive',
            title: '¡Tablero Lleno!',
            description: 'No hay espacio para generar más objetos.',
        });
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

      const gemRewardChance = Math.random();
      if (gemRewardChance > 0.3) { // 70% chance to get gems
        const gemAmount = Math.floor(deliveredItem.level / 1); // Updated logic
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
    setEnergy(e => Math.min(MAX_ENERGY_REGEN_STOP, e + amount));
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
  
  const handleRewardClaimed = (reward: Reward) => {
    if (reward.type === 'energy') {
      addEnergy(reward.amount);
    } else {
      setGems(g => g + reward.amount);
    }
    toast({
      title: "¡Premio!",
      description: `Has ganado ${reward.label}.`
    });
    setLevelUpReward(null);
  };

  if (isGameDataLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
        <Loader className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <>
      <GameHeader />
      <div 
          className="relative h-screen w-full flex flex-col pt-16"
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
      >
        <GameBackground />
        <Toaster />
        
        {draggedItemGhost && <DraggedItemGhost {...draggedItemGhost} />}

        {levelUpReward && (
          <LevelUpReward
            reward={levelUpReward}
            onRewardClaimed={handleRewardClaimed}
          />
        )}

        <ShopDialog 
          isOpen={isShopOpen} 
          onOpenChange={setIsShopOpen}
          onPurchaseGems={purchaseGems}
          onAddEnergy={addEnergy}
          onSpendGems={spendGems}
          gems={gems}
        />

        <SettingsDialog
            isOpen={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
        />
        
        <main className="relative z-10 flex flex-col lg:flex-row gap-4 p-2 sm:p-4 flex-grow">
          
          <div className="hidden lg:flex lg:w-64 flex-col gap-4">
              <Button size="lg" className="h-20 text-lg" disabled>
                  <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mb-1 mx-auto"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                      Historia
                      <span className="text-xs font-normal block">(Próximamente)</span>
                  </div>
              </Button>
          </div>

          <div className="flex flex-col items-center gap-4 flex-grow w-full">
            
            <div className='w-full flex items-center justify-center gap-2 px-1 flex-shrink-0'>
               <PlayerStats 
                  level={level} 
                  xp={xp} 
                  xpNeeded={xpNeeded} 
                  energy={energy}
                  gems={gems}
               />
              <Button onClick={toggleMultiplier} variant='secondary' size='sm' className='h-10 w-12 rounded-lg relative flex-shrink-0'>
                  <Badge className='text-sm'>x{multiplier}</Badge>
                  {(level < 10 && multiplier === 1) || (level < 30 && multiplier === 2) ? (
                    <div className='absolute -top-1 -right-1 p-1 bg-gray-600 rounded-full'>
                        <Lock className='w-2 h-2 text-white' />
                    </div>
                  ) : null}
              </Button>
              <Button variant="secondary" size="icon" className='h-10 w-10 rounded-lg flex-shrink-0' onClick={() => setIsShopOpen(true)}>
                  <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className='h-10 w-10 rounded-lg flex-shrink-0' onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="h-5 w-5" />
              </Button>
            </div>
            
            <div className='w-full my-2 flex items-center justify-center gap-4'>
                <OrderDisplay orders={orders} onDeliverOrder={handleDeliverOrder} />
            </div>
            
            <div className="flex flex-col items-center justify-center w-full">
              <div className='w-full max-w-2xl mx-auto flex justify-end pr-2 sm:pr-4 mb-2'>
                  <Button 
                    variant={isSellMode ? "destructive" : "outline"} 
                    size="sm" 
                    onClick={() => setIsSellMode(!isSellMode)}
                    className="h-10 w-auto px-3"
                  >
                      <DollarSign className="h-4 w-4" />
                      <Gem className="h-4 w-4" />
                      <span className='ml-1'>{isSellMode ? 'Cancelar' : 'Vender'}</span>
                  </Button>
              </div>
              <MergeBoard
                board={board}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDragDrop}
                onItemClick={handleItemClick}
                onTouchStart={handleTouchStart}
                draggedItemIndex={draggedItemIndex}
                draggedOverIndex={draggedOverIndex}
                isSellMode={isSellMode}
              />
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
