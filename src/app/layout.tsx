import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Fredoka } from 'next/font/google'

const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
})

export const metadata: Metadata = {
  title: 'Merge Chronicle',
  description: 'A merge game of historical evolution.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
      <body className={cn(fredoka.variable, 'font-sans antialiased min-h-screen')}>
        {children}
      </body>
    </html>
  );
}
