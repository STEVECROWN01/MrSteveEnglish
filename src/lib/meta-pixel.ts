/**
 * TASK 59 — META PIXEL (instruction propriétaire, Events Manager) :
 * mesure d'audience et de conversion pour les campagnes Meta
 * (Facebook / Instagram).
 *
 * CONVERSIONS API (CAPI) — configuration complémentaire : chaque
 * événement de conversion est envoyé en DOUBLE —
 *   1. Côté NAVIGATEUR (pixel fbq, ci-dessous) ;
 *   2. Côté SERVEUR (route /api/meta-conversions → Graph API) avec le
 *      MÊME event_id : Meta déduplique automatiquement les deux
 *      copies (event_name + event_id identiques = 1 seul événement
 *      compté). Si le navigateur bloque le pixel (adblock, iOS…), la
 *      copie serveur passe quand même — fiabilité maximale.
 *
 * ÉVÉNEMENTS DU TUNNEL :
 *   • PageView         — chaque page (code de base + navigations <Link>)
 *   • ViewContent      — page /programme (offre unique vue, 70 000 XOF)
 *   • Lead             — formulaire d'inscription validé, données
 *                        enregistrées, redirection paiement confirmée
 *   • InitiateCheckout — juste avant la redirection vers Maketou
 *   • Purchase         — page /bienvenue (URL de retour du paiement
 *                        réussi configurée dans Maketou)
 *
 * VARIABLES D'ENVIRONNEMENT (voir .env.example) :
 *   • NEXT_PUBLIC_META_PIXEL_ID  — identifiant du pixel, PUBLIC par
 *     nature (présent dans le HTML de chaque page), lisible côté
 *     navigateur ET serveur ;
 *   • META_CAPI_ACCESS_TOKEN     — token Conversions API, SECRET :
 *     uniquement côté serveur (route API), JAMAIS préfixé
 *     NEXT_PUBLIC_, jamais exposé dans le bundle client.
 */

/** Identifiant du pixel fourni par le propriétaire (Events Manager).
 *  Priorité à la variable d'environnement NEXT_PUBLIC_META_PIXEL_ID
 *  (à configurer dans Vercel) ; repli sur la valeur connue pour que le
 *  site continue de tracer même si la variable n'est pas encore
 *  configurée. */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1873557434014896";

/** Valeur et devise de l'offre unique (source : lib/site.ts OFFRE —
 *  70 000 FCFA ; XOF est le code ISO du franc CFA). */
export const PRODUIT = {
  content_name: "De Comprendre à Parler™",
  content_category: "Coaching anglais",
  content_ids: ["de-comprendre-a-parler"],
  content_type: "product",
  value: 70000,
  currency: "XOF",
} as const;

/* Le code de base définit window.fbq (file d'attente) avant même le
   chargement de fbevents.js — typage global pour TypeScript. */
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Génère un identifiant d'événement unique (déduplication Pixel ↔
 *  Conversions API : les DEUX copies de l'événement partagent cet id).
 *  crypto.randomUUID est disponible sur tous les navigateurs modernes
 *  (contexte sécurisé) ; repli manuel sinon. */
export function pixelEventId(prefix: string): string {
  let id = "";
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    id = crypto.randomUUID();
  } else {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
  return `${prefix}.${id}`;
}

/** Paramètres optionnels de suivi d'un événement pixel. */
type TrackOptions = {
  /** Même event_id côté navigateur et côté serveur (CAPI) — Meta
   *  déduplique les deux copies. */
  eventId?: string;
};

/**
 * Envoie un événement Meta Pixel côté navigateur (PageView, Lead,
 * Purchase…). No-op silencieux si le pixel n'est pas disponible :
 * bloqueur de publicité, script pas encore chargé, JavaScript
 * désactivé — aucune erreur console, aucun impact sur l'expérience
 * du visiteur. L'event_id, quand il est fourni, est transmis à fbq
 * pour la déduplication avec la copie serveur.
 */
export function trackPixel(
  event: string,
  params?: Record<string, unknown>,
  options?: TrackOptions,
): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (options?.eventId) {
      window.fbq("track", event, params ?? {}, { eventID: options.eventId });
    } else {
      window.fbq("track", event, params ?? {});
    }
  }
}

/** Données d'identification envoyées à la copie SERVEUR de
 *  l'événement (Conversions API) — Meta les hache en SHA-256 côté
 *  serveur de notre route API (jamais en clair dans le code client
 *  au-delà de ce qui est déjà saisi par le prospect). */
export type PixelPii = {
  /** email du prospect (brut — haché côté serveur). */
  email?: string;
  /** numéro WhatsApp au format E.164, ex. "+2290159173098" (brut —
   *  haché côté serveur). */
  phoneE164?: string;
};

/** Lit un cookie first-party par nom (ex. _fbp / _fbc). */
function readCookie(name: string): string | undefined {
  if (typeof document === "undefined" || !document.cookie) return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : undefined;
}

/**
 * Envoie un événement en DOUBLE — pixel navigateur (fbq) + copie
 * serveur (Conversions API via /api/meta-conversions) — avec le même
 * event_id pour la déduplication automatique chez Meta.
 *
 * La copie serveur est fire-and-forget en keepalive : elle survit à la
 * navigation vers Maketou. Si le token CAPI n'est pas configuré, la
 * route répond ok:false silencieusement — le pixel navigateur, lui,
 * fonctionne dans tous les cas.
 */
export function trackPixelWithCAPI(
  event: string,
  params?: Record<string, unknown>,
  options?: TrackOptions & { pii?: PixelPii },
): void {
  trackPixel(event, params, { eventId: options?.eventId });

  if (!options?.eventId) return; // sans event_id : pas de copie serveur

  try {
    void fetch("/api/meta-conversions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName: event,
        eventId: options.eventId,
        eventSourceUrl:
          typeof window !== "undefined" ? window.location.href : undefined,
        customData: params,
        userData: {
          email: options.pii?.email,
          phoneE164: options.pii?.phoneE164,
          fbp: readCookie("_fbp"),
          fbc: readCookie("_fbc"),
        },
      }),
    }).catch(() => {
      /* fire-and-forget : aucune erreur ne doit impacter l'UX */
    });
  } catch {
    /* fetch indisponible — ignoré */
  }
}
