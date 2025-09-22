'use client';

import { useRef, useCallback } from 'react';

const soundFiles = {
  'merge-pop': '/audio/merge-pop.wav',
};

type SoundEffect = keyof typeof soundFiles;

export function useSoundEffects(volume: number) {
  const audioPlayers = useRef<Record<string, HTMLAudioElement[]>>({});

  const playSound = useCallback((sound: SoundEffect, poolSize = 3) => {
    if (volume === 0) return;

    if (!audioPlayers.current[sound]) {
      audioPlayers.current[sound] = Array.from({ length: poolSize }, () => new Audio(soundFiles[sound]));
    }

    const players = audioPlayers.current[sound];
    let player = players.find(p => p.paused);

    if (!player) {
      // If all players are busy, find the one that is closest to finishing
      // or just reuse the first one. This prevents sound cutoff.
      player = players.reduce((prev, curr) => {
        return (prev.currentTime > curr.currentTime) ? curr : prev;
      });
    }

    player.volume = volume;
    player.currentTime = 0;
    player.play().catch(error => {
      // Don't log the "interrupted" error, as it's expected when playing sounds quickly.
      if (error.name !== 'AbortError') {
        console.error(`Error playing sound ${sound}:`, error)
      }
    });
  }, [volume]);

  return { playSound };
}
