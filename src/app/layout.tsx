import type { Metadata, Viewport } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";

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

/* URL canonique de production (Task 33 — SEO) : fixée en dur pour que
   les balises OG/Twitter et le canonical pointent TOUJOURS vers le
   domaine public — l'ancien repli VERCEL_URL générait des URLs de
   déploiement (mrsteveenglish-2j3enoeuq-…) qui changeaient à chaque
   mise en ligne. */
const SITE_URL = "https://mrsteveenglish.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL,
  ),
  // Page unique (SPA hash-routée) : canonical vers la racine (Task 33).
  alternates: {
    canonical: "/",
  },
  title: "Stevens AKPOVI — Coach d'anglais",
  description:
    "Programme « De Comprendre à Parler » — 03 mois de coaching d'anglais personnalisé, 70 000 FCFA, paiement unique. Parle anglais avec confiance, en t'exprimant vraiment, dès la première séance.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Stevens AKPOVI — Coach d'anglais",
    description:
      "03 mois pour transformer ton anglais que tu comprends en anglais que tu oses vraiment parler.",
    type: "website",
    locale: "fr_FR",
    siteName: "Stevens AKPOVI",
    images: [
      {
        url: "/assets/OG-SOCIAL.png",
        width: 1200,
        height: 630,
        alt:
          "03 mois pour transformer ton anglais que tu comprends en anglais que tu oses vraiment parler.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stevens AKPOVI — Coach d'anglais",
    description:
      "03 mois pour transformer ton anglais que tu comprends en anglais que tu oses vraiment parler.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

/* Données structurées JSON-LD (Task 33 — SEO) : Person (le coach) +
   Service (le programme) avec Offer (prix réel, XOF = franc CFA).
   Aide Google à comprendre QUI vend QUOI et à combien — rich snippets
   potentiels sur les requêtes coach d'anglais. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Stevens AKPOVI",
      alternateName: "Mr Steve English",
      jobTitle: "Coach d'anglais",
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/assets/POURQUOI-MOI.webp`,
      description:
        "Coach d'anglais en ligne pour francophones — accompagne ceux qui comprennent l'anglais mais n'osent pas le parler.",
      knowsLanguage: ["fr", "en"],
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service`,
      name: "Programme « De Comprendre à Parler »",
      serviceType: "Coaching d'anglais personnalisé en ligne",
      provider: { "@id": `${SITE_URL}/#person` },
      areaServed: "Afrique francophone",
      inLanguage: "fr",
      description:
        "03 mois de coaching d'anglais personnalisé en ligne — trois séances de 1h30 par semaine, pour passer de la compréhension à la parole.",
      offers: {
        "@type": "Offer",
        price: "70000",
        priceCurrency: "XOF",
        url: `${SITE_URL}/#/programme`,
        description:
          "03 mois de coaching d'anglais personnalisé — paiement unique",
        availability: "https://schema.org/InStock",
      },
    },
  ],
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
        {/* Task 36 (anti-flash deep-link) : script inline PARSEUR-BLOQUANT,
            exécuté AVANT le premier rendu. Le shell statique rend toujours
            l'accueil ; si le hash vise une page secondaire connue
            (rechargement direct de …/#/bienvenue, #/contact…), on pose
            data-deeplink sur <html> : la règle CSS de globals.css masque
            le shell accueil et page.tsx le révèle dès que la bonne page
            est rendue. Repli : le script retire lui-même l'attribut après
            4 s si l'hydratation n'a pas abouti (le site n'est jamais
            laissé masqué). NB : « faq » rend l'accueil → pas de masquage ;
            les hashs inconnus ne masquent rien non plus. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var h=(location.hash||'').replace(/^#\\/?/,'').split('?')[0].replace(/\\/+$/,'');var k={'a-propos':1,'resultats':1,'programme':1,'offres':1,'contact':1,'bienvenue':1};if(!k[h])return;document.documentElement.setAttribute('data-deeplink',h);setTimeout(function(){document.documentElement.removeAttribute('data-deeplink')},4000)}catch(e){}})();",
          }}
        />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
