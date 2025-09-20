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
import { Gem, Zap, Gift, CreditCard, ShoppingBag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ShopDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPurchaseGems: (amount: number, price: string) => void;
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
    <Card className='text-center flex flex-col'>
        <CardHeader className='pb-2'>
            <div className='w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2'>
                {icon}
            </div>
            <CardTitle className='text-lg'>{title}</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
        </CardHeader>
        <CardContent className='flex-grow' />
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

const GemPurchaseItem = ({ gemsAmount, price, onPurchase }: { gemsAmount: number; price: string; onPurchase: (amount: number, price: string) => void; }) => (
    <Card className='text-center flex flex-col'>
        <CardHeader className='pb-2'>
             <div className='w-16 h-16 mx-auto flex items-center justify-center mb-2'>
                <Gem className='w-full h-full text-blue-500 drop-shadow-lg' />
            </div>
            <CardTitle className='text-xl font-bold'>{gemsAmount.toLocaleString()}</CardTitle>
            <CardDescription>Gemas</CardDescription>
        </CardHeader>
        <CardContent className='flex-grow' />
        <CardFooter>
            <Button onClick={() => onPurchase(gemsAmount, price)} className='w-full font-bold text-lg'>
                {price}
            </Button>
        </CardFooter>
    </Card>
);


export default function ShopDialog({
  isOpen,
  onOpenChange,
  onPurchaseGems,
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
        onGenerateItem('clothing_1');
    }
  }
    
  const gemPackages = [
      { gems: 100, price: '$0.99' },
      { gems: 550, price: '$4.99' },
      { gems: 1200, price: '$9.99' },
      { gems: 2500, price: '$19.99' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl flex items-center gap-2"><ShoppingBag/>Tienda</DialogTitle>
          <DialogDescription>
            Usa tus gemas o compra nuevas para acelerar tu progreso.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="spend" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="spend"><Gem className="mr-2"/>Gastar Gemas</TabsTrigger>
                <TabsTrigger value="buy"><CreditCard className="mr-2"/>Comprar Gemas</TabsTrigger>
            </TabsList>
            <TabsContent value="spend" className="mt-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ShopItem 
                        title="Recarga de Energía"
                        description="Obtén 50 de energía al instante."
                        icon={<Zap className='w-6 h-6 text-yellow-500'/>}
                        actionText="Comprar"
                        onAction={handleBuyEnergy}
                        cost={10}
                        disabled={gems < 10}
                    />
                     <ShopItem 
                        title="Caja de Sastre"
                        description="Recibe un objeto de Ropa de nivel 1."
                        icon={<Gift className='w-6 h-6 text-red-500'/>}
                        actionText="Comprar"
                        onAction={handleBuyItem}
                        cost={20}
                        disabled={gems < 20}
                    />
                </div>
            </TabsContent>
            <TabsContent value="buy" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gemPackages.map(pkg => (
                        <GemPurchaseItem 
                            key={pkg.gems}
                            gemsAmount={pkg.gems}
                            price={pkg.price}
                            onPurchase={onPurchaseGems}
                        />
                    ))}
                </div>
                 <p className="text-xs text-center text-muted-foreground pt-4">
                    Las compras son procesadas de forma segura. Este es un entorno de simulación.
                </p>
            </TabsContent>
        </Tabs>
        
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
