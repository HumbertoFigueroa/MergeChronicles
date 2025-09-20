'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem } from 'lucide-react';
import type { Order } from '@/lib/types';
import { ITEMS } from '@/lib/game-data';

const GEMS_PER_LEVEL = 5;

interface OrderDisplayProps {
    orders: Order[];
}

const OrderItem = ({ order }: { order: Order; }) => {
    const firstItem = ITEMS[order.requiredItems[0].itemId];
    const estimatedReward = firstItem.level * GEMS_PER_LEVEL;

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
                        <span>~{estimatedReward}</span>
                    </div>
                </div>
                <CardDescription>Pedido del cliente. ¡Completa fusionando!</CardDescription>
            </div>
        </Card>
    );
}

export default function OrderDisplay({ orders }: OrderDisplayProps) {
  return (
    <div className='w-full'>
        <div className="h-40 overflow-y-auto space-y-2 p-1">
            {orders.length > 0 ? (
                orders.map(order => <OrderItem key={order.id} order={order} />)
            ) : (
                <div className="text-center text-sm text-muted-foreground italic py-8">¡No hay nuevos pedidos!</div>
            )}
        </div>
    </div>
  );
}
