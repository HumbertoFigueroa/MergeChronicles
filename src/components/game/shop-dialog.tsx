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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gem, Zap, Gift, Video, Wallet, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

const PurchaseForm = ({ onPurchase }: { onPurchase: (amount: number) => void }) => {
    const { toast } = useToast();
    const [selectedPackage, setSelectedPackage] = useState<{gems: number, price: string} | null>({gems: 550, price: '$4.99'});

    const packages = [
        { gems: 100, price: '$0.99' },
        { gems: 550, price: '$4.99' },
        { gems: 1200, price: '$9.99' },
        { gems: 2500, price: '$19.99' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPackage) {
            // Simulate successful payment
            onPurchase(selectedPackage.gems);
            toast({
                title: "¡Compra Exitosa!",
                description: `Has comprado ${selectedPackage.gems} gemas por ${selectedPackage.price}.`
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="gem-package">Paquete de Gemas</Label>
                <Select 
                    defaultValue={JSON.stringify(selectedPackage)} 
                    onValueChange={(value) => setSelectedPackage(JSON.parse(value))}
                >
                    <SelectTrigger id="gem-package">
                        <SelectValue placeholder="Selecciona un paquete" />
                    </SelectTrigger>
                    <SelectContent>
                        {packages.map(p => (
                            <SelectItem key={p.gems} value={JSON.stringify(p)}>
                                {p.gems} Gemas - {p.price}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="card-number">Número de Tarjeta</Label>
                <Input id="card-number" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <Label htmlFor="expiry">Expiración</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="flex-1">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                </div>
            </div>
            <Button type="submit" className="w-full">
                <CreditCard className="mr-2" /> Pagar {selectedPackage?.price}
            </Button>
            <p className="text-xs text-center text-muted-foreground pt-2">
                Esto es una simulación. No se realizará ningún cargo real.
            </p>
        </form>
    );
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
        onGenerateItem('clothing_1');
    }
  }
    
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl">Tienda</DialogTitle>
          <DialogDescription>
            Usa tus gemas o compra nuevas para acelerar tu progreso.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Real Money Purchases */}
            <Card className='md:col-span-1 bg-gradient-to-br from-yellow-100 to-orange-200'>
                 <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Wallet/> Comprar Gemas</CardTitle>
                    <CardDescription>¡Acelera tu progreso!</CardDescription>
                </CardHeader>
                <CardContent>
                    <PurchaseForm onPurchase={onAddGems} />
                </CardContent>
            </Card>

            {/* Gem Purchases */}
            <Card className='md:col-span-1'>
                 <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Gem className='text-blue-500'/> Gastar Gemas</CardTitle>
                     <CardDescription>Usa tus gemas que tanto te costó ganar.</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-4 pt-6'>
                    <ShopItem 
                        title="Recarga de Energía"
                        description="Obtén 50 de energía."
                        icon={<Zap className='w-6 h-6 text-yellow-500'/>}
                        actionText="Comprar"
                        onAction={handleBuyEnergy}
                        cost={10}
                        disabled={gems < 10}
                    />
                     <ShopItem 
                        title="Caja de Sastre"
                        description="Un generador de tela nivel 1."
                        icon={<Gift className='w-6 h-6 text-red-500'/>}
                        actionText="Comprar"
                        onAction={handleBuyItem}
                        cost={20}
                        disabled={gems < 20}
                    />
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
