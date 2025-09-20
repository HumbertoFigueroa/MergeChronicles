import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.5 69.5c-24.3-23.2-57.5-37.3-95.4-37.3-74.3 0-134.3 60-134.3 134.3s60 134.3 134.3 134.3c82.3 0 119-54.2 123.6-82.9H248v-87.3h239.9c1.5 12.6 2.1 26.2 2.1 40.2z"></path>
    </svg>
);

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero_1');

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
      <Image
        src={heroImage?.imageUrl || 'https://picsum.photos/seed/1/1920/1080'}
        alt="Romantic fashion illustration"
        fill
        className="object-cover z-0 brightness-50"
        data-ai-hint="fashion game"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
      <div className="relative z-20 flex flex-col items-center text-center text-white">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold drop-shadow-lg">
          Fusion Historia
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90 drop-shadow-md">
          Unleash your inner designer and weave your own romance. Merge beautiful items, create stunning outfits, and watch your story unfold.
        </p>
        <Button asChild size="lg" className="mt-8 text-lg font-bold">
          <Link href="/game" className='flex items-center justify-center'>
            <GoogleIcon />
            Continuar con Google
          </Link>
        </Button>
      </div>
    </main>
  );
}
