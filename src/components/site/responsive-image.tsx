"use client";

import { cn } from "@/lib/utils";
import variants from "@/lib/image-variants.json";

/**
 * Image responsive « pipeline statique » (perf, instruction propriétaire) :
 * l'optimiseur Next est contourné (aucun double encodage — leçon hero) au
 * profit de variantes de largeur pré-générées par scripts/gen_responsive.js
 * (sharp, lanczos3, WebP q90). Le navigateur ne télécharge que la largeur
 * dont il a réellement besoin (mobile ≈ 4 à 10× plus léger).
 *
 * — fill : positionné en absolu pour couvrir son conteneur (comportement
 *   next/image fill + object-cover posé via className).
 * — width/height : flux naturel (l'attribut ratio réserve la place, zéro CLS).
 * — priority : eager + fetchpriority high (hero uniquement).
 *
 * Le manifest (src/lib/image-variants.json) fournit la largeur naturelle
 * et les variantes existantes pour chaque asset.
 */

type Entry = { natural: [number, number]; variants: number[] };
const MANIFEST = variants as Record<string, Entry>;

export function ResponsiveImage({
  src,
  alt,
  sizes,
  fill = false,
  width,
  height,
  priority = false,
  className,
  fetchPriority,
  ...rest
}: {
  src: string;
  alt: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<"img">, "src" | "alt" | "sizes" | "width" | "height" | "fetchPriority">) {
  const entry = MANIFEST[src];
  const naturalW = entry?.natural[0] ?? width;

  // srcset : variantes pré-générées + l'original comme candidat le plus large
  const srcSet =
    entry && entry.variants.length > 0
      ? [
          ...entry.variants.map(
            (w) => `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`,
          ),
          `${src} ${naturalW}w`,
        ].join(", ")
      : undefined;

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      srcSet={srcSet}
      {...(fill
        ? {
            className: cn("absolute inset-0 h-full w-full", className),
          }
        : {
            width,
            height,
            className,
          })}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : (fetchPriority as never)}
      draggable={false}
      {...rest}
    />
  );
}
