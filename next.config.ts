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
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/inscription",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
