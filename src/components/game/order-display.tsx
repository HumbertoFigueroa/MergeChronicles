'use client';

import { Send } from 'lucide-react';
import type { Order } from '@/lib/types';
import { ITEMS } from '@/lib/game-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrderDisplayProps {
    orders: Order[];
    onDeliverOrder: (orderId: string) => void;
}

const OrderItem = ({ order, onDeliver }: { order: Order; onDeliver: () => void; }) => {
    const firstItem = ITEMS[order.requiredItems[0].itemId];

    return (
        <div className={cn(
            "relative flex items-center justify-center gap-1 p-1.5 rounded-xl bg-card/80 border-2 transition-all duration-300",
            order.isCompletable ? "border-accent" : "border-transparent"
        )}>
            <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center text-xl flex-shrink-0">
                <span>{order.customerEmoji}</span>
            </div>
            <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center text-xl flex-shrink-0">
                 <span>{firstItem.emoji}</span>
            </div>
            {order.isCompletable && (
                 <Button 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full z-10 bg-green-500 hover:bg-green-600"
                    onClick={onDeliver}
                >
                    <Send className="h-3 w-3" />
                </Button>
            )}
        </div>
    );
}

export default function OrderDisplay({ orders, onDeliverOrder }: OrderDisplayProps) {
  return (
    <div className='w-full'>
        <div className="flex justify-center gap-1.5 overflow-x-auto p-1">
            {orders.length > 0 ? (
                orders.map(order => 
                    <OrderItem 
                        key={order.id} 
                        order={order} 
                        onDeliver={() => onDeliverOrder(order.id)}
                    />
                )
            ) : (
                <div className="text-center text-sm text-muted-foreground italic py-8">¡No hay nuevos pedidos!</div>
            )}
        </div>
    </div>
  );
}
