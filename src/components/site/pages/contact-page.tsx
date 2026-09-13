"use client";

import { useState } from "react";
import { CHECKOUT_URL, CTA_LABELS, waLink } from "@/lib/site";
import { Container, PageHero } from "../layout-primitives";
import { Reveal } from "../reveal";
import { StickyCTA } from "../sticky-cta";

/**
 * PAGE 7 — CONTACT / INSCRIPTION (instruction propriétaire)
 * Fonction : conversion finale — le formulaire qualifie le prospect
 * pour L'OFFRE UNIQUE (Programme « De « Comprendre » à « Parler » » —
 * 03 mois — 70 000 FCFA — paiement unique), puis — à la soumission —
 * envoie automatiquement une fiche professionnelle sur le WhatsApp du
 * coach ET dirige le prospect vers la page de paiement.
 * Composition : fond noir, message d'accueil chaleureux sous le titre,
 * rappel du programme au-dessus du formulaire, formulaire en une
 * colonne lisible, bouton d'envoi rouge pleine largeur.
 * Le numéro WhatsApp n'est JAMAIS affiché (instruction propriétaire).
 */

/* — Le programme (offre unique) — plus de choix de formule
     (instruction propriétaire : la conversion tourne autour d'UNE
     SEULE offre). — */
const PROGRAMME_LABEL =
  "Programme « De « Comprendre » à « Parler » » — 03 mois — 70 000 FCFA — paiement unique";

/* — Question test : détecte débutant ou intermédiaire — */
const NIVEAU_QUESTION = "She ___ English every day.";
const NIVEAU_OPTIONS = [
  { value: "speak", label: "speak" },
  { value: "speaks", label: "speaks" },
  { value: "speaking", label: "speaking" },
  { value: "to speak", label: "to speak" },
];

type FormState = {
  nom: string;
  age: string;
  profession: string;
  email: string;
  pays: string;
  ville: string;
  motivation: string;
  niveau: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  nom: "",
  age: "",
  profession: "",
  email: "",
  pays: "",
  ville: "",
  motivation: "",
  niveau: "",
};

const FIELD_ORDER: (keyof FormState)[] = [
  "nom",
  "age",
  "profession",
  "email",
  "pays",
  "ville",
  "motivation",
  "niveau",
];

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (f.nom.trim().length < 3) {
    e.nom = "Indique ton nom complet (nom et prénom).";
  }
  const age = Number(f.age);
  if (!f.age || !Number.isInteger(age) || age < 10 || age > 99) {
    e.age = "Indique ton âge en années (entre 10 et 99).";
  }
  if (f.profession.trim().length < 2) {
    e.profession = "Indique ta profession (ou ton statut : étudiant…).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) {
    e.email = "Indique une adresse email valide.";
  }
  if (f.pays.trim().length < 2) {
    e.pays = "Indique ton pays de résidence.";
  }
  if (f.ville.trim().length < 2) {
    e.ville = "Indique ta ville.";
  }
  if (f.motivation.trim().length < 8) {
    e.motivation =
      "Explique pourquoi tu veux apprendre l'anglais (au moins quelques mots).";
  }
  if (!f.niveau) {
    e.niveau = "Choisis la réponse qui te semble correcte.";
  }
  return e;
}

/** Fiche professionnelle envoyée sur le WhatsApp du coach. */
function buildMessage(f: FormState): string {
  const niveauDetecte =
    f.niveau === "speaks"
      ? "Intermédiaire (réponse correcte au test)"
      : "Débutant (réponse incorrecte au test)";
  return [
    "🎯 NOUVEAU PROSPECT — MR STEVE ENGLISH",
    "",
    "👤 IDENTITÉ",
    `• Nom complet : ${f.nom.trim()}`,
    `• Âge : ${f.age} ans`,
    `• Profession : ${f.profession.trim()}`,
    "",
    "📍 LOCALISATION",
    `• Pays : ${f.pays.trim()}`,
    `• Ville : ${f.ville.trim()}`,
    "",
    "📧 EMAIL",
    `• ${f.email.trim()}`,
    "",
    "🧪 TEST DE NIVEAU RAPIDE",
    `• Question : « ${NIVEAU_QUESTION} »`,
    `• Réponse du prospect : « ${f.niveau} »`,
    `• Niveau détecté : ${niveauDetecte}`,
    "",
    "🎯 MOTIVATION",
    `• ${f.motivation.trim()}`,
    "",
    "📦 PROGRAMME (offre unique)",
    `• ${PROGRAMME_LABEL}`,
    "",
    "— Message envoyé automatiquement depuis le formulaire du site Stevens AKPOVI",
  ].join("\n");
}

