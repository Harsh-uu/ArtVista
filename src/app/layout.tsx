// src/app/layout.tsx
import type { Metadata } from 'next';
import { Outfit, Playfair_Display, Manrope } from 'next/font/google'; // Import fonts needed globally or for CSS variables
import './globals.css';
import { Toaster } from 'sonner'; // Import Toaster

// Initialize fonts
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit', // Optional: if you want to use it as a CSS variable elsewhere
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair', // This variable is used in tailwind.config.ts
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',   // This variable is used in tailwind.config.ts
});

export const metadata: Metadata = {
  title: 'ArtVista - Digital Art Marketplace',
  description: 'Discover and collect unique digital masterpieces.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} ${manrope.variable}`}>
      {/*
        The `className` on the body applies the Outfit font globally via its .className.
        The CSS variables (--font-playfair, --font-manrope) are available for Tailwind.
      */}
      <body className={`${outfit.className} bg-secondary text-white`}>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}