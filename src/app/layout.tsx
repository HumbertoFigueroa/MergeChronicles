import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Fredoka } from 'next/font/google'
import Script from 'next/script';

const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
})

export const metadata: Metadata = {
  title: 'Merge Chronicle',
  description: 'A merge game of historical evolution.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Merge Chronicle',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-2899297059049278" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
        <meta name="theme-color" content="#E0F2FE" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2899297059049278"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={cn(fredoka.variable, 'font-sans antialiased min-h-screen')}>
        {children}
      </body>
    </html>
  );
}
