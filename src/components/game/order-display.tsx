'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, CheckCircle2 } from 'lucide-react';
import type { Order } from '@/lib/types';
import { ITEMS } from '@/lib/game-data';

interface OrderDisplayProps {
    orders: Order[];
    onCompleteOrder: (order: Order) => void;
}

const OrderItem = ({ order, onComplete }: { order: Order; onComplete: () => void; }) => {
    const firstItem = ITEMS[order.requiredItems[0].itemId];
    return (
        <Card className="flex items-center p-3">
             <div className="relative w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-3xl" role="img" aria-label={firstItem.name}>
                    {firstItem.emoji}
                </span>
            </div>
            <div className='flex-grow'>
                <div className='flex items-center justify-between'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                        <span>{order.customerEmoji}</span>
                        {firstItem.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 font-semibold text-blue-500">
                        <Gem className="h-4 w-4" />
                        <span>{order.reward.gems}</span>
                    </div>
                </div>
                <CardDescription>Pedido del cliente</CardDescription>
                <Button onClick={onComplete} size="sm" className="w-full mt-2">
                    <CheckCircle2 className="mr-2" />
                    Completar
                </Button>
            </div>
        </Card>
    );
}

export default function OrderDisplay({ orders, onCompleteOrder }: OrderDisplayProps) {
  return (
    <div className='w-full'>
        <div className="h-40 overflow-y-auto space-y-2 p-1">
            {orders.length > 0 ? (
                orders.map(order => <OrderItem key={order.id} order={order} onComplete={() => onCompleteOrder(order)} />)
            ) : (
                <div className="text-center text-sm text-muted-foreground italic py-8">No hay nuevos pedidos.</div>
            )}
        </div>
    </div>
  );
}