export function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    // L'erreur disparaît dès que le champ redevient valide en saisie
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) {
        document.getElementById(`f-${first}`)?.focus();
      }
      return;
    }
    setErrors({});
    const message = buildMessage(form);
    setLastMessage(message);

    // 1) Envoi de la fiche sur le WhatsApp du coach (nouvel onglet)
    window.open(waLink(message), "_blank", "noopener,noreferrer");
    setSent(true);

    // 2) Redirection automatique vers le paiement
    window.setTimeout(() => {
      window.location.href = CHECKOUT_URL;
    }, 900);
  };

  return (
    <div className="on-dark min-h-[calc(100svh-72px)] bg-black pb-20 text-white md:pb-0">
      <PageHero
        dark
        title="Prêt à parler anglais avec confiance ?"
        subtitle="Un formulaire. Ma réponse personnelle. Et ton programme de 03 mois peut démarrer cette semaine."
      />

      <section id="contact" className="scroll-mt-20 pb-12 pt-8 lg:pb-24 lg:pt-12">
        <Container>
          <div className="mx-auto max-w-[42rem]">
            {/* — Message d'accueil chaleureux (instruction propriétaire :
                    juste après le titre, « gravé » au-dessus du formulaire) — */}
            <Reveal>
              <div
                className="rounded-[12px] border border-white/20 bg-white/[0.04] p-6 md:p-8"
                role="note"
                aria-label="Message d'accueil"
              >
                <p className="font-display text-[1.25rem] leading-snug text-white md:text-[1.375rem]">
                  Bienvenue à toi.
                </p>
                <p className="t-body mt-3 text-white/80">
                  Pour rejoindre le programme, remplis l&apos;intégralité du
                  formulaire ci-dessous avec tes informations exactes — toutes
                  les informations sont obligatoires. Dès que tu envoies, ta
                  demande arrive directement sur mon WhatsApp, avec ton niveau
                  réel et ton objectif. Je te réponds personnellement.
                </p>
                {/* Rappel du programme (offre unique — instruction
                    propriétaire) au moment exact de la décision */}
                <p className="t-caption mt-4 border-t border-white/15 pt-4 text-white/75">
                  Programme « De « Comprendre » à « Parler » » — 03 mois de
                  coaching d&apos;anglais personnalisé — 70 000 FCFA — paiement
                  unique.
                </p>
              </div>
            </Reveal>

            {/* — Formulaire de qualification — */}
            <Reveal delay={120}>
              <form onSubmit={handleSubmit} noValidate className="mt-10">
                <div>
                  <label htmlFor="f-nom" className="form-label">
                    Nom complet <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="f-nom"
                    type="text"
                    autoComplete="name"
                    value={form.nom}
                    onChange={set("nom")}
                    aria-invalid={Boolean(errors.nom)}
                    aria-describedby={errors.nom ? "err-nom" : undefined}
                    placeholder="Ex. : Kossi Adjovi"
                    className="form-input mt-2"
                  />
                  {errors.nom ? (
                    <p id="err-nom" role="alert" className="form-error">
                      {errors.nom}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-age" className="form-label">
                      Âge <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="f-age"
                      type="number"
                      inputMode="numeric"
                      min={10}
                      max={99}
                      autoComplete="none"
                      value={form.age}
                      onChange={set("age")}
                      aria-invalid={Boolean(errors.age)}
                      aria-describedby={errors.age ? "err-age" : undefined}
                      placeholder="Ex. : 28"
                      className="form-input mt-2"
                    />
                    {errors.age ? (
                      <p id="err-age" role="alert" className="form-error">
                        {errors.age}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="f-profession" className="form-label">
                      Profession <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="f-profession"
                      type="text"
                      autoComplete="organization-title"
                      value={form.profession}
                      onChange={set("profession")}
                      aria-invalid={Boolean(errors.profession)}
                      aria-describedby={
                        errors.profession ? "err-profession" : undefined
                      }
                      placeholder="Ex. : comptable, étudiant…"
                      className="form-input mt-2"
                    />
                    {errors.profession ? (
                      <p id="err-profession" role="alert" className="form-error">
                        {errors.profession}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="f-email" className="form-label">
                    Adresse email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="f-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={set("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "err-email" : undefined}
                    placeholder="Ex. : ton.email@exemple.com"
                    className="form-input mt-2"
                  />
                  {errors.email ? (
                    <p id="err-email" role="alert" className="form-error">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-pays" className="form-label">
                      Pays <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="f-pays"
                      type="text"
                      autoComplete="country-name"
                      value={form.pays}
                      onChange={set("pays")}
                      aria-invalid={Boolean(errors.pays)}
                      aria-describedby={errors.pays ? "err-pays" : undefined}
                      placeholder="Ex. : Bénin"
                      className="form-input mt-2"
                    />
                    {errors.pays ? (
                      <p id="err-pays" role="alert" className="form-error">
                        {errors.pays}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="f-ville" className="form-label">
                      Ville <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="f-ville"
                      type="text"
                      autoComplete="address-level2"
                      value={form.ville}
                      onChange={set("ville")}
                      aria-invalid={Boolean(errors.ville)}
                      aria-describedby={errors.ville ? "err-ville" : undefined}
                      placeholder="Ex. : Cotonou"
                      className="form-input mt-2"
                    />
                    {errors.ville ? (
                      <p id="err-ville" role="alert" className="form-error">
                        {errors.ville}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Motivation : pourquoi veut-il exactement apprendre l'anglais */}
                <div className="mt-6">
                  <label htmlFor="f-motivation" className="form-label">
                    Pourquoi veux-tu exactement apprendre l&apos;anglais ?{" "}
                    <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="f-motivation"
                    rows={3}
                    value={form.motivation}
                    onChange={set("motivation")}
                    aria-invalid={Boolean(errors.motivation)}
                    aria-describedby={
                      errors.motivation ? "err-motivation" : undefined
                    }
                    placeholder="Ex. : je veux passer un entretien d'embauche en anglais, parler avec mes clients, réussir un examen…"
                    className="form-input mt-2 resize-y"
                  />
                  {errors.motivation ? (
                    <p id="err-motivation" role="alert" className="form-error">
                      {errors.motivation}
                    </p>
                  ) : null}
                </div>

                {/* Question test de niveau — débutant ou intermédiaire */}
                <fieldset className="mt-8">
                  <legend className="form-label">
                    Petit test express — complète la phrase :{" "}
                    <span className="font-display italic text-white">
                      « {NIVEAU_QUESTION} »
                    </span>{" "}
                    <span aria-hidden="true">*</span>
                  </legend>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {NIVEAU_OPTIONS.map((o) => (
                      <label
                        key={o.value}
                        className="form-choice flex min-h-[52px] cursor-pointer items-center gap-3 rounded-[8px] border border-white/25 bg-white/[0.04] px-4 py-3 transition-colors duration-[240ms] hover:border-white/50"
                      >
                        <input
                          type="radio"
                          name="niveau"
                          value={o.value}
                          checked={form.niveau === o.value}
                          onChange={set("niveau")}
                          className="h-[18px] w-[18px] shrink-0 accent-white"
                        />
                        <span className="t-body text-white">{o.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.niveau ? (
                    <p id="err-niveau" role="alert" className="form-error">
                      {errors.niveau}
                    </p>
                  ) : null}
                </fieldset>

                {/* Soumission : WhatsApp + redirection paiement */}
                <div className="mt-10" data-wa-cta>
                  <button
                    type="submit"
                    className="btn btn-primary t-btn w-full text-[1.0625rem] lg:text-[1.125rem]"
                  >
                    {CTA_LABELS.contact}
                  </button>
                  <p className="t-caption mt-4 text-center text-white/70">
                    En soumettant, tes informations arrivent directement sur
                    mon WhatsApp et tu es dirigé automatiquement vers le
                    paiement sécurisé du programme (70 000 FCFA — paiement
                    unique).
                  </p>
                  {/* Garantie basée sur l'engagement (instruction
                      propriétaire) — rappel au moment exact de la
                      décision */}
                  <p className="t-caption mt-3 text-center text-white/70">
                    Garantie basée sur ton engagement : conditions respectées
                    sans expression à 02 mois — remboursement intégral.
                  </p>
                </div>

                {/* Confirmation après envoi (pendant la redirection) */}
                {sent ? (
                  <div
                    role="status"
                    className="mt-6 rounded-[12px] border border-white/25 bg-white/[0.06] p-6 text-center"
                  >
                    <p className="t-body text-white">
                      Merci ! Ta demande part sur mon WhatsApp. Redirection
                      vers le paiement en cours…
                    </p>
                    {lastMessage ? (
                      <p className="t-caption mt-3 text-white/70">
                        Si WhatsApp ne s&apos;est pas ouvert,{" "}
                        <a
                          href={waLink(lastMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 hover:text-white"
                        >
                          clique ici pour l&apos;envoyer
                        </a>
                        .
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </form>
            </Reveal>

            <Reveal delay={200}>
              <p className="t-caption mt-12 text-center text-white/60">
                Je te réponds personnellement. Aucun engagement avant
                d&apos;avoir échangé.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA sticky mobile — scrolle vers le formulaire (ancre #contact) */}
      <StickyCTA href="#contact" label="Remplir le formulaire →" />
    </div>
  );
}
