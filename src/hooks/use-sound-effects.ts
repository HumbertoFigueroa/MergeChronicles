'use client';

import { useCallback } from 'react';

const soundEffects: { [key: string]: HTMLAudioElement } = {};

const preloadSound = (name: string, src: string) => {
  if (typeof window !== 'undefined') {
    soundEffects[name] = new Audio(src);
  }
};

// Preload sounds on module load
preloadSound('merge-pop', '/audio/merge-pop.wav');

export function useSoundEffects(volume: number) {
  const playSound = useCallback((sound: 'merge-pop') => {
    const audio = soundEffects[sound];
    if (audio) {
      // Allows for rapid-fire playback by resetting the sound
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(error => {
        // This catch block is important to handle potential browser restrictions
        // on autoplaying audio, although our click-to-play logic should prevent this.
        console.error(`Error playing sound ${sound}:`, error);
      });
    }
  }, [volume]);

  return { playSound };
}
