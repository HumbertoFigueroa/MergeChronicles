import { Progress } from '@/components/ui/progress';
import React, { useState, useEffect } from 'react';
import { ENERGY_REGEN_RATE, MAX_ENERGY_REGEN_STOP } from '@/components/game/game-layout';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface PlayerStatsProps {
  level: number;
  xp: number;
  xpNeeded: number;
  energy: number;
  gems: number;
  lastEnergyUpdate: number;
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

const TimerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const EnergyTimer = ({ lastEnergyUpdate }: { lastEnergyUpdate: number }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const timeSinceLast = Date.now() - lastEnergyUpdate;
            const timeToNext = ENERGY_REGEN_RATE - (timeSinceLast % ENERGY_REGEN_RATE);
            return timeToNext;
        };

        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [lastEnergyUpdate]);


    if (timeLeft <= 0) {
        return null;
    }

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-max px-2 py-0.5 bg-blue-500/80 text-white rounded-md text-xs flex items-center gap-1 border border-blue-400/90 shadow-sm">
            <TimerIcon />
            <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
        </div>
    );
};


export default function PlayerStats({ level, xp, xpNeeded, energy, gems, lastEnergyUpdate }: PlayerStatsProps) {
    const xpPercentage = (xp / xpNeeded) * 100;
    
    return (
        <div className='flex items-center justify-between gap-2 w-full bg-black/20 rounded-full p-1.5 h-12 shadow-inner border border-white/30 text-white'>
            {/* Level */}
            <div className="relative h-9 w-9 rounded-full border-2 border-yellow-300 overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                 <div className='w-full h-full flex items-center justify-center bg-gray-300 text-gray-600'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </div>
                 <div className='absolute -bottom-1 w-full text-center bg-black/50'>
                    <span className='text-xs font-bold leading-tight'>{level}</span>
                 </div>
            </div>

            {/* XP Bar */}
            <div className='flex-grow h-full pt-0.5'>
                <div className='w-full bg-black/30 rounded-full h-4 relative overflow-hidden'>
                    <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${xpPercentage}%` }} />
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <span className="text-xs font-bold drop-shadow-sm">{xp}/{xpNeeded}</span>
                    </div>
                </div>
            </div>
            
            {/* Gem and Energy */}
            <div className='flex items-center gap-4 px-2'>
                {/* Gems */}
                <div className="flex items-center gap-1.5 h-8">
                    <div className='w-5 h-5 flex items-center justify-center'><GemIcon /></div>
                    <span className="text-sm font-bold">{gems}</span>
                </div>
                {/* Energy */}
                <div className="relative flex items-center gap-1.5 h-8">
                     <div className='w-5 h-5 flex items-center justify-center'><ZapIcon /></div>
                     <span className="text-sm font-bold">{energy}</span>
                     {energy < MAX_ENERGY_REGEN_STOP && <EnergyTimer lastEnergyUpdate={lastEnergyUpdate} />}
                </div>
            </div>

        </div>
    );
}

    

