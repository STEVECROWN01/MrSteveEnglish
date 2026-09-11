import { WA_MESSAGES, waLink, CTA_LABELS } from "@/lib/site";
import { Container } from "./layout-primitives";

/**
 * Footer (DA §7) : fond Bleu Profond, texte blanc, structure minimale —
 * nom, lien WhatsApp (bouton rouge), mentions légales.
 * Liens discrets FAQ / Contact pour compléter la navigation du site
 * à 7 pages (sans plan de site étendu).
 */
export function Footer() {
  return (
    <footer className="on-dark mt-auto bg-blue-deep text-white">
      <Container className="py-12 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[26rem]">
            <p className="font-display text-[1.5rem] font-medium leading-tight">
              Stevens Akpovi
            </p>
            <p className="t-caption mt-2 text-white/70">
              Coach d&apos;anglais — parler avec aisance en 2 à 3 mois.
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
            <nav aria-label="Navigation pied de page">
              <ul className="flex items-center gap-6">
                <li>
                  <a
                    href="#/faq"
                    className="t-caption text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#/contact"
                    className="t-caption text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
            <a
              href={waLink(WA_MESSAGES.hero)}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-cta
              className="btn btn-primary t-btn"
            >
              {CTA_LABELS.hero}
            </a>
          </div>
        </div>

        <p className="t-caption mt-10 border-t border-white/15 pt-6 text-white/60">
          © {new Date().getFullYear()} Stevens Akpovi — Coach d&apos;anglais en
          ligne.
        </p>
      </Container>
    </footer>
  );
}
