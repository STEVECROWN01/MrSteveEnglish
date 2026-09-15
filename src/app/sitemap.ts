import type { MetadataRoute } from "next";

/**
 * Sitemap (Task 33 — SEO) : le site est une SPA hash-routée — tous les
 * contenus vivent sur la même URL racine (les fragments #/… ne sont pas
 * des URL distinctes pour les crawlers). Le sitemap déclare donc la page
 * unique, dont le contenu complet (accueil) est rendu en HTML statique.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mrsteveenglish.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
