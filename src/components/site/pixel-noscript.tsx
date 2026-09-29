import { META_PIXEL_ID } from "@/lib/meta-pixel";

/**
 * TASK 60 — Repli <noscript> officiel du pixel Meta (visiteurs sans
 * JavaScript) : image invisible qui enregistre le PageView côté Meta.
 *
 * RENDU PAGE PAR PAGE (et plus dans le layout racine) : la page
 * Bienvenue — retour du paiement réussi — NE DOIT ÉMETTRE AUCUN
 * PageView (instruction propriétaire : seul l'événement « Purchase »
 * y est suivi). Chaque route rend donc ce composant SAUF /bienvenue
 * (app/bienvenue/page.tsx ne l'importe pas).
 */
export function PixelNoscript() {
  return (
    <noscript
      dangerouslySetInnerHTML={{
        __html:
          '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' +
          META_PIXEL_ID +
          '&ev=PageView&noscript=1" alt=""/>',
      }}
    />
  );
}
