'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Gem, Sparkles } from 'lucide-react';
import { STORY_DIALOGUES } from '@/lib/game-data';
import { findImage } from '@/lib/utils';
import GameBackground from '@/components/game/game-background';
import { useToast } from '@/hooks/use-toast';

const UNLOCK_COST = 15;

export default function StoryPage() {
  // This state would eventually come from a player data store (like Firestore)
  const [unlockedChapters, setUnlockedChapters] = useState(1);
  const [gems, setGems] = useState(25); // Placeholder for player gems
  const { toast } = useToast();

  const handleUnlockChapter = () => {
    if (gems >= UNLOCK_COST) {
      if (unlockedChapters < STORY_DIALOGUES.length) {
        setGems(g => g - UNLOCK_COST);
        setUnlockedChapters(u => u + 1);
        toast({
          title: "¡Capítulo Desbloqueado!",
          description: "Has revelado una nueva parte de la historia."
        });
      } else {
        toast({
          variant: "default",
          title: "La historia hasta ahora...",
          description: "Has desbloqueado todos los capítulos disponibles."
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "¡No hay suficientes gemas!",
        description: `Necesitas ${UNLOCK_COST} gemas para desbloquear el siguiente capítulo.`
      });
    }
  };

  const characterImage = findImage('character_avatar');

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center">
        <GameBackground />
        <div className="relative z-10 w-full max-w-4xl p-4 sm:p-8">
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
                <Button asChild variant="secondary" size="icon" className="h-12 w-12 rounded-full">
                    <Link href="/game">
                        <ArrowLeft />
                    </Link>
                </Button>
            </div>
            
            <header className="text-center my-8">
                <h1 className="font-headline text-5xl md:text-7xl font-bold drop-shadow-lg text-white flex items-center justify-center gap-4">
                    <BookOpen className="h-12 w-12" />
                    Fusion Historia
                </h1>
                <p className="mt-2 text-primary-foreground/90 drop-shadow-md">Desvela los secretos de tu pasado, capítulo a capítulo.</p>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card className="sticky top-24 shadow-2xl">
                        <CardHeader className="items-center text-center">
                            <div className="relative aspect-[3/4] w-48 rounded-lg overflow-hidden mb-4 border-4 border-primary/50">
                                <Image
                                    src={characterImage}
                                    alt="Character"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardTitle className="font-headline text-2xl">Tu Historia</CardTitle>
                            <CardDescription>Capítulos Revelados: {unlockedChapters} / {STORY_DIALOGUES.length}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button 
                                onClick={handleUnlockChapter} 
                                className="w-full text-lg" 
                                size="lg"
                                disabled={unlockedChapters >= STORY_DIALOGUES.length}
                            >
                                {unlockedChapters >= STORY_DIALOGUES.length ? (
                                    "Fin de la Historia (por ahora)"
                                ) : (
                                    <>
                                        <Sparkles className="mr-2" />
                                        Desbloquear Capítulo
                                        <Gem className="ml-2" /> {UNLOCK_COST}
                                    </>
                                )}
                            </Button>
                        </CardContent>
                        <CardFooter className='justify-center'>
                            <p className='text-sm text-muted-foreground'>Tus gemas: {gems}</p>
                        </CardFooter>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-4">
                    {STORY_DIALOGUES.slice(0, unlockedChapters).map((dialogue, index) => (
                        <Card key={index} className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Capítulo {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-card-foreground/90">{dialogue}</p>
                            </CardContent>
                        </Card>
                    ))}
                     {unlockedChapters < STORY_DIALOGUES.length && (
                        <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center bg-muted/30">
                            <CardTitle className="text-xl mb-2">Capítulo Bloqueado</CardTitle>
                            <CardDescription>El siguiente capítulo de tu historia espera ser descubierto. ¡Usa tus gemas para revelar qué sucede a continuación!</CardDescription>
                        </Card>
                     )}
                </div>
            </main>
        </div>
    </div>
  );
}
