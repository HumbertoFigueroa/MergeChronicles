'use client';

import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';

const GameLayout = dynamic(() => import('@/components/game/game-layout'), {
  loading: () => (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
      <Loader className="animate-spin h-10 w-10 text-primary" />
      <p className="ml-4">Cargando juego...</p>
    </div>
  ),
  ssr: false,
});

export default function HomePage() {
  return <GameLayout />;
}
