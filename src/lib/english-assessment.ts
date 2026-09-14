/**
 * MOTEUR D'ÉVALUATION DU NIVEAU D'ANGLAIS (Task 27 — instruction
 * propriétaire).
 *
 * Analyse la rédaction libre du prospect (« In English, tell me about
 * yourself… ») et produit une estimation BEGINNER / INTERMEDIATE avec
 * une note sur 100, cinq sous-notes sur 20 (vocabulaire, construction
 * de phrases, grammaire, développement des idées, cohérence), un
 * niveau de confiance et 1-3 phrases d'explication pour le coach.
 *
 * PRINCIPES (instruction propriétaire) :
 * - La note n'est PAS mécanique : le cœur est la capacité à communiquer
 *   et à développer des idées de façon autonome. Des erreurs ne font
 *   pas un débutant — un texte long, structuré et compréhensible reste
 *   INTERMEDIATE même fautive.
 * - Réponse très courte → BEGINNER.
 * - Réponse en français → « BEGINNER / INSUFFICIENT ENGLISH SAMPLE ».
 * - Traducteur suspecté → seulement les deux niveaux + confiance Low.
 * - Libellé « Estimated English Level » — jamais « Official CEFR ».
 *
 * Moteur déterministe (aucune clé API requise en production) : signaux
 * lexicaux, syntaxiques et statistiques documentés ci-dessous.
 */

export type EnglishScores = {
  vocabulaire: number;
  construction: number;
  grammaire: number;
  developpement: number;
  coherence: number;
};

export type EnglishAssessment = {
  /** "BEGINNER" | "INTERMEDIATE" | "BEGINNER / INSUFFICIENT ENGLISH SAMPLE" */
  level: string;
  /** Note globale sur 100 (somme des 5 sous-notes sur 20). */
  total: number;
  scores: EnglishScores;
  confidence: "High" | "Low";
  /** 1 à 3 phrases en français, destinées au coach. */
  explanation: string;
  /** Statistiques brutes (utiles au débogage et à la transparence). */
  stats: {
    mots: number;
    phrases: number;
    motsFrancais: number;
    erreursDetectees: number;
  };
};

/* ------------------------------------------------------------------ */
/* Outils de tokenisation                                              */
/* ------------------------------------------------------------------ */

/** Mots : lettres Unicode + apostrophes (I'm, j'ai, don't). */
function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}']+/gu) ?? []).map((w) =>
    w.replace(/^'+|'+$/g, ""),
  ).filter(Boolean);
}

