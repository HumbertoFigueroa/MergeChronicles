'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export default function SettingsDialog({
  isOpen,
  onOpenChange,
  volume,
  onVolumeChange,
}: SettingsDialogProps) {
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl">Ajustes</DialogTitle>
          <DialogDescription>
            Ajusta las opciones del juego.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="grid gap-4">
            <Label htmlFor="volume-slider">Volumen de la Música</Label>
            <div className="flex items-center gap-4">
              {getVolumeIcon()}
              <Slider
                id="volume-slider"
                min={0}
                max={1}
                step={0.1}
                value={[volume]}
                onValueChange={(value) => onVolumeChange(value[0])}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
