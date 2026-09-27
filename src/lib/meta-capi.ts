/**
 * CONVERSIONS API (CAPI) — ENVOI SERVEUR (instruction propriétaire).
 *
 * Cette bibliothèque s'exécute UNIQUEMENT côté serveur (route
 * /api/meta-conversions). Elle transmet les événements du site au
 * Graph API de Meta avec le token d'accès stocké dans la variable
 * d'environnement SERVEUR META_CAPI_ACCESS_TOKEN — ce token est
 * SECRET : il ne doit JAMAIS être préfixé NEXT_PUBLIC_ (sinon il
 * serait embarqué dans le bundle JavaScript visible par tous) ni
 * commité dans le dépôt (il se configure dans Vercel → Settings →
 * Environment Variables).
 *
 * DÉDUPLICATION Pixel ↔ CAPI : le navigateur envoie chaque événement
 * via le pixel (fbq) et cette route envoie la copie serveur avec le
 * MÊME event_id. Meta regroupe automatiquement les deux copies
 * (event_name + event_id identiques) et n'en compte qu'une seule.
 *
 * Bonnes pratiques appliquées (doc Meta Conversions API) :
 *  • action_source = "website" (événement généré par la navigation) ;
 *  • user_data : email / téléphone hachés SHA-256 (normalisés avant
 *    hachage : email en minuscules sans espaces, numéro en chiffres
 *    E.164), plus fbp/fbc (cookies first-party du pixel),
 *    IP et user-agent réels captés côté serveur — Meilleur match
 *    possible des conversions ;
 *  • fire-and-forget côté client : si l'envoi échoue, le pixel
 *    navigateur reste la source principale.
 */

import { META_PIXEL_ID } from "./meta-pixel";

/** Version du Graph API utilisée pour la Conversions API. */
const GRAPH_VERSION = "v21.0";

/** Token d'accès Conversions API (SECREV — serveur uniquement). */
function capiAccessToken(): string | undefined {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  return token && token.trim().length > 0 ? token.trim() : undefined;
}

/** True si le token CAPI est configuré (sinon la route répond
 *  ok:false sans tenter l'appel — le pixel navigateur fonctionne
 *  toujours, lui). */
export function capiConfigured(): boolean {
  return Boolean(capiAccessToken() && META_PIXEL_ID);
}

/** Normalise puis hache une valeur en SHA-256 (hex) pour user_data.
 *  Doc Meta : email → minuscules + trim ; téléphone → chiffres
 *  uniquement au format E.164 (indicatif pays inclus). */
async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(e164: string): string {
  return e164.replace(/[^\d]/g, "");
}

/** Événements autorisés via cette route (liste blanche) — évite tout
 *  abus de l'endpoint avec des noms arbitraires. */
const ALLOWED_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "Lead",
  "InitiateCheckout",
  "Purchase",
]);

export function isAllowedEvent(eventName: string): boolean {
  return ALLOWED_EVENTS.has(eventName);
}

/** Données d'identification du prospect reçues du navigateur (brutes
 *  — hachées AVANT tout envoi à Meta). */
export type ServerUserData = {
  email?: string;
  phoneE164?: string;
  fbp?: string;
  fbc?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
};

/** Construit l'objet user_data haché pour le Graph API. */
async function buildUserData(
  userData: ServerUserData,
): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  if (userData.email) {
    out.em = [await sha256Hex(normalizeEmail(userData.email))];
  }
  if (userData.phoneE164) {
    out.ph = [await sha256Hex(normalizePhone(userData.phoneE164))];
  }
  if (userData.fbp) out.fbp = userData.fbp;
  if (userData.fbc) out.fbc = userData.fbc;
  if (userData.clientIpAddress) out.client_ip_address = userData.clientIpAddress;
  if (userData.clientUserAgent) out.client_user_agent = userData.clientUserAgent;
  return out;
}

/** Extrait l'IP réelle du visiteur des en-têtes (Vercel : x-forwarded-for). */
function clientIpFromHeaders(headers: Headers): string | undefined {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? undefined;
}

/** Lit un cookie first-party depuis l'en-tête Cookie de la requête. */
function cookieFromHeaders(headers: Headers, name: string): string | undefined {
  const cookie = headers.get("cookie");
  if (!cookie) return undefined;
  const match = cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : undefined;
}

export type ServerEventInput = {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  customData?: Record<string, unknown>;
  userData?: {
    email?: string;
    phoneE164?: string;
    fbp?: string;
    fbc?: string;
  };
  requestHeaders: Headers;
};

/**
 * Envoie UN événement au Graph API (Conversions API). Retourne
 * { ok, status?, error? } — jamais d'exception : l'appelant
 * (la route API) répond toujours 200 avec ok:true/false pour ne pas
 * polluer la console du navigateur en cas d'échec côté Meta.
 */
export async function sendServerEvent(
  input: ServerEventInput,
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const token = capiAccessToken();
  if (!token || !META_PIXEL_ID) {
    return { ok: false, error: "CAPI non configuré (META_CAPI_ACCESS_TOKEN absent)" };
  }

  try {
    const userData = await buildUserData({
      ...input.userData,
      fbp: input.userData?.fbp ?? cookieFromHeaders(input.requestHeaders, "_fbp"),
      fbc: input.userData?.fbc ?? cookieFromHeaders(input.requestHeaders, "_fbc"),
      clientIpAddress: clientIpFromHeaders(input.requestHeaders),
      clientUserAgent: input.requestHeaders.get("user-agent") ?? undefined,
    });

    const payload = {
      data: [
        {
          event_name: input.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: input.eventId,
          action_source: "website",
          event_source_url: input.eventSourceUrl,
          user_data: userData,
          custom_data: input.customData ?? {},
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: body.slice(0, 500) };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erreur inconnue",
    };
  }
}
