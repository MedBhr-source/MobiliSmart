import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export const metadata: Metadata = {
  title: 'Mobilismart — Mobilité Urbaine Intelligente',
  description: 'Planifiez vos déplacements multimodaux avec intelligence artificielle. Métro, bus, vélo, marche — optimisez votre trajet en temps, coût et impact carbone.',
  keywords: ['mobilité urbaine', 'transport', 'multimodal', 'vélo', 'métro', 'bus', 'IA', 'Paris'],
  authors: [{ name: 'Mobilismart' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Mobilismart — Mobilité Urbaine Intelligente',
    description: 'Planifiez vos trajets multimodaux optimisés avec IA',
    type: 'website',
    locale: 'fr_FR',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050a18',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className={`min-h-screen bg-[#050a18] text-surface-200 overflow-x-hidden ${inter.variable} ${outfit.variable}`}>
        {/* Ambient background glows */}
        <div className="ambient-glow ambient-glow-blue" />
        <div className="ambient-glow ambient-glow-green" />

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
