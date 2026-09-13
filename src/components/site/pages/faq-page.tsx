"use client";

import { CTA_LABELS } from "@/lib/site";
import { Container, PageHero, Section } from "../layout-primitives";
import { FaqAccordion } from "../faq-accordion";
import { Reveal } from "../reveal";
import { FAQ_OBJECTIONS } from "./home-page";

/**
 * PAGE 6 — FAQ (objections)
 * Fonction : lever les dernières hésitations avant l'inscription.
 * La liste des questions est partagée avec la section FAQ de l'accueil
 * (FAQ_OBJECTIONS, exportée par home-page) — une seule source de
 * vérité, instruction propriétaire : tout le site ramène vers la
 * même offre unique.
 * Composition (DA §12) : accordéon pleine largeur, fond blanc, une
 * seule question ouverte à la fois. Registre calme, jamais anxiogène.
 */

export function FaqPage() {
  return (
    <>
      <PageHero
        title="Tes questions, avant de te lancer."
        subtitle="Un seul programme, un seul prix : 03 mois — 70 000 FCFA — paiement unique. Voici tout ce qu'il faut savoir."
      />

      <Section className="pt-0">
        <Container>
          <Reveal>
            <FaqAccordion
              className="mx-auto max-w-[52rem]"
              items={[
                ...FAQ_OBJECTIONS.map((item) => ({
                  question: item.question,
                  answer: item.answer,
                })),
                {
                  question: "Une dernière hésitation ?",
                  answer: (
                    <span data-wa-cta className="inline-flex">
                      <a href="#/contact" className="btn btn-primary t-btn">
                        {CTA_LABELS.faq}
                      </a>
                    </span>
                  ),
                },
              ]}
            />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
