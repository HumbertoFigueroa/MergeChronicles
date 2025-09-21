import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Fredoka } from 'next/font/google'
import { AuthProvider } from '@/hooks/use-auth';

const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
})

export const metadata: Metadata = {
  title: 'Fusion Historia',
  description: 'A merge game of fashion and romance.',
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
