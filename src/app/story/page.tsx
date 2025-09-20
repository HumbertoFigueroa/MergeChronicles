'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, BookOpen, Coins, Sparkles, Lock } from 'lucide-react';
import { LILY_STORY_CHAPTERS } from '@/lib/story-data';
import GameBackground from '@/components/game/game-background';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';

const UNLOCK_COST = 15;
const TOTAL_MINI_STORIES = LILY_STORY_CHAPTERS.flatMap(c => c.stories).length;

export default function StoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from URL or use defaults
  const [unlockedMiniStories, setUnlockedMiniStories] = useState(() => {
    const p = searchParams.get('unlocked');
    return p ? parseInt(p, 10) : 1;
  });
  const [gems, setGems] = useState(() => {
    const g = searchParams.get('gems');
    return g ? parseInt(g, 10) : 25;
  });
    const [coins, setCoins] = useState(() => {
    const c = searchParams.get('coins');
    return c ? parseInt(c, 10) : 0;
  });
  const [playerLevel, setPlayerLevel] = useState(() => {
    const l = searchParams.get('level');
    return l ? parseInt(l, 10) : 1;
  });

  const { toast } = useToast();

  // Effect to update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('gems', gems.toString());
    params.set('coins', coins.toString());
    params.set('unlocked', unlockedMiniStories.toString());
    params.set('level', playerLevel.toString());
    router.replace(`/story?${params.toString()}`);
  }, [unlockedMiniStories, gems, coins, playerLevel, router]);

  const handleUnlockStory = () => {
    if (coins >= UNLOCK_COST) {
      if (unlockedMiniStories < TOTAL_MINI_STORIES) {
        setCoins(c => c - UNLOCK_COST);
        setUnlockedMiniStories(u => u + 1);
        toast({
          title: "¡Nuevo Recuerdo Desbloqueado!",
          description: "Has revelado una nueva parte de la historia."
        });
      } else {
        toast({
          variant: "default",
          title: "La historia hasta ahora...",
          description: "Has desbloqueado todos los recuerdos disponibles."
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "¡No hay suficientes monedas!",
        description: `Necesitas ${UNLOCK_COST} monedas para desbloquear el siguiente recuerdo.`
      });
    }
  };

  const createGameLink = () => {
    const params = new URLSearchParams();
    params.set('gems', gems.toString());
    params.set('coins', coins.toString());
    params.set('unlocked', unlockedMiniStories.toString());
    params.set('level', playerLevel.toString());
    // Also pass XP and energy if they were passed to this page
    const xp = searchParams.get('xp');
    const energy = searchParams.get('energy');
    if (xp) params.set('xp', xp);
    if (energy) params.set('energy', energy);
    return `/game?${params.toString()}`;
  };

  let storyCounter = 0;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center">
        <GameBackground />
        <div className="relative z-10 w-full max-w-4xl p-4 sm:p-8">
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
                <Button asChild variant="secondary" size="icon" className="h-12 w-12 rounded-full">
                    <Link href={createGameLink()}>
                        <ArrowLeft />
                    </Link>
                </Button>
            </div>
            
            <header className="text-center my-8">
                <h1 className="font-headline text-5xl md:text-7xl font-bold drop-shadow-lg text-white flex items-center justify-center gap-4">
                    <BookOpen className="h-12 w-12" />
                    Tu Aventura
                </h1>
                <p className="mt-2 text-primary-foreground/90 drop-shadow-md">Desvela los secretos de tu mundo, recuerdo a recuerdo.</p>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card className="sticky top-24 shadow-2xl">
                        <CardHeader className="items-center text-center">
                             <div className="relative w-48 h-48 rounded-lg overflow-hidden mb-4 border-4 border-primary/50 bg-muted flex items-center justify-center">
                                <Image
                                    src="https://picsum.photos/seed/lily/400/400"
                                    alt="Lily"
                                    fill
                                    className="object-cover"
                                    data-ai-hint="happy girl"
                                />
                            </div>
                            <CardTitle className="font-headline text-2xl">La Historia de Lily</CardTitle>
                            <CardDescription>Recuerdos: {unlockedMiniStories} / {TOTAL_MINI_STORIES}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button 
                                onClick={handleUnlockStory} 
                                className="w-full text-lg" 
                                size="lg"
                                disabled={unlockedMiniStories >= TOTAL_MINI_STORIES}
                            >
                                {unlockedMiniStories >= TOTAL_MINI_STORIES ? (
                                    "Fin de la Historia (por ahora)"
                                ) : (
                                    <>
                                        <Sparkles className="mr-2" />
                                        Desbloquear Recuerdo
                                        <Coins className="ml-2" /> {UNLOCK_COST}
                                    </>
                                )}
                            </Button>
                        </CardContent>
                        <CardFooter className='justify-center'>
                            <p className='text-sm text-muted-foreground'>Tus monedas: {coins}</p>
                        </CardFooter>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-2">
                    <Accordion type="multiple" defaultValue={['chapter-1']} className="w-full">
                        {LILY_STORY_CHAPTERS.map((chapter, chapterIndex) => {
                            const isChapterUnlocked = playerLevel >= chapter.unlockLevel;

                            if (!isChapterUnlocked) {
                                return (
                                     <AccordionItem value={`chapter-${chapter.chapter}`} key={chapter.chapter} disabled>
                                        <AccordionTrigger className='font-headline text-2xl bg-card/50 px-4 rounded-lg text-muted-foreground/50'>
                                            <Lock className='mr-2' />
                                            Capítulo {chapter.chapter}: {chapter.title} (Nivel {chapter.unlockLevel})
                                        </Trigger>
                                        <AccordionContent>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            }
                            
                            const chapterBaseCount = LILY_STORY_CHAPTERS.slice(0, chapterIndex).reduce((acc, chap) => acc + chap.stories.length, 0);
                            
                            return (
                                <AccordionItem value={`chapter-${chapter.chapter}`} key={chapter.chapter}>
                                    <AccordionTrigger className='font-headline text-2xl bg-card/80 px-4 rounded-lg'>
                                        Capítulo {chapter.chapter}: {chapter.title}
                                    </AccordionTrigger>
                                    <AccordionContent className='pt-2'>
                                        <div className="space-y-4 p-1">
                                            {chapter.stories.map((story, storyIndex) => {
                                                storyCounter++;
                                                const currentStoryIndex = chapterBaseCount + storyIndex + 1;
                                                if (currentStoryIndex > unlockedMiniStories) {
                                                    return (
                                                        <Card key={storyCounter} className="border-dashed flex flex-col items-center justify-center p-6 text-center bg-muted/30">
                                                            <Lock className='w-8 h-8 text-muted-foreground mb-2' />
                                                            <CardTitle className="text-lg">Recuerdo Bloqueado</CardTitle>
                                                        </Card>
                                                    );
                                                }
                                                return (
                                                    <Card key={storyCounter} className="shadow-lg">
                                                        <CardHeader>
                                                            <CardTitle className="text-base flex items-center justify-between">
                                                                <span>Recuerdo {story.part}</span>
                                                                <span className="text-xl">{story.emojis}</span>
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="flex flex-col sm:flex-row gap-4">
                                                            <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                                                <Image
                                                                    src={`https://picsum.photos/seed/story${storyCounter}/200/200`}
                                                                    alt={`Ilustración para el recuerdo ${storyCounter}`}
                                                                    fill
                                                                    className="object-cover"
                                                                    data-ai-hint={story.illustration.split(' ').slice(0, 2).join(' ')}
                                                                />
                                                            </div>
                                                            <p className="text-card-foreground/90 text-sm">{story.text}</p>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </div>
            </main>
        </div>
    </div>
  );
}
