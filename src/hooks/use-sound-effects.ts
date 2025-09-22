'use client';

import { useRef, useCallback } from 'react';

const soundFiles = {
  'merge-pop': '/audio/merge-pop.mp3',
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
      player = players[0]; // Fallback to the first player if all are busy
    }

    player.volume = volume;
    player.currentTime = 0;
    player.play().catch(error => console.error(`Error al reproducir el sonido ${sound}:`, error));
  }, [volume]);

  return { playSound };
}

    