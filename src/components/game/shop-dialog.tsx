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

const GemIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M7.77778 0L0 8.57143L14 24L28 8.57143L20.2222 0H7.77778Z" fill="url(#gem-gradient-1)"/>
        <path d="M14 0L7.77778 10.2857L20.2222 0H7.77778Z" fill="url(#gem-gradient-2)"/>
        <path d="M0 8.57143L7.77778 0H4.66667L0 8.57143Z" fill="#A149F8"/>
        <path d="M28 8.57143L20.2222 0H23.3333L28 8.57143Z" fill="#E286FF"/>
        <path d="M14 24L7.77778 10.2857L0 8.57143L14 24Z" fill="url(#gem-gradient-3)"/>
        <path d="M14 24L20.2222 10.2857L28 8.57143L14 24Z" fill="url(#gem-gradient-4)"/>
        <defs>
            <linearGradient id="gem-gradient-1" x1="14" y1="0" x2="14" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#D96CFF"/><stop offset="1" stopColor="#A149F8"/></linearGradient>
            <linearGradient id="gem-gradient-2" x1="14" y1="0" x2="14" y2="10.2857" gradientUnits="userSpaceOnUse"><stop stopColor="#F4B5FF"/><stop offset="1" stopColor="#E286FF"/></linearGradient>
            <linearGradient id="gem-gradient-3" x1="7" y1="8.57143" x2="7" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#D96CFF"/><stop offset="1" stopColor="#7328CB"/></linearGradient>
            <linearGradient id="gem-gradient-4" x1="21" y1="8.57143" x2="21" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#D96CFF"/><stop offset="1" stopColor="#7328CB"/></linearGradient>
        </defs>
    </svg>
);


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

const GemPurchaseCard = ({ amount, price, onPurchase, color = 'primary' }: { amount: number, price: string, onPurchase: () => void, color?: string }) => (
    <div className='flex flex-col items-center justify-between p-3 rounded-2xl bg-white/80 border-2 border-primary/30 shadow-lg h-full'>
        <GemIcon className='w-16 h-auto drop-shadow-lg' />
        <div className='text-center my-2'>
            <p className='font-bold text-xl text-primary-foreground drop-shadow-md'>{amount} Gems</p>
        </div>
        <Button onClick={onPurchase} size="sm" className='w-full font-bold'>
            {price}
        </Button>
    </div>
);


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
                    <GemPurchaseCard amount={100} price="$0.99" onPurchase={() => onAddGems(100)} />
                    <GemPurchaseCard amount={550} price="$4.99" onPurchase={() => onAddGems(550)} />
                    <GemPurchaseCard amount={1200} price="$9.99" onPurchase={() => onAddGems(1200)} />
                    <GemPurchaseCard amount={2500} price="$19.99" onPurchase={() => onAddGems(2500)} />
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
