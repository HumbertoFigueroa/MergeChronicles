'use client';

import Link from 'next/link';

export default function GameHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-headline text-2xl font-bold text-primary-600">
          Merge Chronicle
        </Link>
        {/* Placeholder for potential future icons or buttons */}
        <div></div>
      </div>
    </header>
  );
}
