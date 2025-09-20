'use client';

import { useState } from 'react';
import GameLayout from '@/components/game/game-layout';

export default function GamePage() {
  const [gameState, setGameState] = useState({
    level: 1,
    xp: 0,
    energy: 100,
    gems: 25,
    unlockedStoryParts: 1,
  });

  return <GameLayout gameState={gameState} setGameState={setGameState} />;
}
