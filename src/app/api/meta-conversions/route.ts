import { NextResponse } from "next/server";
import {
  capiConfigured,
  isAllowedEvent,
  sendServerEvent,
} from "@/lib/meta-capi";
import { META_PIXEL_ID, META_PIXEL_ID_PRELAUNCH } from "@/lib/meta-pixel";

/**
 * ROUTE API — PROXY CONVERSIONS API (instruction propriétaire).
 *
 * POST /api/meta-conversions
 * Corps : { eventName, eventId, pixelId?, eventSourceUrl?, customData?, userData? }
 *
 * Le navigateur (lib/meta-pixel.ts) y envoie la copie SERVEUR de
 * chaque événement de conversion, avec le MÊME event_id que l'appel
 * pixel fbq correspondant → Meta déduplique automatiquement les deux
 * copies (event_name + event_id).
 *
 * TASK 90 — pixelId (optionnel) : pixel DU TUNNEL de la page d'où
 * part l'événement (pixel principal OU pixel pre-launch) ; validé
 * contre une LISTE BLANCHE stricte des deux pixels du site — la
 * copie serveur part sur le même pixel que la copie navigateur.
 *
 * SÉCURITÉ :
 *  • Le token META_CAPI_ACCESS_TOKEN reste 100% côté serveur — il
 *    n'apparaît ni dans la réponse, ni dans le bundle client ;
 *  • Liste blanche des noms d'événements acceptés ;
 *  • Liste blanche des identifiants de pixels acceptés ;
 *  • Aucune donnée n'est persistée — simple relais vers le Graph API ;
 *  • Réponse toujours 200 { ok: true|false } : le client est en
 *    fire-and-forget, un échec côté Meta ne doit JAMAIS remonter à
 *    l'utilisateur (le pixel navigateur reste la source principale).
 */

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    eventName?: unknown;
    eventId?: unknown;
    pixelId?: unknown;
    eventSourceUrl?: unknown;
    customData?: unknown;
    userData?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" });
  }

  const eventName = typeof body.eventName === "string" ? body.eventName : "";
  const eventId = typeof body.eventId === "string" ? body.eventId : "";

  // Validation stricte : nom d'événement connu + event_id obligatoire
  // (c'est lui qui porte la déduplication Pixel ↔ CAPI).
  if (!isAllowedEvent(eventName)) {
    return NextResponse.json({ ok: false, error: "Événement non autorisé" });
  }
  if (!eventId || eventId.length > 128) {
    return NextResponse.json({ ok: false, error: "event_id invalide" });
  }

  // TASK 90 — pixel du tunnel : liste blanche stricte des DEUX
  // pixels du site (absent → pixel principal, rétro-compatible) —
  // un identifiant arbitraire ne peut jamais atteindre le Graph API.
  const pixelId =
    typeof body.pixelId === "string" ? body.pixelId : META_PIXEL_ID;
  if (pixelId !== META_PIXEL_ID && pixelId !== META_PIXEL_ID_PRELAUNCH) {
    return NextResponse.json({ ok: false, error: "Pixel non autorisé" });
  }

  // Token absent (Vercel non encore configuré) : réponse douce — le
  // site fonctionne, seule la copie serveur est désactivée.
  if (!capiConfigured()) {
    return NextResponse.json({
      ok: false,
      error: "CAPI non configuré (META_CAPI_ACCESS_TOKEN absent)",
    });
  }

  const result = await sendServerEvent({
    eventName,
    eventId,
    pixelId,
    eventSourceUrl:
      typeof body.eventSourceUrl === "string"
        ? body.eventSourceUrl.slice(0, 500)
        : undefined,
    customData:
      body.customData && typeof body.customData === "object"
        ? (body.customData as Record<string, unknown>)
        : undefined,
    userData:
      body.userData && typeof body.userData === "object"
        ? (body.userData as {
            email?: string;
            phoneE164?: string;
            fbp?: string;
            fbc?: string;
          })
        : undefined,
    requestHeaders: request.headers,
  });

  // Toujours 200 : fire-and-forget côté client (aucune erreur visible
  // dans la console du prospect — le pixel navigateur reste actif).
  return NextResponse.json({
    ok: result.ok,
    ...(result.error ? { error: result.error } : {}),
  });
}
