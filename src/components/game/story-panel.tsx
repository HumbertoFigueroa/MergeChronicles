'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, Sparkles } from 'lucide-react';

interface StoryPanelProps {
  storyProgress: string;
  dialogue: string | null;
  isThinking: boolean;
}

const TypingEffect = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
          onComplete();
        }
      }, 30);
      return () => clearInterval(intervalId);
    }
  }, [text, onComplete]);

  return <p className="text-foreground/90 leading-relaxed">{displayedText}<span className="animate-ping">_</span></p>;
};

export default function StoryPanel({ storyProgress, dialogue, isThinking }: StoryPanelProps) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (dialogue) {
      setIsTyping(true);
    }
  }, [dialogue]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <ScrollText className="h-6 w-6" />
          Story
        </CardTitle>
        <CardDescription>{storyProgress}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm prose-p:my-2 min-h-[100px] bg-muted/50 p-4 rounded-lg border">
          {isThinking ? (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
            </div>
          ) : dialogue ? (
            <TypingEffect text={dialogue} onComplete={() => setIsTyping(false)} />
          ) : (
            <p className="text-muted-foreground italic">Merge items to see what happens next...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
