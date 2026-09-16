import { redirect } from "next/navigation";

/**
 * /OFFRES — redirection serveur (Task 48) : ancienne page d'offres
 * supprimée (offre unique, instruction propriétaire) — les éventuels
 * liens /offres (sans hash) atterrissent sur la page Programme. L'ancien
 * lien …/#/offres est aussi traduit vers /programme par le script
 * inline de layout.tsx.
 */
export default function Page() {
  redirect("/programme");
}
