import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  /* RENOMMAGE contact → inscription (instruction propriétaire) :
     l'ancienne route /contact était INDEXÉE (sitemap, Google Search
     Console) et partagée (WhatsApp, réseaux, anciennes campagnes) —
     redirection 308 PERMANENTE vers /inscription pour transférer le
     signal SEO sans perte. Les anciens liens …/#/contact sont aussi
     traduits par le script inline de layout.tsx. */
  /* RENOMMAGE /pre-lancement → /pre-launch (instruction propriétaire
     2026-10-19 : le nom de l'offre et de sa landing est « Pre-launch »,
     en anglais — « Pré-lancement » uniquement toléré dans le
     copywriting) : l'ancienne route avait déjà été déployée et put
     être partagée — redirection 308 PERMANENTE pour préserver les
     liens existants et le référencement naissant. */
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/inscription",
        permanent: true,
      },
      {
        source: "/pre-lancement",
        destination: "/pre-launch",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
