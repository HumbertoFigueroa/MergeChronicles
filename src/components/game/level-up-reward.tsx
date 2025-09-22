'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Zap, Gem, Gift, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Reward } from '@/lib/types';
import { REWARDS } from '@/lib/game-data';

interface LevelUpRewardProps {
  reward: Reward;
  onRewardClaimed: (reward: Reward) => void;
}

const getRewardIcon = (reward: Reward) => {
    if (reward.type === 'energy') {
        return <Zap className="w-8 h-8 text-yellow-300" />;
    }
    return <Gem className="w-8 h-8 text-blue-400" />;
}

const RewardCard = ({ reward, isFlipped, isWinner, onSelect }: {
    reward: Reward,
    isFlipped: boolean,
    isWinner: boolean,
    onSelect: () => void
}) => {
    return (
        <div className="perspective-1000">
            <div 
                className={cn(
                    "relative w-full aspect-[3/4] transition-transform duration-700 preserve-3d",
                    isFlipped ? "rotate-y-180" : ""
                )}
                onClick={onSelect}
            >
                {/* Card Back */}
                <div className="absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-secondary to-purple-600 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform">
                    <Star className="w-1/2 h-1/2 text-yellow-300 opacity-80" />
                </div>

                {/* Card Front */}
                <div className={cn(
                    "absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl flex flex-col items-center justify-center p-2 text-center text-white",
                    isWinner
                      ? "bg-gradient-to-br from-yellow-400 to-amber-600 shadow-2xl ring-4 ring-yellow-300"
                      : "bg-gradient-to-br from-gray-500 to-gray-700"
                )}>
                    <div className='mb-2'>{getRewardIcon(reward)}</div>
                    <span className='font-bold text-sm sm:text-base'>{reward.label}</span>
                </div>
            </div>
        </div>
    )
}

export default function LevelUpReward({
  reward: winningReward,
  onRewardClaimed,
}: LevelUpRewardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const allCardRewards: Reward[] = useMemo(() => {
    const fullRewards: Reward[] = REWARDS.map(r => ({...r, icon: getRewardIcon(r as Reward)}));
    
    // Filter out the actual winning reward type to avoid duplicates
    const dummyRewards = fullRewards.filter(r => r.label !== winningReward.label).slice(0, 5);
    
    const cards = [...dummyRewards];
    // Place the real reward at a random position
    const winnerPosition = Math.floor(Math.random() * (cards.length + 1));
    cards.splice(winnerPosition, 0, winningReward);
    return cards;
  }, [winningReward]);


  const handleCardSelect = (index: number) => {
    if (isRevealed) return;
    
    setSelectedIndex(index);
    setIsRevealed(true);

    setTimeout(() => {
        onRewardClaimed(winningReward);
    }, 2000);
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl flex items-center gap-2 justify-center">
            <Gift className="w-8 h-8" />
            ¡Has Subido de Nivel!
          </DialogTitle>
          <DialogDescription className="text-center">
            ¡Elige una carta para revelar tu premio!
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 my-6">
            {allCardRewards.map((cardReward, index) => (
                <RewardCard 
                    key={index}
                    reward={cardReward}
                    isFlipped={isRevealed}
                    isWinner={cardReward.label === winningReward.label}
                    onSelect={() => handleCardSelect(index)}
                />
            ))}
        </div>

        {isRevealed && (
            <div className='text-center font-bold text-lg animate-pulse'>
                ¡Has ganado {winningReward.label}!
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
