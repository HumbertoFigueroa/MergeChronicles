import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PlayerStatsProps {
  energy: number;
  maxEnergy: number;
  gems: number;
}

const GemIcon = () => (
    <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='drop-shadow-lg'>
        <path d="M7.77778 0L0 8.57143L14 24L28 8.57143L20.2222 0H7.77778Z" fill="url(#gem-gradient-1)"/>
        <path d="M14 0L7.77778 10.2857L20.2222 0H7.77778Z" fill="url(#gem-gradient-2)"/>
        <path d="M0 8.57143L7.77778 0H4.66667L0 8.57143Z" fill="#A149F8"/>
        <path d="M28 8.57143L20.2222 0H23.3333L28 8.57143Z" fill="#E286FF"/>
        <path d="M14 24L7.77778 10.2857L0 8.57143L14 24Z" fill="url(#gem-gradient-3)"/>
        <path d="M14 24L20.2222 10.2857L28 8.57143L14 24Z" fill="url(#gem-gradient-4)"/>
        <defs>
            <linearGradient id="gem-gradient-1" x1="14" y1="0" x2="14" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D96CFF"/>
                <stop offset="1" stopColor="#A149F8"/>
            </linearGradient>
            <linearGradient id="gem-gradient-2" x1="14" y1="0" x2="14" y2="10.2857" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F4B5FF"/>
                <stop offset="1" stopColor="#E286FF"/>
            </linearGradient>
            <linearGradient id="gem-gradient-3" x1="7" y1="8.57143" x2="7" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D96CFF"/>
                <stop offset="1" stopColor="#7328CB"/>
            </linearGradient>
            <linearGradient id="gem-gradient-4" x1="21" y1="8.57143" x2="21" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D96CFF"/>
                <stop offset="1" stopColor="#7328CB"/>
            </linearGradient>
        </defs>
    </svg>
);


const ZapIcon = () => (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className='drop-shadow-lg'>
        <path d="M11 0L0 16H10L8 28L24 10H13L11 0Z" fill="url(#zap-gradient)"/>
        <defs>
            <linearGradient id="zap-gradient" x1="12" y1="0" x2="12" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFEF5C"/>
                <stop offset="1" stopColor="#FFC700"/>
            </linearGradient>
        </defs>
    </svg>
);


const StatBar = ({ value, maxValue, icon, barColorClass }: { value: number, maxValue: number, icon: React.ReactNode, barColorClass: string }) => {
    const percentage = (value / maxValue) * 100;
    return (
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full p-1.5 shadow-inner-light border border-white/80 w-48">
            <div className='w-8 h-8 flex items-center justify-center'>
                {icon}
            </div>
            <div className='flex-grow'>
                <div className='w-full bg-slate-200/70 rounded-full h-5 relative overflow-hidden border-b-2 border-slate-300/50'>
                     <div className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-500", barColorClass)} style={{ width: `${percentage}%` }} />
                     <div className='absolute inset-0 flex items-center justify-center'>
                        <span className="text-sm font-bold text-white drop-shadow-text-sm">{value}/{maxValue}</span>
                     </div>
                </div>
            </div>
        </div>
    );
};

const CurrencyDisplay = ({ value, icon }: { value: number, icon: React.ReactNode }) => (
     <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full p-1.5 h-12 shadow-inner-light border border-white/80">
        <div className='w-8 h-8 flex items-center justify-center'>
            {icon}
        </div>
        <span className="text-xl font-bold text-slate-700 drop-shadow-text-sm pr-3">{value}</span>
     </div>
);


export default function PlayerStats({ energy, maxEnergy, gems }: PlayerStatsProps) {
  return (
    <div className='flex items-center justify-between gap-4 w-full'>
        <StatBar value={energy} maxValue={maxEnergy} icon={<ZapIcon/>} barColorClass="bg-gradient-to-r from-yellow-400 to-amber-500" />
        <CurrencyDisplay value={gems} icon={<GemIcon />} />
    </div>
  );
}
