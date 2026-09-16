import { redirect } from "next/navigation";

/**
 * /FAQ — redirection serveur (Task 48) : la page FAQ autonome a été
 * supprimée (instruction propriétaire) — les questions fréquentes
 * vivent SUR l'accueil. Les éventuels liens /faq (sans hash) atterrissent
 * donc sur l'accueil, section Questions fréquentes. L'ancien lien
 * …/#/faq est aussi traduit vers cette cible par le script inline de
 * layout.tsx.
 */
export default function Page() {
  redirect("/?section=faq");
}
