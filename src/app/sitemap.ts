import type { MetadataRoute } from "next";

/**
 * Sitemap (Task 33 — SEO ; Task 48 — vraies pages) : le site est
 * désormais multi-pages — chaque page est pré-rendue en HTML statique à
 * sa propre adresse et déclarée ici pour Google Search Console.
 * /bienvenue (post-paiement) est volontairement EXCLUE (noindex) ;
 * /faq et /offres sont de simples redirections (pas des contenus).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mrsteveenglish.vercel.app";
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/programme`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/inscription`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      /* Task 69 — landing de l'offre pre-launch (15 000 FCFA,
          02 mois, 05 places) : page marketing publique indexable. */
      url: `${base}/pre-launch`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/resultats`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
