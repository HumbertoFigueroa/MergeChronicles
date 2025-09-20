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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, Zap, Gift, Video, Wallet } from 'lucide-react';
import Image from 'next/image';
import { findImage } from '@/lib/utils';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ShopDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddGems: (amount: number) => void;
  onAddEnergy: (amount: number) => void;
  onGenerateItem: (itemId: string) => void;
  onSpendGems: (amount: number) => boolean;
  gems: number;
}

const ShopItem = ({ title, description, icon, actionText, onAction, cost, disabled }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    actionText: React.ReactNode;
    onAction: () => void;
    cost?: number;
    disabled?: boolean;
}) => (
    <Card className='text-center'>
        <CardHeader className='pb-2'>
            <div className='w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2'>
                {icon}
            </div>
            <CardTitle className='text-lg'>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className='min-h-[20px]' />
        <CardFooter>
            <Button onClick={onAction} className='w-full' disabled={disabled}>
                {actionText}
                {cost && (
                    <>
                        <Gem className='ml-2 h-4 w-4'/> {cost}
                    </>
                )}
            </Button>
        </CardFooter>
    </Card>
);

const AdButton = ({ onReward, rewardText, children } : { onReward: () => void, rewardText: string, children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAdClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            onReward();
            setIsLoading(false);
        }, 1500);
    };

    return (
        <Button onClick={handleAdClick} disabled={isLoading} className='w-full'>
             {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                </>
            ) : (
                <>
                    <Video className='mr-2' /> {children} <span className='font-bold ml-1'>{rewardText}</span>
                </>
            )}
        </Button>
    )
};


export default function ShopDialog({
  isOpen,
  onOpenChange,
  onAddGems,
  onAddEnergy,
  onGenerateItem,
  onSpendGems,
  gems
}: ShopDialogProps) {

  const handleBuyEnergy = () => {
    if (onSpendGems(10)) {
        onAddEnergy(50);
    }
  }

  const handleBuyItem = () => {
    if (onSpendGems(20)) {
        onGenerateItem('fabric_1');
    }
  }
    
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl">Tienda</DialogTitle>
          <DialogDescription>
            Usa tus gemas para comprar items y energía, o mira anuncios para ganar recompensas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Real Money Purchases */}
            <Card className='md:col-span-2 bg-gradient-to-r from-yellow-200 to-orange-200'>
                 <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Wallet/>Comprar Gemas</CardTitle>
                    <CardDescription>¡Acelera tu progreso con estos paquetes de gemas!</CardDescription>
                </CardHeader>
                <CardContent className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <Button variant="outline" className='h-20 flex-col' onClick={() => onAddGems(100)}>
                        <span className='text-lg font-bold'>100 Gemas</span>
                        <span className='text-sm font-normal'>$0.99</span>
                    </Button>
                     <Button variant="outline" className='h-20 flex-col' onClick={() => onAddGems(550)}>
                        <span className='text-lg font-bold'>550 Gemas</span>
                        <span className='text-sm font-normal'>$4.99</span>
                    </Button>
                     <Button variant="outline" className='h-20 flex-col' onClick={() => onAddGems(1200)}>
                        <span className='text-lg font-bold'>1200 Gemas</span>
                        <span className='text-sm font-normal'>$9.99</span>
                    </Button>
                     <Button variant="outline" className='h-20 flex-col' onClick={() => onAddGems(2500)}>
                        <span className='text-lg font-bold'>2500 Gemas</span>
                        <span className='text-sm font-normal'>$19.99</span>
                    </Button>
                </CardContent>
            </Card>

            {/* Gem Purchases */}
            <Card className='md:col-span-2'>
                 <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Gem className='text-blue-500'/>Comprar con Gemas</CardTitle>
                </CardHeader>
                <CardContent className='grid sm:grid-cols-2 gap-4'>
                    <ShopItem 
                        title="Recarga de Energía"
                        description="Obtén 50 de energía para seguir fusionando."
                        icon={<Zap className='w-6 h-6 text-yellow-500'/>}
                        actionText="Comprar"
                        onAction={handleBuyEnergy}
                        cost={10}
                        disabled={gems < 10}
                    />
                     <ShopItem 
                        title="Caja de Sastre"
                        description="Recibe un generador de tela de nivel 1."
                        icon={<Gift className='w-6 h-6 text-red-500'/>}
                        actionText="Comprar"
                        onAction={handleBuyItem}
                        cost={20}
                        disabled={gems < 20}
                    />
                </CardContent>
            </Card>

            {/* Ad Rewards */}
            <Card className='md:col-span-2'>
                 <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Video/>Recompensas Gratis</CardTitle>
                    <CardDescription>¡Mira un anuncio rápido para ganar premios!</CardDescription>
                </CardHeader>
                <CardContent className='grid sm:grid-cols-2 gap-4'>
                    <AdButton onReward={() => onAddGems(5)} rewardText="+5 Gemas">Ver Anuncio</AdButton>
                    <AdButton onReward={() => onAddEnergy(30)} rewardText="+30 Energía">Ver Anuncio</AdButton>
                </CardContent>
            </Card>
        </div>
        
        <DialogFooter>
            <p className='text-sm text-muted-foreground mr-auto'>Tus gemas: {gems}</p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
