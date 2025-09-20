'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from './game-header';
import CharacterDisplay from './character-display';
import MergeBoard from './merge-board';
import StoryPanel from './story-panel';
import type { BoardSlot, Item, ItemType, Order } from '@/lib/types';
import { ITEMS, MERGE_RULES, STORY_DIALOGUES, INITIAL_ORDERS } from '@/lib/game-data';
import { useToast } from '@/hooks/use-toast';
import { adaptStory } from '@/ai/flows/adaptive-story-telling';
import { Button } from '../ui/button';
import { Sparkles, Gift } from 'lucide-react';
import RewardedAd from './ad-placeholder';
import PlayerStats from './player-stats';
import OrderDisplay from './order-display';

const BOARD_SIZE = 70; // 7 columns x 10 rows
const ENERGY_REGEN_RATE = 1.5 * 60 * 1000; // 1.5 minutes in ms
const MAX_ENERGY = 100;

const initialBoard: BoardSlot[] = Array.from({ length: BOARD_SIZE }, (_, i) => ({
  id: `cell-${i}`,
  item: null,
}));
initialBoard[0] = { ...initialBoard[0], item: ITEMS['sandal_1'] };
initialBoard[1] = { ...initialBoard[1], item: ITEMS['sandal_1'] };
initialBoard[2] = { ...initialBoard[2], item: ITEMS['fabric_1'] };

export default function GameLayout() {
  const [board, setBoard] = useState<BoardSlot[]>(initialBoard);
  const [equippedItems, setEquippedItems] = useState<Record<ItemType, Item | null>>({
    dress: null,
    shoe: null,
    accessory: null,
  });
  const [storyProgress, setStoryProgress] = useState('Chapter 1: The Beginning');
  const [dialogue, setDialogue] = useState<string | null>(
    'Welcome to Fusion Historia! Start by merging two identical items.'
  );
  const [playerUnderstanding, setPlayerUnderstanding] = useState(10);
  const [mergingIndex, setMergingIndex] = useState<number | null>(null);
  const [appearingIndex, setAppearingIndex] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [energy, setEnergy] = useState(80);
  const [gems, setGems] = useState(25);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS.slice(0, 1));

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

  const handleStoryCheck = useCallback(async () => {
    setIsThinking(true);
    setDialogue(null);

    const inventory = board
      .map(slot => slot.item?.name)
      .filter(Boolean)
      .join(', ');
      
    const storyToTry = STORY_DIALOGUES[Math.floor(Math.random() * STORY_DIALOGUES.length)];

    try {
        const result = await adaptStory({
            playerInventory: inventory || 'empty',
            playerStoryProgress: storyProgress,
            playerUnderstandingScore: playerUnderstanding,
            dialogueSnippet: storyToTry,
        });

        if (result.shouldPresentDialogue) {
            setDialogue(result.reasoning + " " + storyToTry);
            setPlayerUnderstanding(p => Math.max(0, p - 10)); // reduce understanding so we don't spam
        }
    } catch (error) {
        console.error("AI flow error:", error);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not fetch the next story part."
        });
    } finally {
        setIsThinking(false);
    }
  }, [board, storyProgress, playerUnderstanding, toast]);

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
        setTimeout(() => setMergingIndex(null), 300);

        setBoard(newBoard);
        setPlayerUnderstanding(p => Math.min(100, p + 5));

        toast({
          title: "Merge Successful!",
          description: (
            <div className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-primary" /> You created a {newItem.name}!
            </div>
          ),
        });
        
        if (newItem.level > (equippedItems[newItem.type]?.level ?? 0)) {
          setEquippedItems(prev => ({...prev, [newItem.type]: newItem}));
        }

        // Check for story progression
        if(Math.random() < 0.3) { // 30% chance to check story on merge
            handleStoryCheck();
        }

      }
    } else {
      // Not mergeable, swap items
      newBoard[targetIndex] = { ...targetSlot, item: sourceItem };
      newBoard[sourceIndex] = { ...sourceSlot, item: targetItem };
      setBoard(newBoard);
    }
  };
  
  const generateNewItem = useCallback(() => {
    const emptySlotIndex = board.findIndex(slot => !slot.item);
    if (emptySlotIndex !== -1) {
        const newBoard = [...board];
        const randomItemKey = Object.keys(ITEMS).filter(k => ITEMS[k].level === 1)[Math.floor(Math.random() * 3)];
        newBoard[emptySlotIndex] = {...newBoard[emptySlotIndex], item: ITEMS[randomItemKey]};
        setBoard(newBoard);
        setAppearingIndex(emptySlotIndex);
        setTimeout(() => setAppearingIndex(null), 500);
        toast({ title: "A new item has arrived!", description: `You received a ${ITEMS[randomItemKey].name}.` });
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


  return (
    <>
      <GameHeader />
      <main className="pt-16 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <StoryPanel storyProgress={storyProgress} dialogue={dialogue} isThinking={isThinking} />
          <OrderDisplay orders={orders} onCompleteOrder={handleCompleteOrder} />
          <RewardedAd onReward={generateNewItem} />
        </div>

        <div className="lg:col-span-6 flex flex-col items-center justify-center gap-4">
          <PlayerStats energy={energy} maxEnergy={MAX_ENERGY} gems={gems} />
          <MergeBoard
            board={board}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            mergingIndex={mergingIndex}
            appearingIndex={appearingIndex}
          />
          <Button onClick={generateNewItem}>
              <Gift className="mr-2 h-4 w-4" />
              Get New Item
          </Button>
        </div>

        <div className="lg:col-span-3">
          <CharacterDisplay equippedItems={equippedItems} />
        </div>
      </main>
    </>
  );
}
