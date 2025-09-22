'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Zap, Gem, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

type Reward = {
  type: 'energy' | 'gems';
  amount: number;
  label: string;
  icon: React.ReactNode;
  probability: number;
};

const rewards: Reward[] = [
  { type: 'energy', amount: 30, label: '30 Energía', icon: <Zap />, probability: 0.35 },
  { type: 'gems', amount: 30, label: '30 Gemas', icon: <Gem />, probability: 0.35 },
  { type: 'energy', amount: 100, label: '100 Energía', icon: <Zap />, probability: 0.15 },
  { type: 'gems', amount: 100, label: '100 Gemas', icon: <Gem />, probability: 0.15 },
];

const totalSegments = rewards.length;
const segmentAngle = 360 / totalSegments;

// Function to get a random winner based on probability
const getRewardByProbability = (): number => {
  const rand = Math.random();
  let cumulativeProbability = 0;

  for (let i = 0; i < rewards.length; i++) {
    cumulativeProbability += rewards[i].probability;
    if (rand < cumulativeProbability) {
      return i;
    }
  }
  return 0; // Fallback
};

interface LevelUpRouletteProps {
  isOpen: boolean;
  onSpinComplete: (reward: Reward) => void;
}

export default function LevelUpRoulette({
  isOpen,
  onSpinComplete,
}: LevelUpRouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultIndex, setResultIndex] = useState<number | null>(null);

  const handleSpinClick = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResultIndex(null);

    const winnerIndex = getRewardByProbability();
    const fullSpins = 5; // How many times the wheel will spin fully
    // Calculate the final angle. We add random noise to make it not stop at the exact same spot in the segment.
    const winnerSegmentBaseAngle = winnerIndex * segmentAngle;
    const randomAngleInSegment = (segmentAngle * 0.1) + (Math.random() * segmentAngle * 0.8);
    const targetRotation = (360 * fullSpins) - (winnerSegmentBaseAngle + randomAngleInSegment);
    
    setRotation(targetRotation);

    // Wait for the spin animation to finish
    setTimeout(() => {
      setIsSpinning(false);
      setResultIndex(winnerIndex);
      
      // Wait a bit more to show the result before calling the callback
      setTimeout(() => {
        onSpinComplete(rewards[winnerIndex]);
        // Reset rotation for the next spin appearance, without animation
        setRotation(prev => prev % 360);
      }, 1500); 
    }, 4000); // This must match the animation duration
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl flex items-center gap-2 justify-center">
            <Gift className="w-8 h-8" />
            ¡Has Subido de Nivel!
          </DialogTitle>
          <DialogDescription className="text-center">
            ¡Gira la ruleta para ganar un premio!
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-8 flex items-center justify-center">
          {/* Pointer */}
          <div className="absolute -top-4 z-10 w-0 h-0 
            border-l-[10px] border-l-transparent
            border-r-[10px] border-r-transparent
            border-t-[15px] border-t-yellow-400 drop-shadow-md"></div>

          {/* Roulette Wheel */}
          <div
            className="relative w-64 h-64 rounded-full border-4 border-yellow-400 overflow-hidden"
            style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)' : 'none'
            }}
          >
            {rewards.map((reward, index) => (
              <div
                key={index}
                className={cn(
                  "absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-start text-white text-xs font-bold",
                  index % 2 === 0 ? "bg-primary" : "bg-secondary"
                )}
                style={{
                  transform: `rotate(${index * segmentAngle}deg)`,
                  clipPath: `polygon(0 0, 100% 0, 100% 100%)`,
                }}
              >
                <div className="flex flex-col items-center" style={{ transform: `rotate(45deg) translate(20px, 0px)` }}>
                  <div className="w-5 h-5">{reward.icon}</div>
                  <span>{reward.label}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Result Highlight */}
          {!isSpinning && resultIndex !== null && (
            <div
              className="absolute w-64 h-64 rounded-full overflow-hidden animate-pulse-strong pointer-events-none"
            >
               <div
                className="absolute w-1/2 h-1/2 origin-bottom-right bg-white/30"
                style={{
                  transform: `rotate(${resultIndex * segmentAngle}deg)`,
                  clipPath: `polygon(0 0, 100% 0, 100% 100%)`,
                }}
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleSpinClick}
          disabled={isSpinning}
          size="lg"
          className="w-full"
        >
          {isSpinning ? 'Girando...' : `Girar`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
