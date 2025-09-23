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

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function SettingsDialog({
  isOpen,
  onOpenChange,
}: SettingsDialogProps) {

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
             <p className='text-sm text-muted-foreground'>No hay ajustes disponibles por el momento.</p>
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
