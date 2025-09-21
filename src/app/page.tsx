'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from 'lucide-react';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.5 69.5c-24.3-23.2-57.5-37.3-95.4-37.3-74.3 0-134.3 60-134.3 134.3s60 134.3 134.3 134.3c82.3 0 119-54.2 123.6-82.9H248v-87.3h239.9c1.5 12.6 2.1 26.2 2.1 40.2z"></path>
    </svg>
);

export default function HomePage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/game');
    }
  }, [user, router]);
  
  const bgImage = "https://picsum.photos/seed/login_bg/1200/800";

  if (loading || user) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
        <Loader className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <Image
        src={bgImage}
        alt="Fashion sketches"
        fill
        className="object-cover z-0 brightness-50"
        data-ai-hint="fashion studio"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
      
      <Card className="w-full max-w-md z-20 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl">¡Te damos la bienvenida!</CardTitle>
          <CardDescription>
            Inicia sesión para guardar tu progreso en la moda.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Button variant="outline" className="w-full font-bold" size="lg" onClick={signInWithGoogle}>
              <GoogleIcon />
              Continuar con Google
          </Button>
          <div className="my-4 flex items-center">
            <Separator className="flex-1" />
            <span className="mx-4 text-xs text-muted-foreground">O</span>
            <Separator className="flex-1" />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            El inicio de sesión con email no está disponible.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
