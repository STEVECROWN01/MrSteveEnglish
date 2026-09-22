import Link from "next/link";
import { CTA_LABELS, SOCIAL_LINKS } from "@/lib/site";
import { Container } from "./layout-primitives";
import { CarteUrgenceEthique } from "./carte-inaction";

/**
 * Footer (instruction propriétaire) : fond noir, texte blanc, nom
 * « Stevens AKPOVI », icônes sociales dans l'ordre Facebook,
 * WhatsApp (qui dirige vers le formulaire de contact, le numéro
 * n'est jamais affiché sur le site), YouTube — navigation complète
 * du site, mentions légales.
 * Task 48 (vraies pages Google) : liens internes en CHEMINS RÉELS
 * (/a-propos, /programme…) rendus par <Link> — navigation douce +
 * préchargement, et maillage interne indexable par Google.
 */

/** Icône WhatsApp officielle (simple-icons, CC0). */
function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/** Icône YouTube officielle (simple-icons, CC0). */
function YouTubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/** Icône Facebook officielle (simple-icons, CC0). */
function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const FOOTER_LINKS = [
  { label: "Méthode", href: "/?section=methode", section: true },
  { label: "À propos", href: "/a-propos" },
  { label: "Résultats", href: "/resultats" },
  { label: "Programme", href: "/programme" },
  { label: "FAQ", href: "/?section=faq", section: true },
  { label: "Inscription", href: "/contact" },
];

/** Lien social carré, accessible, target externe. */
function SocialLink({
  href,
  label,
  external,
  internalAnchor,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  /** Navigation interne (icône WhatsApp → page contact) : si on y est
   *  déjà, AUCUNE navigation ne se déclenche → remontée manuelle douce
   *  en haut de page (même règle que le logo du header — instruction
   *  propriétaire Task 27 : l'icône WhatsApp doit diriger vers la page
   *  contact ET remonter en haut). */
  internalAnchor?: boolean;
  children: React.ReactNode;
}) {
  const inner = (
    <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] text-white/80 transition-colors duration-[240ms] hover:bg-white hover:text-black">
      {children}
    </span>
  );
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      onClick={
        internalAnchor
          ? (e) => {
              if (window.location.pathname === href) {
                e.preventDefault();
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              }
            }
          : undefined
      }
    >
      {inner}
    </Link>
  );
}

export function Footer({
  /** Task 28 (instruction propriétaire) : sur l'accueil, la carte
   * « Le coût de l'inaction » vit dans la section finale (AVANT le
   * bouton « Je veux parler anglais avec confiance ») — le footer la
   * masque alors pour éviter le doublon. Sur toutes les autres pages,
   * la carte reste en tête de footer. */
  hideCarte = false,
}: {
  hideCarte?: boolean;
}) {
  return (
    <footer className="on-dark mt-auto overflow-hidden bg-black text-white">
      {/* Carte « Le coût de l'inaction » (instruction propriétaire
          Task 27) : vit désormais dans le footer — visible sur TOUTES
          les pages, au lieu d'être dupliquée page par page. Sur
          l'accueil, la carte n'est plus répétée dans la section CTA
          finale (le footer la prend en relais immédiatement après). */}
      {hideCarte ? null : (
        <Container className="relative pb-0 pt-12 lg:pt-16">
          {/* Task 29 (instruction propriétaire) : la carte passe en VERRE
              TRANSPARENT — les nappes de couleur derrière elle rendent la
              translucidité lisible (même mécanisme que la section Pour
              qui ?). Container positionné APRÈS les nappes dans le DOM :
              le contenu reste au-dessus. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[8rem] top-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.32)_0%,transparent_62%)] blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[8rem] top-4 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.30)_0%,transparent_62%)] blur-2xl"
          />
          <CarteUrgenceEthique className="mx-auto max-w-[46rem]" />
        </Container>
      )}
      <Container className="py-12 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[26rem]">
            <p className="font-display text-[1.5rem] font-medium leading-tight">
              Stevens AKPOVI
            </p>
            <p className="t-caption mt-2 text-white/70">
              Coach d&apos;anglais — De <span className="text-red-button">Comprendre</span> à{" "}
              <span className="text-red-button">Parler</span>
              <sup className="top-[-0.6em] text-[0.6em]">™</sup>, en 03 mois.
            </p>

            {/* Réseaux sociaux — ordre instruction propriétaire :
                Facebook, WhatsApp (vers le formulaire), YouTube.
                Icônes transparentes sur fond noir → blanc plein au
                survol (pas de reflet : réservé aux CTA, Task 25). */}
            <div className="mt-6 flex items-center gap-1">
              <SocialLink
                href={SOCIAL_LINKS.facebook}
                label="Page Facebook de Stevens AKPOVI (nouvel onglet)"
                external
              >
                <FacebookIcon />
              </SocialLink>
              <SocialLink
                href="/contact"
                label="WhatsApp — contacter Stevens AKPOVI via le formulaire"
                internalAnchor
              >
                <WhatsAppIcon />
              </SocialLink>
              <SocialLink
                href={SOCIAL_LINKS.youtube}
                label="Chaîne YouTube de Stevens AKPOVI (nouvel onglet)"
                external
              >
                <YouTubeIcon />
              </SocialLink>
            </div>
          </div>

          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12">
            <nav aria-label="Navigation pied de page">
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-6">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      scroll={link.section ? false : undefined}
                      className="t-caption text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link href="/contact" data-wa-cta className="btn btn-primary t-btn">
              {CTA_LABELS.decouvrirCourt}
            </Link>
          </div>
        </div>

        <p className="t-caption mt-10 border-t border-white/15 pt-6 text-white/60">
          © {new Date().getFullYear()} Stevens AKPOVI — Coach d&apos;anglais en
          ligne.
        </p>
      </Container>
    </footer>
  );
}
