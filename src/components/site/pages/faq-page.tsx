"use client";

import { waLink } from "@/lib/site";
import { CTA_LABELS } from "@/lib/site";
import { Container, PageHero, Section } from "../layout-primitives";
import { FaqAccordion } from "../faq-accordion";
import { Reveal } from "../reveal";

/**
 * PAGE 6 — FAQ (COPYWRITING.md)
 * Fonction : lever les dernières hésitations avant le message WhatsApp,
 * réduire les questions redondantes, rassurer ceux qui n'osent pas
 * encore écrire.
 * Composition (DA §12) : accordéon pleine largeur, fond blanc, une seule
 * question ouverte à la fois, icône plus/moins en linework Bleu Profond.
 * Registre calme, aéré, jamais anxiogène.
 */

const FAQ_ITEMS = [
  {
    question: "Je suis complètement débutant, est-ce que ça marche pour moi ?",
    answer:
      "Oui. 98 % des débutants absolus qui suivent la méthode s'expriment librement dès le premier mois. La méthode s'adapte à ton niveau de départ, pas l'inverse.",
  },
  {
    question: "Individuel ou en groupe, comment choisir ?",
    answer:
      "En individuel, tout le rythme de la séance est calé sur toi. En petit groupe, tu gagnes en pratique d'interaction, avec d'autres apprenants au niveau proche du tien. Les deux formats suivent la même méthode.",
  },
  {
    question: "Comment se déroulent les séances concrètement ?",
    answer:
      "En ligne, en visioconférence, avec un lien envoyé avant chaque séance. Aucun déplacement, aucun matériel à acheter.",
  },
  {
    question: "Et si je dois annuler une séance ?",
    answer:
      "Préviens Stevens au plus tôt : la séance est reprogrammée dans la mesure du possible, pour que ton rythme de progression ne soit pas cassé.",
  },
  {
    question: "Combien de temps avant de voir de vrais résultats ?",
    answer:
      "Le premier déclic — oser parler sans blocage — arrive généralement dès le premier mois. Pour un objectif précis (entretien, examen, voyage, expatriation, poste international), compte deux à trois mois de coaching régulier.",
  },
  {
    question: "Que se passe-t-il juste après mon paiement ?",
    answer:
      "Trois jours après confirmation, ton coaching démarre réellement : suivi personnalisé et toutes les ressources nécessaires mises à ta disposition dès le premier jour.",
  },
  {
    question: "Je peux choisir entre 2 et 3 mois, laquelle me convient ?",
    answer:
      "Trois mois, c'est le format qui a permis à un apprenant de décrocher un poste à l'international — recommandé si ton objectif est ambitieux, quel qu'il soit (carrière, examen, expatriation, voyage). Deux mois convient si ton échéance est proche et que tu es prêt à t'investir davantage entre les séances.",
  },
];

export function FaqPage() {
  return (
    <>
      <PageHero
        title="Tes questions, avant de te lancer."
        subtitle="Pas de réponse ici ? Pose-la directement à Stevens."
      />

      <Section className="pt-0">
        <Container>
          <Reveal>
            <FaqAccordion
              className="mx-auto max-w-[52rem]"
              items={[
                ...FAQ_ITEMS.map((item) => ({
                  question: item.question,
                  answer: item.answer,
                })),
                {
                  question: "Une dernière hésitation ?",
                  answer: (
                    <span data-wa-cta className="inline-flex">
                      <a
                        href={waLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary t-btn"
                      >
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
