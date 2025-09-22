'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/game');
  }, [router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
      <Loader className="animate-spin h-10 w-10 text-primary" />
      <p className="ml-4">Cargando juego...</p>
    </div>
  );
}
