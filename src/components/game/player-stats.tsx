import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gem, Zap } from 'lucide-react';

interface PlayerStatsProps {
  energy: number;
  maxEnergy: number;
  gems: number;
}

export default function PlayerStats({ energy, maxEnergy, gems }: PlayerStatsProps) {
  const energyPercentage = (energy / maxEnergy) * 100;

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-3 flex items-center justify-around gap-4">
        <div className="flex items-center gap-2 w-1/2">
          <Zap className="h-6 w-6 text-yellow-400" />
          <div className="w-full">
            <div className='flex justify-between items-center mb-1'>
                <span className="text-sm font-bold">Energy</span>
                <span className="text-xs font-mono">{energy} / {maxEnergy}</span>
            </div>
            <Progress value={energyPercentage} className="h-3" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Gem className="h-6 w-6 text-blue-500" />
          <span className="text-lg font-bold">{gems}</span>
        </div>
      </CardContent>
    </Card>
  );
}
