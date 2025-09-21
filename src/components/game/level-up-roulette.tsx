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

const getReward = (): number => {
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
  onSpin: (reward: Reward) => void;
  spinsAvailable: number;
}

export default function LevelUpRoulette({
  isOpen,
  onSpin,
  spinsAvailable,
}: LevelUpRouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultIndex, setResultIndex] = useState<number | null>(null);

  const handleSpinClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResultIndex(null);

    const winnerIndex = getReward();
    const fullSpins = 5;
    const targetRotation = 360 * fullSpins - (winnerIndex * segmentAngle) - (segmentAngle / 2);

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResultIndex(winnerIndex);
      setTimeout(() => {
        onSpin(rewards[winnerIndex]);
        setRotation(current => current % 360); // Reset rotation for next spin
      }, 1500); // Wait for the user to see the result
    }, 4000); // Duration of the spin animation
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
            border-l-8 border-l-transparent
            border-r-8 border-r-transparent
            border-t-8 border-t-yellow-400 drop-shadow-md"></div>

          {/* Roulette Wheel */}
          <div
            className="relative w-64 h-64 rounded-full border-4 border-yellow-400 overflow-hidden transition-transform duration-[4000ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
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
          {resultIndex !== null && (
            <div
              className="absolute w-64 h-64 rounded-full overflow-hidden animate-pulse-strong"
            >
               <div
                className="absolute w-1/2 h-1/2 origin-bottom-right bg-white/40"
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
          disabled={isSpinning || spinsAvailable === 0}
          size="lg"
          className="w-full"
        >
          {isSpinning ? 'Girando...' : `Girar (${spinsAvailable})`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
