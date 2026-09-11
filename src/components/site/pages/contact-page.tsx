"use client";

import { WA_MESSAGES, waLink, CTA_LABELS, WHATSAPP_DISPLAY } from "@/lib/site";
import { Container, PageHero } from "../layout-primitives";
import { Reveal } from "../reveal";
import { StickyCTA } from "../sticky-cta";

/**
 * PAGE 7 — CONTACT / RÉSERVATION (COPYWRITING.md)
 * Fonction : réduire la friction au maximum, un seul CTA clair.
 * Composition : fond noir, un unique bouton CTA WhatsApp rouge centré
 * très grand, numéro affiché en clair (waveform supprimée — instruction
 * propriétaire). Mobile : bouton pleine largeur, sticky en bas de viewport.
 */

export function ContactPage() {
  return (
    <div className="on-dark min-h-[calc(100svh-72px)] bg-black pb-20 md:pb-0">
      <PageHero
        dark
        title="Prêt à parler anglais avec aisance ?"
        subtitle="Un message. Une réponse de Stevens. Et ton coaching peut démarrer cette semaine."
      />

      <section className="pb-12 pt-12 lg:pb-24 lg:pt-24">
        <Container className="text-center">
          <Reveal>
            <p className="t-body mx-auto max-w-[38rem] text-white/80">
              Pas de formulaire à remplir, pas d&apos;attente. Écris
              directement à Stevens sur WhatsApp : dis-lui ton niveau, ton
              objectif, et le format qui t&apos;intéresse. Il te répond
              personnellement.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10">
              <span data-wa-cta className="inline-flex">
                <a
                  href={waLink(WA_MESSAGES.contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary t-btn px-10 py-5 text-[1.0625rem] lg:text-[1.125rem]"
                >
                  {CTA_LABELS.contact}
                </a>
              </span>
            </div>

            {/* Numéro WhatsApp officiel, fourni par le propriétaire */}
            <p className="t-caption mt-6 text-white/80 tabular-nums">
              {WHATSAPP_DISPLAY}
            </p>

            <p className="t-caption mt-16 text-white/70">
              Réponse personnelle. Aucun engagement avant d&apos;avoir échangé.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* CTA sticky mobile — pleine largeur (DA §15 page Contact) */}
      <StickyCTA href={waLink(WA_MESSAGES.contact)} label={CTA_LABELS.contact} />
    </div>
  );
}