/** Phrases : séparées par . ! ? ou retours à la ligne. */
function splitSentences(text: string): string[] {
  return text
    .split(/(?:[.!?]+|\n+)\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function countMatches(text: string, re: RegExp): number {
  return (text.match(re) ?? []).length;
}

/* ------------------------------------------------------------------ */
/* Détection du français                                               */
/* ------------------------------------------------------------------ */

/** Mots-outils français non ambigus (pas de mot anglais courant). */
const FR_WORDS = new Set([
  "je", "tu", "il", "elle", "nous", "vous", "ils", "elles",
  "et", "ou", "le", "la", "les", "un", "une", "des", "du", "au", "aux",
  "est", "suis", "es", "êtes", "sommes", "sont", "était", "étaient",
  "serai", "serais", "serait", "serons", "serez",
  "ai", "as", "avons", "avez", "ont", "avais", "avait",
  "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses",
  "notre", "nos", "votre", "vos", "leurs",
  "mais", "donc", "car", "avec", "dans", "sur", "sous",
  "pas", "ne", "ni", "qui", "que", "quoi", "dont",
  "peux", "peut", "pouvoir", "veux", "veut", "vouloir",
  "fais", "fait", "faire", "parle", "parles", "parlent",
  "apprendre", "apprends", "apprend", "étudier", "étudie",
  "parce", "que", "ça", "cest", "très", "aussi", "ici",
  "pourquoi", "comment", "quel", "quelle", "quels", "quelles",
  "année", "ans", "mois", "ville", "pays", "travail", "travaille",
  "habite", "veux", "suis", "jai", "jhabite", "jpour",
]);

/** Signaux de français : mots-outils + accents + bigrammes typiques. */
function frenchRatio(text: string, words: string[]): number {
  if (words.length === 0) return 0;
  let hits = 0;
  for (const w of words) {
    if (FR_WORDS.has(w)) hits++;
  }
  // Bigrammes très caractéristiques (« je suis », « j'ai », « c'est »).
  const lower = text.toLowerCase();
  const bigrams = ["je suis", "j'ai", "c'est", "parce que", "je veux", "il y a", "dans le", "de la", "je me", "pour apprendre"];
  for (const b of bigrams) {
    if (lower.includes(b)) hits += 2;
  }
  // Accents : é è ê ë à â ä ù û ü ô ö î ï ç — quasi absents de l'anglais.
  const accents = countMatches(text, /[éèêëàâäùûüôöîïç]/gi);
  hits += Math.min(accents, 10);
  return hits / words.length;
}

/* ------------------------------------------------------------------ */
/* Détection d'erreurs de grammaire courantes                          */
/* ------------------------------------------------------------------ */

/** Chaque motif = 1 erreur (les exceptions correctes sont exclues). */
const GRAMMAR_ERRORS: { re: RegExp; label: string }[] = [
  // 3e personne du singulier sans -s : « he want », « she work »…
  { re: /\b(he|she|it|somebody|anybody|everyone|everybody|nobody|someone|anyone)\s+(have|do|go|want|need|work|live|like|make|take|know|think|speak|study|play|come|use|help|learn|love|talk)\b/gi, label: "3e personne sans -s" },
  // Sujet / auxiliaire incohérents : « I is », « we was », « they is »…
  { re: /\bi\s+(is|are|was|were|has)\b/gi, label: "accord sujet-verbe" },
  { re: /\b(we|you|they)\s+(is|was|am)\b/gi, label: "accord sujet-verbe" },
  // Calques du français : « I have 25 years », « I am agree », « I am work »…
  { re: /\bi\s+have\s+\d+\s+years?\b/gi, label: "calque du français (âge)" },
  { re: /\b(i\s+am|am)\s+agree\b/gi, label: "calque du français (accord)" },
  { re: /\bam\s+(work|study|go|want|need|like)\b/gi, label: "auxiliaire + verbe nu" },
  // Infinitif sans « to » : « I want improve »…
  { re: /\bwant\s+(improve|learn|speak|work|study|teach|go|travel|practice)\b/gi, label: "infinitif sans to" },
  // Pluriels irréguliers / indénombrables : « childrens », « informations »…
  { re: /\b(childrens|childs|peoples|womans|mens|informations|advices|furnitures|equipments|softwares|knowledges|homeworks)\b/gi, label: "pluriel fautif" },
  // Sujet manquant : phrase commençant par « Am »…
  { re: /(^|\n\s*|\.\s+|,\s+)(am|is|are|was|were|have|want|work|live)\s+/gi, label: "sujet manquant" },
  // « more better » et autres doubles comparatifs.
  { re: /\bmore\s+(better|easier|harder|bigger|faster)\b/gi, label: "double comparatif" },
  // Article devant un possessif : « the my »…
  { re: /\b(the\s+my|my\s+the|the\s+his|his\s+the)\b/gi, label: "article + possessif" },
  // a/an — « a apple » (exceptions « a university/unique/european/one »).
  { re: /\ba\s+(?!(university|unique|european|one|useful|user))([aeiou]\p{L}*)\b/giu, label: "a/an" },
  // « i » minuscule isolé (coquille récurrente chez les débutants).
  { re: /(?<![\p{L}'])i(?![\p{L}'])/gu, label: "i minuscule" },
];

/* ------------------------------------------------------------------ */
/* Connecteurs (cohérence)                                             */
/* ------------------------------------------------------------------ */

const CONNECTORS = [
  "and", "but", "because", "so", "then", "also", "when", "while",
  "if", "that", "which", "who", "since", "although", "though",
  "however", "therefore", "moreover", "for", "or", "before", "after",
  "actually", "really", "even",
];

/** Connecteurs formels typiques du texte rédigé/traduit. */
const FORMAL_CONNECTORS = [
  "however", "furthermore", "moreover", "nevertheless", "therefore",
  "consequently", "in addition", "nonetheless", "thus",
];

/* ------------------------------------------------------------------ */
/* Moteur principal                                                    */
/* ------------------------------------------------------------------ */

export function assessEnglish(rawText: string): EnglishAssessment {
  const text = rawText.trim();
  const words = tokenize(text);
  const sentences = splitSentences(text);
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const fr = frenchRatio(text, words);

  /* — Cas 1 : réponse en français (ou français écrasant) — */
  if (wordCount > 0 && fr > 0.22) {
    return {
      level: "BEGINNER / INSUFFICIENT ENGLISH SAMPLE",
      total: 0,
      scores: { vocabulaire: 0, construction: 0, grammaire: 0, developpement: 0, coherence: 0 },
      confidence: "Low",
      explanation:
        "La réponse est rédigée en français (ou majoritairement française) : aucun échantillon d'anglais exploitable pour évaluer le niveau. À évaluer directement au premier échange.",
      stats: { mots: wordCount, phrases: sentenceCount, motsFrancais: Math.round(fr * wordCount), erreursDetectees: 0 },
    };
  }

  /* — Cas 2 : réponse vide ou quasi vide — */
  if (wordCount < 4) {
    return {
      level: "BEGINNER",
      total: 4,
      scores: { vocabulaire: 1, construction: 1, grammaire: 0, developpement: 1, coherence: 1 },
      confidence: "Low",
      explanation:
        "Échantillon pratiquement vide : quelques mots isolés, aucune phrase construite. Niveau débutant, à confirmer au premier échange.",
      stats: { mots: wordCount, phrases: sentenceCount, motsFrancais: 0, erreursDetectees: 0 },
    };
  }

  /* — Statistiques générales — */
  const uniqueWords = new Set(words);
  const ttr = uniqueWords.size / wordCount; // richesse lexicale brute
  const avgSentenceWords = sentenceCount > 0 ? wordCount / sentenceCount : wordCount;
  const connectorCount = words.filter((w) => CONNECTORS.includes(w)).length;
  const connectorsPerSentence = sentenceCount > 0 ? connectorCount / sentenceCount : 0;
  const formalCount = FORMAL_CONNECTORS.reduce(
    (n, c) => n + countMatches(text.toLowerCase(), new RegExp(`\\b${c}\\b`, "g")),
    0,
  );

  /* — Erreurs de grammaire — */
  let grammarHits = 0;
  const hitLabels = new Set<string>();
  for (const { re, label } of GRAMMAR_ERRORS) {
    const n = countMatches(text, new RegExp(re.source, re.flags));
    if (n > 0) {
      grammarHits += n;
      hitLabels.add(label);
    }
  }

  /* Majuscules en début de phrase (qualité de construction). */
  const wellStarted = sentences.filter((s) => /^[A-Z"']/.test(s)).length;
  const startRatio = sentenceCount > 0 ? wellStarted / sentenceCount : 0;

  /* Phrase unique interminable (run-on) : pas de ponctuation, tout
   * en un flux — signal débutant fort. */
  const runOn = sentenceCount <= 1 && wordCount > 25;

  /* Contractions naturelles (I'm, don't…) : un texte spontané en
   * utilise ; leur ABSENCE combinée à des connecteurs formels est
   * un signal de traducteur. */
  const contractions = countMatches(
    text,
    /\b(i'm|don't|doesn't|didn't|can't|won't|it's|that's|there's|i've|you're|we're|they're|isn't|aren't|wasn't|weren't|wouldn't|couldn't|shouldn't|let's)\b/gi,
  );

  /* — Sous-note 1 : VOCABULAIRE (/20) — richesse et variété.
   *    Un texte court a mécaniquement un TTR élevé : la richesse
   *    lexicale ne peut pas être démontrée en moins de 30 mots. */
  let vocabulaire: number;
  if (wordCount < 15) {
    vocabulaire = ttr >= 0.75 ? 8 : 6;
  } else if (ttr >= 0.72) {
    vocabulaire = 17;
  } else if (ttr >= 0.58) {
    vocabulaire = 14;
  } else if (ttr >= 0.45) {
    vocabulaire = 11;
  } else {
    vocabulaire = 8;
  }
  // Mots longs et variés : bonus mesuré.
  const longWords = words.filter((w) => w.length >= 7).length;
  if (longWords >= 6) vocabulaire = Math.min(20, vocabulaire + 2);
  else if (longWords >= 3) vocabulaire = Math.min(20, vocabulaire + 1);
  // Interférence française légère : malus.
  if (fr > 0.08) vocabulaire = Math.max(4, vocabulaire - 3);
  if (wordCount < 30) vocabulaire = Math.min(14, vocabulaire);
  else if (wordCount < 45) vocabulaire = Math.min(17, vocabulaire);

  /* — Sous-note 2 : CONSTRUCTION DE PHRASES (/20). */
  let construction: number;
  const frag = sentenceCount === 0 || avgSentenceWords < 4; // fragments
  if (frag) {
    construction = 6;
  } else if (avgSentenceWords >= 6 && avgSentenceWords <= 24) {
    construction = 16;
  } else if (avgSentenceWords <= 32) {
    construction = 13; // phrases longues mais tenues
  } else {
    construction = 10; // phrases-fleuves
  }
  if (sentenceCount >= 3) construction = Math.min(20, construction + 2);
  if (sentenceCount >= 2) {
    // Variation de longueur entre phrases = construction maîtrisée.
    const lens = sentences.map((s) => tokenize(s).length);
    const spread = Math.max(...lens) - Math.min(...lens);
    if (spread >= 4) construction = Math.min(20, construction + 1);
  }
  construction = Math.round(construction * (0.55 + 0.45 * startRatio)); // majuscules
  if (runOn) construction = Math.min(10, construction); // flux sans ponctuation

  /* — Sous-note 3 : GRAMMAIRE (/20) — erreurs détectées, plafonnées. */
  const errorRate = grammarHits / Math.max(1, sentenceCount);
  let grammaire: number;
  if (grammarHits === 0) grammaire = 18;
  else if (errorRate <= 0.34) grammaire = 15;
  else if (errorRate <= 0.75) grammaire = 12;
  else if (errorRate <= 1.4) grammaire = 9;
  else grammaire = 6;
  // Ponctuation finale présente : +1 (textes sans faute seulement).
  const endPunct = countMatches(text, /[.!?](\s|$)/g);
  if (grammarHits > 0) grammaire = Math.min(16, grammaire);
  if (grammarHits === 0 && endPunct >= sentenceCount)
    grammaire = Math.min(19, grammaire + 1);
  // NB : la longueur du texte dilue déjà le taux d'erreurs ci-dessus
  // (principe propriétaire : l'erreur ne fait pas un débutant).

  /* — Sous-note 4 : DÉVELOPPEMENT DES IDÉES (/20) — le cœur. */
  let developpement: number;
  if (wordCount < 12) developpement = 3;
  else if (wordCount < 20) developpement = 6;
  else if (wordCount < 35) developpement = 10;
  else if (wordCount < 50) developpement = 13;
  else if (wordCount < 75) developpement = 16;
  else if (wordCount < 100) developpement = 18;
  else developpement = 19;
  // Plusieurs phrases distinctes = le prospect développe, nuance, relie.
  if (sentenceCount >= 4) developpement = Math.min(20, developpement + 1);
  // Un run-on unique ne « développe » pas malgré son volume.
  if (runOn) developpement = Math.min(11, developpement);

  /* — Sous-note 5 : COHÉRENCE (/20) — les connecteurs ne comptent
   *    que si le texte est effectivement découpé en phrases. */
  let coherence: number;
  if (sentenceCount <= 1) coherence = wordCount <= 25 ? 11 : 9;
  else if (connectorsPerSentence >= 0.8) coherence = 17;
  else if (connectorsPerSentence >= 0.45) coherence = 14;
  else if (connectorsPerSentence >= 0.2) coherence = 11;
  else coherence = 8;
  if (sentenceCount >= 3 && connectorsPerSentence >= 0.45) coherence = Math.min(19, coherence + 1);
  if (fr > 0.08) coherence = Math.max(4, coherence - 3); // code-switching
  if (construction <= 10) coherence = Math.min(12, coherence);

  /* — Agrégation — */
  const scores: EnglishScores = {
    vocabulaire: Math.max(0, Math.min(20, Math.round(vocabulaire))),
    construction: Math.max(0, Math.min(20, Math.round(construction))),
    grammaire: Math.max(0, Math.min(20, Math.round(grammaire))),
    developpement: Math.max(0, Math.min(20, Math.round(developpement))),
    coherence: Math.max(0, Math.min(20, Math.round(coherence))),
  };
  let total =
    scores.vocabulaire +
    scores.construction +
    scores.grammaire +
    scores.developpement +
    scores.coherence;

  /* — Niveau : PRINCIPE NON MÉCANIQUE (instruction propriétaire).
   *    Le cœur = communication autonome + développement des idées :
   *    un texte assez long, connecté et compréhensible reste
   *    INTERMEDIATE même avec des fautes. Inversement, un échantillon
   *    très court ne peut pas être INTERMEDIATE. — */
  let level: "BEGINNER" | "INTERMEDIATE";
  const autonomous = scores.developpement + scores.coherence;
  const lacksSentenceControl = scores.construction <= 10 && scores.grammaire <= 8;
  if (wordCount < 15 || lacksSentenceControl) {
    // Très court OU phrase non maîtrisée → BEGINNER : l'erreur ne fait
    // pas un débutant, mais l'absence de structure de phrase, si.
    level = "BEGINNER";
    total = Math.min(total, 49); // la note reflète la bande du niveau
  } else if (total >= 50) {
    level = "INTERMEDIATE";
  } else if (total >= 43 && autonomous >= 23 && wordCount >= 30) {
    // La communication porte le texte : les fautes ne font pas un débutant.
    level = "INTERMEDIATE";
  } else {
    level = "BEGINNER";
  }
  if (level === "INTERMEDIATE") total = Math.max(total, 52); // cohérence note/niveau

  /* — Confiance et suspicion de traducteur — */
  const suspiciouslyPerfect =
    contractions === 0 && scores.grammaire >= 17 &&
    scores.vocabulaire >= 16 && (total >= 82 || formalCount >= 2) &&
    wordCount >= 35;
  const formalMachine =
    contractions === 0 && formalCount >= 2 && grammarHits === 0 &&
    wordCount >= 40;
  const translatorSuspected = suspiciouslyPerfect || formalMachine;
  const borderline = total >= 45 && total <= 54;
  let confidence: "High" | "Low";
  if (translatorSuspected || borderline || wordCount < 20 || fr > 0.06) {
    confidence = "Low";
  } else {
    confidence = "High";
  }

  /* — Explication (1-3 phrases FR pour le coach) — */
  const parts: string[] = [];
  parts.push(
    `Échantillon de ${wordCount} mots en ${Math.max(1, sentenceCount)} phrase${sentenceCount > 1 ? "s" : ""}.`,
  );
  if (level === "INTERMEDIATE") {
    parts.push(
      grammarHits > 0
        ? `Quelques erreurs repérées (${[...hitLabels].slice(0, 3).join(", ")}), mais les idées sont développées et le propos reste autonome et compréhensible.`
        : "Les idées sont développées, les phrases sont construites et le propos se tient sans aide extérieure.",
    );
  } else {
    parts.push(
      wordCount < 15
        ? "Échantillon trop court pour développer des idées : niveau débutant, à confirmer au premier échange."
        : "Le prospect s'exprime en mots isolés ou en phrases très simples, sans parvenir à développer ses idées de façon autonome pour l'instant.",
    );
  }
  if (translatorSuspected) {
    parts.push(
      "Note : la rédaction semble trop soignée pour un texte spontané — utilisation possible d'un traducteur, à vérifier dès le premier échange.",
    );
  } else if (confidence === "Low") {
    parts.push("Confiance faible : signaux mitigés, à confirmer rapidement à l'oral.");
  }

  return {
    level,
    total: Math.min(100, total),
    scores,
    confidence,
    explanation: parts.slice(0, 3).join(" "),
    stats: {
      mots: wordCount,
      phrases: sentenceCount,
      motsFrancais: Math.round(fr * wordCount),
      erreursDetectees: grammarHits,
    },
  };
}
