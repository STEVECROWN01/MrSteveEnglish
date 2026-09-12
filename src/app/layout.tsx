import type { Metadata, Viewport } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

/**
 * Polices verrouillées (DA §6) : Fraunces (display, variable, italiques
 * incluses pour les citations témoignage) + Public Sans (texte/UI).
 * font-display: swap + sous-ensemble latin (DA §17 Performance).
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase : URL de production si définie, sinon URL Vercel au build,
  // sinon localhost (dev). Nécessaire pour résoudre les images OG absolues.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  ),
  title: "Coach Stevens — Coach d'anglais",
  description:
    "Coach Stevens t'accompagne pour parler anglais avec aisance en 2 à 3 mois — pas en révisant des règles, mais en t'exprimant, vraiment, dès la première séance.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Coach Stevens — Coach d'anglais",
    description:
      "Parler anglais avec aisance. Pas dans 2 ans. Dans 2 à 3 mois.",
    type: "website",
    locale: "fr_FR",
    siteName: "Coach Stevens",
    images: [
      {
        url: "/assets/OG-SOCIAL.png",
        width: 1200,
        height: 630,
        alt: "Parler anglais avec aisance. Pas dans 2 ans. Dans 2 à 3 mois.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coach Stevens — Coach d'anglais",
    description:
      "Parler anglais avec aisance. Pas dans 2 ans. Dans 2 à 3 mois.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${publicSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
