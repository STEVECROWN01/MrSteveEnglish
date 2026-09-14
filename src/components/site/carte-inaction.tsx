import { cn } from "@/lib/utils";
import { Eyebrow } from "./layout-primitives";

/**
 * Carte « Le coût de l'inaction » — URGENCE ÉTHIQUE (instruction
 * propriétaire : l'urgence vient de la situation du prospect, jamais
 * d'un artifice, pas de faux compte à rebours).
 * Task 27 (instruction propriétaire) : cette carte vit désormais DANS LE
 * FOOTER — visible sur toutes les pages — au lieu d'être dupliquée page
 * par page. Sur l'accueil, la section CTA finale cède sa place à cette
 * carte globalisée (pas de double affichage consécutif).
 * Task 29 (instruction propriétaire) : apparence de VERRE TRANSPARENT
 * (glassmorphism), comme les cartes « Pour qui ? » — variante sombre
 * (fond noir, texte blanc) ; les nappes de couleur posées par les
 * sections hôtes (footer, CTA final) rendent la translucidité lisible.
 */
export function CarteUrgenceEthique({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card glass-dark p-6 md:p-8 lg:p-10", className)}>
      <Eyebrow className="text-white/75">Le coût de l&apos;inaction</Eyebrow>
      <p className="font-display mt-4 text-[1.375rem] leading-snug text-white md:text-[1.625rem] lg:text-[1.75rem]">
        Chaque mois où tu repousses ta pratique est un mois supplémentaire
        pendant lequel tu restes dans la même situation.
      </p>
      <p className="t-body mt-4 text-white/85">
        Ta prochaine opportunité ne commencera pas quand tu te sentiras
        parfaitement prêt. Commence maintenant.
      </p>
    </div>
  );
}
