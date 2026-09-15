"use client";

import { useRef, useState } from "react";
import { CHECKOUT_URL, CTA_LABELS, waLink } from "@/lib/site";
import { sendContactEmail, type ContactFormData } from "@/lib/contact-email";
import { INSCRIPTION_KEY } from "@/lib/receipt";
import { Container, PageHero } from "../layout-primitives";
import { Reveal } from "../reveal";
import { StickyCTA } from "../sticky-cta";
import { FlagUK } from "../icons";

/**
 * PAGE 7 — CONTACT / INSCRIPTION (instructions propriétaire)
 * Fonction : conversion finale — le formulaire qualifie le prospect
 * pour L'OFFRE UNIQUE (Programme « De Comprendre à Parler » —
 * 03 mois — 70 000 FCFA — paiement unique), puis — à la soumission —
 * les données sont envoyées DIRECTEMENT PAR EMAIL à
 * stevensakpovi@gmail.com (fiche professionnelle structurée, avec le
 * texte original du prospect) et le prospect est dirigé vers la page
 * de paiement. Si l'email échoue, un lien de secours WhatsApp
 * contenant la même fiche est proposé — aucune donnée n'est perdue.
 *
 * TASK 27 — ÉVALUATION AUTOMATIQUE DU NIVEAU D'ANGLAIS :
 * Plus de QCM ni de niveau auto-déclaré. Une rédaction libre en
 * anglais (« tell me about yourself… »), TAPÉE À LA MAIN (coller est
 * bloqué), évaluée côté serveur (vocabulaire / construction /
 * grammaire / développement des idées / cohérence — 5 × 20 = 100) :
 * 0-49 BEGINNER, 50-100 INTERMEDIATE — de façon non mécanique : le
 * cœur est la capacité à communiquer et développer des idées de façon
 * autonome. Le coach reçoit le niveau estimé, le score, la confiance,
 * le texte ORIGINAL et une explication de 1-3 phrases.
 *
 * Le numéro WhatsApp n'est JAMAIS affiché (instruction propriétaire).
 */

/* — Le programme (offre unique) — plus de choix de formule
     (instruction propriétaire : la conversion tourne autour d'UNE
     SEULE offre). — */
const PROGRAMME_LABEL =
  "Programme « De Comprendre à Parler » — 03 mois — 70 000 FCFA — paiement unique";

/* — Question d'évaluation (instruction propriétaire Task 27, libellé
     exact — Task 28 : le drapeau 🇬🇧 emoji est remplacé par un SVG qui
     s'affiche sur TOUS les appareils, et la question passe en corps
     plus grand, plus lisible). — */
const ANGLAIS_QUESTION =
  "In English, tell me about yourself, what you currently do, and why you want to improve your English.";
/* Task 29 (instruction propriétaire) : consigne ENTIÈREMENT EN
   FRANÇAIS — même l'objectif de la question, pour que le prospect
   comprenne pourquoi il doit écrire lui-même, sans traducteur ni IA. */
const ANGLAIS_HINT =
  "Répondez aussi naturellement que possible. N'utilisez ni traducteur ni IA. (L'objectif est de connaître votre niveau réel pour savoir comment vous accompagner)";
const ANGLAIS_PASTE_NOTICE =
  "Veuillez saisir votre propre réponse vous-même.";

/* Astérisque obligatoire — ROUGE dans tout le formulaire (instruction
   propriétaire Task 28). */
function Req() {
  return (
    <span aria-hidden="true" className="font-semibold text-red-button">
      *
    </span>
  );
}

type FormState = {
  nom: string;
  age: string;
  profession: string;
  email: string;
  pays: string;
  ville: string;
  anglais: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  nom: "",
  age: "",
  profession: "",
  email: "",
  pays: "",
  ville: "",
  anglais: "",
};

const FIELD_ORDER: (keyof FormState)[] = [
  "nom",
  "age",
  "profession",
  "email",
  "pays",
  "ville",
  "anglais",
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
  if (f.anglais.trim().length < 15) {
    e.anglais =
      "Écris ta réponse en anglais — quelques phrases, tapées par toi-même.";
  }
  return e;
}

/** Fiche de secours (WhatsApp) si l'email échoue — mêmes informations
 *  + le niveau estimé, pour que le coach ne perde rien. */
function buildFallbackMessage(
  f: ContactFormData,
  level: string,
  total: number,
): string {
  return [
    "NOUVEAU PROSPECT — MR STEVE ENGLISH",
    "(envoi de secours : l'email n'est pas passé)",
    "",
    "IDENTITÉ",
    `• Nom complet : ${f.nom.trim()}`,
    `• Âge : ${f.age} ans`,
    `• Profession : ${f.profession.trim()}`,
    "",
    "LOCALISATION",
    `• Pays : ${f.pays.trim()}`,
    `• Ville : ${f.ville.trim()}`,
    "",
    "EMAIL",
    `• ${f.email.trim()}`,
    "",
    "ENGLISH LEVEL ASSESSMENT",
    `• Niveau estimé : ${level} (${total}/100)`,
    "",
    "ÉCHANTILLON D'ANGLAIS (texte original)",
    `• ${f.anglais.trim()}`,
    "",
    "PROGRAMME (offre unique)",
    `• ${PROGRAMME_LABEL}`,
    "",
    "— Message envoyé depuis le formulaire du site Stevens AKPOVI",
  ].join("\n");
}

