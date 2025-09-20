import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

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
          <Link href="/game">
            Enter the World of Fashion <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
