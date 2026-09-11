"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Accordéon FAQ (DA §7 + §13 animation 5) : pleine largeur, fond blanc,
 * une seule question ouverte à la fois, icône plus/moins en linework
 * Bleu Profond 1.5px (style organique du système graphique — jamais
 * de chevron générique). Ouverture : hauteur auto + fondu, 280ms.
 */

function PlusMinusIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0"
    >
      {/* Trait horizontal — toujours visible */}
      <path
        d="M5.5 11 C 8 10.8, 14 10.8, 16.5 11"
        stroke="#000000"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Trait vertical — se rétracte à l'ouverture (plus → moins) */}
      <path
        className="faq-icon-vertical"
        d="M11 5.5 C 10.8 8, 10.8 14, 11 16.5"
        stroke="#000000"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FaqAccordion({
  items,
  className,
}: {
  items: { question: string; answer: ReactNode }[];
  className?: string;
}) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className={cn("w-full", className)}
    >
      {items.map((item, i) => (
        <AccordionPrimitive.Item
          key={i}
          value={`q-${i}`}
          className="border-b border-grey-line first:border-t"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="faq-trigger group flex min-h-[64px] flex-1 items-start justify-between gap-6 py-5 text-left outline-none">
              <span className="t-h3 font-medium text-black">
                {item.question}
              </span>
              <PlusMinusIcon />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="faq-content overflow-hidden">
            <div className="pb-6 pr-10">
              <div className="t-body max-w-[42rem] text-black">{item.answer}</div>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
