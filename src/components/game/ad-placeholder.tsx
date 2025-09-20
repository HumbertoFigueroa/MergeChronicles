import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clapperboard } from 'lucide-react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RewardedAdProps {
    onReward: () => void;
}

export default function RewardedAd({ onReward }: RewardedAdProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAdClick = () => {
        setIsLoading(true);
        // Simulate watching an ad
        setTimeout(() => {
            onReward();
            setIsLoading(false);
        }, 1500);
    };

    return (
        <Card className="h-48 flex flex-col items-center justify-center bg-muted/30 border-dashed text-center">
             <CardHeader className='pb-2'>
                <Clapperboard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <CardTitle className="text-lg">¡Obtén una recompensa!</CardTitle>
             </CardHeader>
            <CardContent>
                <CardDescription className='mb-3'>Obtén un nuevo objeto gratis.</CardDescription>
                <Button onClick={handleAdClick} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cargando...
                        </>
                    ) : (
                        "Ver anuncio para recompensa"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
