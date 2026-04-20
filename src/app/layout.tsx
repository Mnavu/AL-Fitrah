"use client";

import { useEffect } from 'react';
import './globals.css';
import { Playfair_Display, Lato } from 'next/font/google';
import { Toaster } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { STATIC_ASSETS } from '@/lib/assets';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['100', '300', '400', '700', '900'],
  display: 'swap',
});

function CopyProtection() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+X, Ctrl+U (view source), and Cmd variants on Mac
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 'x' || e.key === 'u' || e.key === 's')
      ) {
        e.preventDefault();
      }
      
      // Prevent F12 (Inspect Element)
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Al-Fitrah Training Institute</title>
        <meta name="description" content="Woven into the fabric of Excellence." />
        <link rel="icon" href={STATIC_ASSETS.logo} />
      </head>
      <body className={`${playfairDisplay.variable} ${lato.variable} font-sans bg-canvas text-primary flex flex-col min-h-screen`}>
        <CopyProtection />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