export function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  /** null = pas envoyé ; "ok" = email parti ; "fail" = email en échec. */
  const [result, setResult] = useState<"ok" | "fail" | null>(null);
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [pasteNotice, setPasteNotice] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    // L'erreur disparaît dès que le champ redevient valide en saisie
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  /* Instruction propriétaire : échantillon TAPÉ À LA MAIN — coller
     (et glisser) est bloqué, un avis explique pourquoi. */
  const blockPaste = (e: React.ClipboardEvent | React.DragEvent) => {
    e.preventDefault();
    setPasteNotice(true);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setPasteNotice(false), 3200);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
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
    setSending(true);
    // Task 34 (reçu post-paiement) : persister les données
    // d'inscription dans le navigateur — la page #/bienvenue s'en sert
    // pour PERSONNALISER le reçu PDF du client (nom, email,
    // profession, ville, pays, date). Repli silencieux si localStorage
    // indisponible (le reçu affichera « Non renseigné »).
    try {
      window.localStorage.setItem(
        INSCRIPTION_KEY,
        JSON.stringify({
          nom: form.nom.trim(),
          age: form.age,
          profession: form.profession.trim(),
          email: form.email.trim(),
          pays: form.pays.trim(),
          ville: form.ville.trim(),
          dateInscription: new Date().toISOString(),
        }),
      );
    } catch {
      /* localStorage indisponible — ignoré */
    }
    // Envoi direct par email (FormSubmit AJAX depuis le navigateur) avec
    // évaluation automatique du niveau d'anglais côté client (moteur TS
    // pur — mêmes règles que la lib partagée src/lib/english-assessment).
    const { ok, assessment } = await sendContactEmail({
      nom: form.nom.trim(),
      age: form.age,
      profession: form.profession.trim(),
      email: form.email.trim(),
      pays: form.pays.trim(),
      ville: form.ville.trim(),
      anglais: form.anglais.trim(),
    });
    if (ok) {
      setResult("ok");
      // Redirection automatique vers le paiement
      window.setTimeout(() => {
        window.location.href = CHECKOUT_URL;
      }, 1800);
    } else {
      setFallbackMessage(
        buildFallbackMessage(form, assessment.level, assessment.total),
      );
      setResult("fail");
    }
    setSending(false);
  }

  return (
    <div className="on-dark min-h-[calc(100svh-72px)] bg-black text-white">
      <PageHero
        dark
        title="Prêt à parler anglais avec confiance ?"
        subtitle="Un formulaire. Ma réponse personnelle. Et ton programme de 03 mois peut démarrer cette semaine."
      />

      <section
        id="contact"
        className="relative scroll-mt-20 overflow-hidden pb-12 pt-8 lg:pb-24 lg:pt-12"
      >
        {/* Task 29 (instruction propriétaire) : la carte « Bienvenue à
            toi. » passe en VERRE TRANSPARENT sombre — nappes de couleur
            derrière elle pour rendre la translucidité lisible. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[8rem] top-[2rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8rem] top-[8rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(96,110,190,0.30)_0%,transparent_62%)] blur-2xl"
        />
        <Container className="relative">
          <div className="mx-auto max-w-[42rem]">
            {/* — Message d'accueil chaleureux (instruction propriétaire :
                    juste après le titre, « gravé » au-dessus du formulaire) —
                    Task 29 : VERRE TRANSPARENT sombre (style Pour qui ?). — */}
            <Reveal>
              <div
                className="glass-card glass-dark p-6 md:p-8"
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
                  demande arrive directement dans ma boîte mail, avec ton
                  niveau réel et ton objectif. Je te réponds personnellement.
                </p>
                {/* Rappel du programme (offre unique — instruction
                    propriétaire) au moment exact de la décision.
                    « Comprendre » et « Parler » en rouge (instruction
                    propriétaire — plus de guillemets imbriqués). */}
                <p className="t-caption mt-4 border-t border-white/15 pt-4 text-white/75">
                  Programme « De <span className="text-red-button">Comprendre</span> à{" "}
                  <span className="text-red-button">Parler</span> » — 03 mois
                  de coaching d&apos;anglais personnalisé — 70 000 FCFA —
                  paiement unique.
                </p>
              </div>
            </Reveal>

            {/* — Formulaire de qualification — */}
            <Reveal delay={120}>
              <form onSubmit={handleSubmit} noValidate className="mt-10">
                <div>
                  <label htmlFor="f-nom" className="form-label">
                    Nom complet <Req />
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
                      Âge <Req />
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
                      Profession <Req />
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
                    Adresse email <Req />
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
                      Pays <Req />
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
                      Ville <Req />
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

                {/* Évaluation du niveau d'anglais — rédaction libre,
                    obligatoire, TAPÉE À LA MAIN (coller bloqué). Le
                    niveau n'est plus auto-déclaré : il est estimé
                    automatiquement (5 critères × 20) et remis au coach
                    avec le texte original (instruction Task 27). */}
                <div className="mt-8">
                  {/* Task 28 (instruction propriétaire) : question en
                      police PLUS GRANDE que les autres libellés, et
                      drapeau UK en SVG (l'emoji 🇬🇧 ne s'affiche pas sur
                      tous les appareils — Windows affiche « GB »). */}
                  <label
                    htmlFor="f-anglais"
                    className="form-label text-[1.0625rem] leading-snug md:text-[1.1875rem]"
                  >
                    {/* Task 32 (retour propriétaire) : drapeau de
                        retour à son état RECTANGULAIRE précédent
                        (Task 28 — 2:1, comme le vrai Union Jack). */}
                    <FlagUK className="mr-2.5 h-[1em] w-[2em] rounded-[2px] align-[-0.125em] shadow-[0_0_0_1px_rgba(255,255,255,0.25)]" />{" "}
                    {ANGLAIS_QUESTION} <Req />
                  </label>
                  <p className="t-caption mt-1.5 text-white/65">
                    {ANGLAIS_HINT}
                  </p>
                  {/* Task 28 : PAS de placeholder — le prospect ne peut
                      pas re-saisir l'exemple à sa place (instruction
                      propriétaire).
                      Task 32 (retour propriétaire) : hauteur LÉGÈREMENT
                      réduite (rows 6→5) — la saisie reste illimitée et
                      le champ reste redimensionnable. */}
                  <textarea
                    id="f-anglais"
                    rows={5}
                    autoComplete="off"
                    spellCheck={false}
                    value={form.anglais}
                    onChange={set("anglais")}
                    onPaste={blockPaste}
                    onDrop={blockPaste}
                    aria-invalid={Boolean(errors.anglais)}
                    aria-describedby={
                      errors.anglais ? "err-anglais" : undefined
                    }
                    className="form-input mt-2 resize-y font-[450]"
                  />
                  <p
                    aria-live="polite"
                    className={
                      pasteNotice
                        ? "t-caption mt-2 text-red-button transition-opacity duration-200"
                        : "t-caption mt-2 text-transparent transition-opacity duration-200"
                    }
                  >
                    {ANGLAIS_PASTE_NOTICE}
                  </p>
                  {errors.anglais ? (
                    <p id="err-anglais" role="alert" className="form-error">
                      {errors.anglais}
                    </p>
                  ) : null}
                </div>

                {/* Soumission : email direct + redirection paiement */}
                <div className="mt-10" data-wa-cta>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn btn-primary t-btn w-full text-[1.0625rem] lg:text-[1.125rem] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {sending ? "Envoi en cours…" : CTA_LABELS.contact}
                  </button>
                  <p className="t-caption mt-4 text-center text-white/70">
                    En soumettant, tes informations m&apos;arrivent directement
                    par email et tu es dirigé automatiquement vers le
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
                {result === "ok" ? (
                  <div
                    role="status"
                    className="mt-6 rounded-[12px] border border-white/25 bg-white/[0.06] p-6 text-center"
                  >
                    <p className="t-body text-white">
                      Merci ! Ta demande m&apos;a été envoyée par email. Je
                      découvre ton niveau réel et ton objectif, et je te
                      réponds personnellement. Redirection vers le paiement
                      sécurisé en cours…
                    </p>
                  </div>
                ) : null}

                {/* Échec de l'email : aucune donnée perdue — lien de
                    secours WhatsApp avec la même fiche + paiement
                    manuel */}
                {result === "fail" ? (
                  <div
                    role="alert"
                    className="mt-6 rounded-[12px] border border-white/25 bg-white/[0.06] p-6 text-center"
                  >
                    <p className="t-body text-white">
                      L&apos;envoi par email n&apos;a pas abouti. Pour que ta
                      demande ne se perde pas, envoie-la via WhatsApp en un
                      clic :
                    </p>
                    {fallbackMessage ? (
                      <a
                        href={waLink(fallbackMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary t-btn mt-5 inline-flex"
                      >
                        Envoyer ma demande via WhatsApp →
                      </a>
                    ) : null}
                    <p className="t-caption mt-4 text-white/70">
                      Ou continue directement vers le{" "}
                      <a
                        href={CHECKOUT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:text-white"
                      >
                        paiement sécurisé du programme
                      </a>
                      .
                    </p>
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

      {/* Séparateur formulaire / footer (instruction propriétaire
          Task 28) : lumière blanche bien visible qui circule
          horizontalement, de la gauche vers la droite, en continu —
          la ligne sépare le formulaire du footer. */}
      <div className="beam-separator" aria-hidden="true" />
    </div>
  );
}
