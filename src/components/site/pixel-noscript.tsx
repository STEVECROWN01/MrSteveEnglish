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
 *
 * TASK 90 — PIXEL DU TUNNEL : la page /pre-launch rend ce repli avec
 * le pixel PRE-LAUNCH (META_PIXEL_ID_PRELAUNCH) via la prop
 * pixelId ; toutes les autres pages gardent le pixel principal
 * (valeur par défaut).
 */
export function PixelNoscript({
  pixelId = META_PIXEL_ID,
}: {
  /** TASK 90 : pixel cible du repli (pixel du tunnel de la page). */
  pixelId?: string;
}) {
  return (
    <noscript
      dangerouslySetInnerHTML={{
        __html:
          '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' +
          pixelId +
          '&ev=PageView&noscript=1" alt=""/>',
      }}
    />
  );
}
