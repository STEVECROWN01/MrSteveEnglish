/**
 * TASK 59 — META PIXEL (instruction propriétaire) : mesure d'audience
 * et de conversion pour les campagnes Meta (Facebook / Instagram).
 *
 * Le CODE DE BASE du pixel (init + PageView) est installé dans
 * src/app/layout.tsx : il s'exécute sur TOUTES les pages du site.
 *
 * Les ÉVÉNEMENTS DE CONVERSION sont déclenchés aux deux moments clés
 * du tunnel de vente :
 *   • « Lead »     — soumission réussie du formulaire d'inscription
 *                    (page Contact) : le prospect vient de réserver
 *                    sa place pour 70 000 FCFA, juste avant d'être
 *                    redirigé vers la page de paiement ;
 *   • « Purchase » — arrivée sur la page Bienvenue : cette page est
 *                    l'URL de retour du paiement réussi configurée
 *                    par le propriétaire dans son système de paiement
 *                    → un visiteur ici = un achat confirmé
 *                    (valeur 70 000, devise XOF = franc CFA).
 *
 * Avec ces deux événements, le propriétaire peut optimiser ses
 * publicités Meta soit sur les PROSPECTS (Lead), soit sur les CLIENTS
 * PAYANTS (Purchase), directement depuis le Gestionnaire d'événements
 * (Events Manager → Sources de données → pixel 1873557434014896).
 */

/** Identifiant du pixel fourni par le propriétaire (Events Manager). */
export const META_PIXEL_ID = "1873557434014896";

/* Le code de base définit window.fbq (file d'attente) avant même le
   chargement de fbevents.js — typage global pour TypeScript. */
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Envoie un événement Meta Pixel (PageView, Lead, Purchase…).
 * No-op silencieux si le pixel n'est pas disponible : bloqueur de
 * publicité, script pas encore chargé, JavaScript désactivé — aucune
 * erreur console, aucun impact sur l'expérience du visiteur.
 */
export function trackPixel(
  event: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}
