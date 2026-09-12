import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Primitives de mise en page (DA §7) :
 * — Container : max-width 1200px, gouttière 24px desktop, marges 20px mobile.
 * — Section : padding vertical 96px desktop / 48px mobile, sans exception.
 * — Eyebrow : label 13px/500, casse phrase, jamais majuscules (DA §6).
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-5 md:px-6", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
}) {
  return (
    <Tag id={id} className={cn("py-12 lg:py-24", className)}>
      {children}
    </Tag>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("t-eyebrow", className)}>{children}</p>;
}

/** Limite de lecture : 70-78 caractères max (DA §6) sur les corps de texte. */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("max-w-[42rem] space-y-4", className)}>{children}</div>;
}

/**
 * Hero des pages intérieures : H1 + sous-titre, centré (le centrage est
 * réservé aux moments d'affirmation courte — DA §7). Le padding supérieur
 * intègre la hauteur de la navigation fixe (64px mobile / 72px desktop)
 * en plus du rythme de section 48/96px.
 */
export function PageHero({
  title,
  subtitle,
  dark = false,
  id,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  dark?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className="pt-[112px] lg:pt-[168px]">
      <Container className="text-center">
        <h1 className={cn("t-h1", dark ? "text-white" : "text-black")}>
          {title}
        </h1>
        {subtitle ? (
          <p
            className={cn(
              "t-body mx-auto mt-6 max-w-[38rem]",
              dark ? "text-white/80" : "text-grey-mid",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
