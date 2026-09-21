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

/* (Task 48) Les métadonnées ICI ne servent plus que de VALEURS PAR
   DÉFAUT : chaque page (app/<route>/page.tsx) exporte ses propres title /
   description / canonical / openGraph — c'est la base du référencement
   multi-pages. */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL,
  ),
  title:
    "Coach d'anglais en ligne pour francophones — Stevens AKPOVI",
  description:
    "Programme « De Comprendre à Parler™ » — 03 mois de coaching d'anglais personnalisé, 70 000 FCFA, paiement unique. Parle anglais avec confiance, en t'exprimant vraiment, dès la première séance.",
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

/* Données structurées JSON-LD (Task 33 — SEO, enrichi Task 48) :
   Person (le coach, avec sameAs vers ses réseaux officiels) +
   Service (le programme) avec Offer (prix réel, XOF = franc CFA) et
   areaServed = Afrique francophone (cible commerciale déclarée par le
   propriétaire). Aide Google à comprendre QUI vend QUOI, À QUI et À
   COMBIEN — rich snippets potentiels sur les requêtes coach d'anglais. */
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
      sameAs: [
        "https://www.facebook.com/Mr.SteveEnglish",
        "https://www.youtube.com/@Mr.SteveEnglish",
      ],
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service`,
      name: "Programme « De Comprendre à Parler™ »",
      serviceType: "Coaching d'anglais personnalisé en ligne",
      provider: { "@id": `${SITE_URL}/#person` },
      areaServed: [
        "Togo",
        "Bénin",
        "Côte d'Ivoire",
        "Sénégal",
        "Burkina Faso",
        "Mali",
        "Niger",
        "Guinée",
        "Cameroun",
        "Gabon",
        "Congo",
        "République démocratique du Congo",
        "Tchad",
        "Maroc",
        "Algérie",
        "Tunisie",
        "Afrique francophone",
      ].map((name) => ({ "@type": "Country", name })),
      availableLanguage: ["fr", "en"],
      inLanguage: "fr",
      description:
        "03 mois de coaching d'anglais personnalisé en ligne — trois séances de 1h30 par semaine, pour passer de la compréhension à la parole.",
      offers: {
        "@type": "Offer",
        price: "70000",
        priceCurrency: "XOF",
        url: `${SITE_URL}/programme`,
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
        {/* Task 48 — COMPATIBILITÉ ANCIENS LIENS #/ (critique) :
            script inline PARSEUR-BLOQUANT, exécuté AVANT le premier
            rendu sur chaque page. Des centaines de liens partagés
            (WhatsApp, réseaux, URL de retour du système de paiement
            configurée par le propriétaire) pointent vers l'ancien
            routage hash : …/#/programme, …/#/bienvenue, …/#/faq,
            …/#/?section=methode… Le site est désormais multi-pages
            (/programme, /a-propos…) : ce script traduit le hash en
            chemin réel via location.replace (sans polluer l'historique
            — le bouton Retour reste fonctionnel). Si la page demandée
            est déjà la bonne, le hash est simplement nettoyé sans
            rechargement. Les ancres internes pures (#contact du sticky
            sur la page Inscription, #main-content) ne sont PAS touchées
            — elles ne commencent pas par "#/". */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var h=location.hash||'';if(h.indexOf('#/')!==0)return;var key=h.slice(2).split('?')[0].replace(/\\/+$/,'');var q=h.split('?')[1]||'';var map={'a-propos':'/a-propos','resultats':'/resultats','programme':'/programme','offres':'/programme','contact':'/contact','bienvenue':'/bienvenue','faq':'/?section=faq'};var target;if(key===''){if(!q)return;var sp=new URLSearchParams(q);var s=sp.get('section');if(!s)return;target='/?section='+encodeURIComponent(s);}else{target=map[key];if(!target)return;if(q&&key!=='faq')target+=(target.indexOf('?')>=0?'&':'?')+q;}var tp=target.split('?')[0]||'/';if(location.pathname===tp){history.replaceState(history.state,'',target);return;}location.replace(target);}catch(e){}})();",
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
