'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scroll, Gem, CheckCircle2 } from 'lucide-react';
import type { Order } from '@/lib/types';
import { ITEMS } from '@/lib/game-data';

interface OrderDisplayProps {
    orders: Order[];
    onCompleteOrder: (order: Order) => void;
}

const OrderItem = ({ order, onComplete }: { order: Order; onComplete: () => void; }) => {
    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Required Items:</p>
                <div className='flex flex-wrap gap-2'>
                {order.requiredItems.map(({ itemId, quantity }) => {
                    const item = ITEMS[itemId];
                    return (
                        <div key={itemId} className="flex items-center gap-2 bg-muted/70 p-1.5 rounded-md text-xs">
                             <div className="relative w-10 h-10 bg-background rounded-sm">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-contain"
                                    sizes="40px"
                                />
                            </div>
                            <span>{item.name} x {quantity}</span>
                        </div>
                    );
                })}
                </div>
            </div>
             <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Reward:</p>
                <div className="flex items-center gap-1 font-semibold">
                    <Gem className="h-4 w-4 text-blue-500" />
                    <span>{order.reward.gems}</span>
                </div>
            </div>
            <Button onClick={onComplete} className="w-full">
                <CheckCircle2 className="mr-2" />
                Complete Order
            </Button>
        </div>
    );
}


export default function OrderDisplay({ orders, onCompleteOrder }: OrderDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Scroll className="h-6 w-6" />
          Orders
        </CardTitle>
        <CardDescription>Complete orders to earn gems!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.length > 0 ? (
            orders.map(order => <OrderItem key={order.id} order={order} onComplete={() => onCompleteOrder(order)} />)
        ) : (
            <p className="text-sm text-muted-foreground italic text-center">No new orders at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
}
