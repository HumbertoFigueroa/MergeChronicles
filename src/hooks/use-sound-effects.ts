'use client';

import { useRef, useCallback } from 'react';

// Using a shared AudioContext for performance
let audioContext: AudioContext | null = null;
const getAudioContext = () => {
  if (typeof window !== 'undefined' && !audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export function useSoundEffects(volume: number) {
  const playSound = useCallback((sound: 'merge-pop') => {
    const context = getAudioContext();
    if (!context || volume === 0) return;
    
    // Resume context if it's suspended (required by modern browsers)
    if (context.state === 'suspended') {
      context.resume();
    }

    if (sound === 'merge-pop') {
      try {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        // Create a short, high-pitched "pop" sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, context.currentTime); // Start pitch
        oscillator.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.1); // Pitch drops quickly

        gainNode.gain.setValueAtTime(volume * 0.5, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.1);
      } catch (error) {
        console.error("Error playing sound with Web Audio API:", error);
      }
    }
  }, [volume]);

  return { playSound };
}
