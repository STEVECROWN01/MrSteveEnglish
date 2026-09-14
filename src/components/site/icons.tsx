import { cn } from "@/lib/utils";

/**
 * Icônes de liste professionnelles (instruction propriétaire : remplacer
 * les coches/croix simplistes par de vraies icônes web pro — pastille
 * circulaire pleine + glyphe contrasté, style « check-circle » des
 * bibliothèques d'icônes web).
 * — IconCheck : pastille (currentColor) + coche contrastée.
 *     Fond clair  : <IconCheck className="text-black" />
 *     Fond sombre : <IconCheck className="text-white" fg="#000000" />
 * — IconCross : pastille ROUGE (#ff0000 — rouge CTA du site) + croix
 *     blanche. Usage sémantique d'exclusion (« pas pour toi »).
 */

export function IconCheck({
  className,
  fg = "#ffffff",
}: {
  className?: string;
  fg?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path
        d="M6.3 10.4 L8.9 13 L13.8 7.4"
        stroke={fg}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function IconCross({
  className,
  fg = "#ffffff",
}: {
  className?: string;
  fg?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
    >
      <circle cx="10" cy="10" r="9" fill="#ff0000" />
      <path
        d="M7 7 L13 13 M13 7 L7 13"
        stroke={fg}
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Drapeau du Royaume-Uni (Task 28 — instruction propriétaire) :
 *  remplace l'emoji « 🇬🇧 » dans la question d'évaluation du formulaire.
 *  Les emojis drapeaux ne s'affichent PAS sur tous les appareils
 *  (Windows affiche les lettres « GB ») — ce SVG s'affiche partout, à
 *  l'identique. Construction officielle 60×30 (Union Jack contrecarré).
 *  Task 29 (instruction propriétaire) : rendu CARRÉ — le drapeau est
 *  rogné sur sa largeur (preserveAspectRatio « slice ») pour remplir
 *  un cadre 1:1 ; la croix de saint Georges reste parfaitement centrée.
 *  La taille (h/w) et l'alignement sont fixés par le consommateur. */
export function FlagUK({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn("inline-block shrink-0", className)}
    >
      <defs>
        <clipPath id="flag-uk-counterchange">
          <path d="M30,15 h30 v15 z M30,15 v15 h-30 z M30,15 h-30 v-15 z M30,15 v-15 h30 z" />
        </clipPath>
      </defs>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        stroke="#C8102E"
        strokeWidth="4"
        clipPath="url(#flag-uk-counterchange)"
      />
      <path d="M30,0 V30 M0,15 H60" stroke="#ffffff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

/** Icône WhatsApp officielle (simple-icons, CC0) — version exportée
 *  pour les boutons de la page bienvenue (post-paiement, Task 28). */
export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-[22px] w-[22px] shrink-0", className)}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
