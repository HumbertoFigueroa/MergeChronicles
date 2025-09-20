import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ENERGY_REGEN_RATE } from './game-layout';

interface PlayerStatsProps {
  level: number;
  xp: number;
  xpNeeded: number;
  energy: number;
  maxEnergy: number;
  gems: number;
  isMobile?: boolean;
}

const GemIcon = () => (
    <svg width="24" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='drop-shadow-lg h-full w-auto'>
        <path d="M7.77778 0L0 8.57143L14 24L28 8.57143L20.2222 0H7.77778Z" fill="url(#gem-gradient-1-stats)"/>
        <path d="M14 0L7.77778 10.2857L20.2222 0H7.77778Z" fill="url(#gem-gradient-2-stats)"/>
        <path d="M0 8.57143L7.77778 0H4.66667L0 8.57143Z" fill="#A149F8"/>
        <path d="M28 8.57143L20.2222 0H23.3333L28 8.57143Z" fill="#E286FF"/>
        <path d="M14 24L7.77778 10.2857L0 8.57143L14 24Z" fill="url(#gem-gradient-3-stats)"/>
        <path d="M14 24L20.2222 10.2857L28 8.57143L14 24Z" fill="url(#gem-gradient-4-stats)"/>
        <defs>
            <linearGradient id="gem-gradient-1-stats" x1="14" y1="0" x2="14" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#D96CFF"/><stop offset="1" stopColor="#A149F8"/></linearGradient>
            <linearGradient id="gem-gradient-2-stats" x1="14" y1="0" x2="14" y2="10.2857" gradientUnits="userSpaceOnUse"><stop stopColor="#F4B5FF"/><stop offset="1" stopColor="#E286FF"/></linearGradient>
            <linearGradient id="gem-gradient-3-stats" x1="7" y1="8.57143" x2="7" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#D96CFF"/><stop offset="1" stopColor="#7328CB"/></linearGradient>
            <linearGradient id="gem-gradient-4-stats" x1="21" y1="8.57143" x2="21" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#D96CFF"/><stop offset="1" stopColor="#7328CB"/></linearGradient>
        </defs>
    </svg>
);

const ZapIcon = () => (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className='drop-shadow-lg h-full w-auto'>
        <path d="M11 0L0 16H10L8 28L24 10H13L11 0Z" fill="url(#zap-gradient-stats)"/>
        <defs>
            <linearGradient id="zap-gradient-stats" x1="12" y1="0" x2="12" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#FFEF5C"/><stop offset="1" stopColor="#FFC700"/></linearGradient>
        </defs>
    </svg>
);


const StatDisplay = ({ value, icon, action }: { value: string | number, icon: React.ReactNode, action?: () => void }) => (
    <div className="flex items-center gap-2 bg-black/20 rounded-full p-1 h-10 shadow-inner border border-white/30 text-white">
        <div className='w-8 h-8 flex items-center justify-center p-1.5'>
            {icon}
        </div>
        <span className="text-lg font-bold drop-shadow-md pr-3">{value}</span>
        {action && (
            <Button size="icon" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white -mr-1" onClick={action}>
                <Plus className="w-5 h-5"/>
            </Button>
        )}
    </div>
);

const LevelDisplay = ({ level, xp, xpNeeded }: { level: number, xp: number, xpNeeded: number }) => {
    return (
        <div className="relative flex items-center h-12 pr-4 bg-black/20 rounded-full shadow-inner border border-white/30 text-white">
            <div className="relative w-12 h-12 rounded-full border-2 border-yellow-300 overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                 <span className='text-2xl'>🧑‍🎨</span>
            </div>
            <div className="flex flex-col ml-2">
                <span className="text-sm font-bold leading-none">Level {level}</span>
                <Progress value={(xp/xpNeeded) * 100} className="h-2 w-16 bg-white/30" />
            </div>
        </div>
    )
};

const EnergyTimer = ({ nextEnergyTime }: { nextEnergyTime: number }) => {
    const [timeLeft, setTimeLeft] = useState(nextEnergyTime - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = nextEnergyTime - Date.now();
            if (newTimeLeft <= 0) {
                // Timer will be reset by parent component when energy is gained
                setTimeLeft(0); 
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [nextEnergyTime]);

    if (timeLeft <= 0) {
        return null;
    }

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return (
        <div className="text-center text-xs text-white/80 drop-shadow-sm mt-1">
            +1 en {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
    );
};


export default function PlayerStats({ level, xp, xpNeeded, energy, maxEnergy, gems, isMobile = false }: PlayerStatsProps) {
    const energyPercentage = (energy / maxEnergy) * 100;
    const [nextEnergyTime, setNextEnergyTime] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (energy < maxEnergy) {
            const updateTimer = () => {
                setNextEnergyTime(Date.now() + ENERGY_REGEN_RATE);
            };
            updateTimer(); // Set it immediately
            timer = setInterval(updateTimer, ENERGY_REGEN_RATE);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [energy, maxEnergy]);


    if (isMobile) {
        return (
            <div className='flex flex-col items-start gap-2 w-full'>
                <LevelDisplay level={level} xp={xp} xpNeeded={xpNeeded} />
                <div className="flex gap-2 w-full">
                    <StatDisplay value={gems} icon={<GemIcon />} />
                    <div className="flex-grow flex flex-col">
                        <div className="flex items-center gap-2 bg-black/20 rounded-full p-1 h-10 shadow-inner border border-white/30 text-white">
                            <div className='w-8 h-8 flex items-center justify-center p-1.5'>
                                <ZapIcon />
                            </div>
                            <div className='flex-grow pr-2'>
                                <div className='w-full bg-black/30 rounded-full h-4 relative overflow-hidden'>
                                    <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" style={{ width: `${energyPercentage}%` }} />
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        <span className="text-xs font-bold drop-shadow-sm">{energy}/{maxEnergy}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {energy < maxEnergy && <EnergyTimer nextEnergyTime={nextEnergyTime} />}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex items-center justify-center gap-2 w-full'>
            <LevelDisplay level={level} xp={xp} xpNeeded={xpNeeded} />
            <div className="flex items-center gap-2 bg-black/20 rounded-full p-1 h-10 shadow-inner border border-white/30 text-white">
                <div className='w-8 h-8 flex items-center justify-center p-1.5'><GemIcon /></div>
                <span className="text-lg font-bold drop-shadow-md pr-3">{gems}</span>
                <Button size="icon" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white -mr-1"><Plus className="w-5 h-5" /></Button>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2 bg-black/20 rounded-full p-1 h-10 shadow-inner border border-white/30 text-white w-48">
                    <div className='w-8 h-8 flex items-center justify-center p-1.5'><ZapIcon /></div>
                    <div className='flex-grow pr-2'>
                        <div className='w-full bg-black/30 rounded-full h-4 relative overflow-hidden'>
                            <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" style={{ width: `${energyPercentage}%` }} />
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <span className="text-xs font-bold drop-shadow-sm">{energy}/{maxEnergy}</span>
                            </div>
                        </div>
                    </div>
                    <Button size="icon" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white -mr-1"><Plus className="w-5 h-5" /></Button>
                </div>
                {energy < maxEnergy && <EnergyTimer nextEnergyTime={nextEnergyTime} />}
            </div>
        </div>
    );
}
