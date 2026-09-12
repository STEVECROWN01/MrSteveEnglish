"use client";

/**
 * Scène 3D « microphone tech » (Canvas react-three-fiber) — recréation
 * de l'asset Spline communautaire « Tech-Inspired 3D Assets - MICROPHONE »
 * (f0aefca0-296f-4980-80b5-7308eca27124) désigné par le propriétaire.
 * L'embed Spline n'est pas possible (URLs S3 signées, 403 sur
 * scene.splinecode) : l'asset est donc reconstruit en Three.js natif.
 *
 * Adaptation DA : le néon VERT de l'original devient le ROUGE verrouillé
 * du site (#ff0000, DA §19) — cohérence avec CTA et accents. Le fond
 * sombre infini est conservé (posé sur la <Section> entière, canvas
 * transparent — le micro flotte hors de tout bloc).
 *
 * Composition : capsule micro brillante (réflexions studio via
 * RoomEnvironment), corps charbon maté, anneau accent + 2 LED émissives
 * (pulsation « enregistrement »), socle triple étage avec anneau néon,
 * 3 arcs orbitaux animés, parallaxe pointeur (desktop), flottement lent.
 * prefers-reduced-motion : rendu statique une seule frame (DA §16).
 *
 * Perf : chargé dynamiquement (ssr:false) et monté à l'approche du
 * viewport seulement (voir microphone-scene.tsx) ; géométries
 * primitives uniquement, pas de modèle externe, pas de post-processing
 * (halos = sprites additifs) — three.js reste hors du bundle initial.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
/* — Palette (DA §19 : noir/blanc/rouge) — */
const NEON = "#ff1a1a";
const CHARCOAL = "#161619";
const GLOSSY = "#0d0d10";
const METAL_DARK = "#101013";

/** Texture halo (dégradé radial) — générée une fois sur canvas 2D. */
function useGlowTexture(): THREE.Texture {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.3, "rgba(255,255,255,0.42)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Environnement studio (réflexions du métal) — PMREM une fois. */
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    return () => {
      env.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);
  return null;
}

/** Matériau néon : émissif saturé, hors tone mapping (rendu « glow »). */
function NeonMaterial({ intensity = 2.4 }: { intensity?: number }) {
  return (
    <meshStandardMaterial
      color={NEON}
      emissive={NEON}
      emissiveIntensity={intensity}
      toneMapped={false}
      roughness={0.4}
      metalness={0}
    />
  );
}

/** Arc orbital — segment de tore incliné, mis en rotation par le parent. */
function OrbitalArc({
  radius,
  tube,
  arc,
  tilt,
  speed,
  glow,
  reduced,
}: {
  radius: number;
  tube: number;
  arc: number;
  tilt: [number, number, number];
  speed: number;
  glow: THREE.Texture;
  reduced: boolean;
}) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (reduced || !spin.current) return;
    spin.current.rotation.y += delta * speed;
  });
  return (
    <group rotation={tilt} position={[0, 2.18, 0]}>
      <group ref={spin}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, tube, 12, 72, arc]} />
          <NeonMaterial intensity={2.6} />
        </mesh>
        {/* Tête d'arc légèrement plus lumineuse */}
        <sprite
          position={[radius, 0, 0]}
          scale={[tube * 14, tube * 14, 1]}
          center={[0.5, 0.5]}
        >
          <spriteMaterial
            map={glow}
            color={NEON}
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.55}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      </group>
    </group>
  );
}

/** Le microphone complet + socle + lumières + arcs + animations. */
function Microphone({ reduced }: { reduced: boolean }) {
  const glow = useGlowTexture();
  const group = useRef<THREE.Group>(null);
  const ledA = useRef<THREE.MeshStandardMaterial>(null);
  const ledB = useRef<THREE.MeshStandardMaterial>(null);
  const sway = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (reduced || !group.current) return;
    const t = state.clock.elapsedTime;

    /* Flottement lent + balancement discret (base remontée : le socle
       entier tient dans le cadre — instruction propriétaire) */
    group.current.position.y = -0.1 + Math.sin(t * 0.85) * 0.045;

    /* Parallaxe pointeur : lerp doux vers la cible (cédée par state.pointer) */
    const targetY = state.pointer.x * 0.22;
    const targetX = state.pointer.y * 0.1;
    sway.current.y += (targetY - sway.current.y) * Math.min(1, delta * 3.2);
    sway.current.x += (targetX - sway.current.x) * Math.min(1, delta * 3.2);
    group.current.rotation.y = Math.sin(t * 0.3) * 0.05 + sway.current.y;
    group.current.rotation.x = sway.current.x;

    /* Pulsation « enregistrement » des LED */
    const p = 0.5 + 0.5 * Math.sin(t * 2.6);
    const q = 0.5 + 0.5 * Math.sin(t * 2.6 + Math.PI * 0.66);
    if (ledA.current) ledA.current.emissiveIntensity = 1.4 + p * 2.4;
    if (ledB.current) ledB.current.emissiveIntensity = 1.4 + q * 2.4;
  });

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      {/* — Socle : trois étages, anneau néon sur l'étage médian — */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[1.02, 1.06, 0.14, 64]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.55} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.78, 0.82, 0.22, 64]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.55} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.365, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.79, 0.013, 10, 96]} />
        <NeonMaterial intensity={2.2} />
      </mesh>
      <mesh position={[0, 0.41, 0]}>
        <cylinderGeometry args={[0.5, 0.54, 0.1, 64]} />
        <meshStandardMaterial color={METAL_DARK} roughness={0.35} metalness={0.6} />
      </mesh>

      {/* — Pied : rotule + fût — */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.11, 32, 24]} />
        <meshStandardMaterial color={METAL_DARK} roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.06, 0.075, 0.6, 32]} />
        <meshStandardMaterial color={METAL_DARK} roughness={0.35} metalness={0.6} />
      </mesh>

      {/* — Micro : léger tilt, corps conique, LED, anneau, capsule — */}
      <group rotation={[0.04, 0, 0.06]} position={[0, 0, 0.02]}>
        <mesh position={[0, 1.28, 0]}>
          <cylinderGeometry args={[0.3, 0.385, 0.58, 64]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* LED avant (pulsation) */}
        <mesh position={[0, 1.36, 0.345]}>
          <sphereGeometry args={[0.026, 16, 12]} />
          <meshStandardMaterial
            ref={ledA}
            color={NEON}
            emissive={NEON}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 1.24, 0.35]}>
          <sphereGeometry args={[0.026, 16, 12]} />
          <meshStandardMaterial
            ref={ledB}
            color={NEON}
            emissive={NEON}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Anneau accent jonction corps / grille */}
        <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.305, 0.016, 12, 96]} />
          <meshStandardMaterial
            color={NEON}
            emissive={NEON}
            emissiveIntensity={1.8}
            toneMapped={false}
            roughness={0.4}
          />
        </mesh>

        {/* Capsule brillante (grille micro) */}
        <mesh position={[0, 2.26, 0]}>
          <capsuleGeometry args={[0.345, 0.62, 24, 64]} />
          <meshStandardMaterial
            color={GLOSSY}
            roughness={0.16}
            metalness={0.88}
            envMapIntensity={1.25}
          />
        </mesh>
        {/* Micro-relief de grille : anneau fin sombre */}
        <mesh position={[0, 1.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.348, 0.006, 8, 96]} />
          <meshStandardMaterial color="#000000" roughness={0.5} metalness={0.4} />
        </mesh>
      </group>

      {/* — Arcs orbitaux (trois, inclinaisons et vitesses différentes) — */}
      <OrbitalArc radius={0.78} tube={0.016} arc={2.1} tilt={[0.45, 0, 0.15]} speed={0.55} glow={glow} reduced={reduced} />
      <OrbitalArc radius={0.92} tube={0.013} arc={1.55} tilt={[-0.34, 0, -0.3]} speed={-0.42} glow={glow} reduced={reduced} />
      <OrbitalArc radius={0.66} tube={0.021} arc={2.7} tilt={[0.1, 0, 0.55]} speed={0.3} glow={glow} reduced={reduced} />

      {/* — Halos additifs (faux bloom, léger) — */}
      <sprite position={[0, 2.2, -0.75]} scale={[3, 3, 1]} center={[0.5, 0.5]}>
        <spriteMaterial
          map={glow}
          color={NEON}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.13}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
      <sprite position={[0, 1.36, 0.4]} scale={[0.16, 0.16, 1]} center={[0.5, 0.5]}>
        <spriteMaterial
          map={glow}
          color={NEON}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.85}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
      <sprite position={[0, 1.24, 0.41]} scale={[0.16, 0.16, 1]} center={[0.5, 0.5]}>
        <spriteMaterial
          map={glow}
          color={NEON}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.85}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

      {/* — Ombre de contact douce (disque dégradé) — */}
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.55, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <sprite position={[0, 0.02, 0]} scale={[2.9, 2.9, 1]} center={[0.5, 0.5]}>
        <spriteMaterial
          map={glow}
          color="#000000"
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

/** Canvas racine — caméra fixe, ACES, DPR borné, frame à la demande si
 *  reduced. PERF : `active` (visibilité viewport, voir microphone-scene)
 *  coupe le frameloop hors écran — le GPU ne rend rien tant que la scène
 *  n'est pas visible ; DPR plafonné à 1.5 (scène décorative sombre :
 *  rendu identique à l'œil, ~44 % de pixels en moins qu'un DPR 2). */
export default function MicrophoneCanvas({
  reduced,
  active = true,
}: {
  reduced: boolean;
  active?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0.58, 1.75, 7.3], fov: 30, near: 0.1, far: 40 }}
      onCreated={({ camera }) => camera.lookAt(0, 1.3, 0)}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <StudioEnvironment />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.15} color="#ffffff" />
      <directionalLight position={[-5, 3.5, -4]} intensity={0.45} color="#dfe6ff" />
      <pointLight position={[0, 1.55, 1.5]} intensity={2.1} distance={5.5} color={NEON} />
      <pointLight position={[0, 0.45, 0.9]} intensity={1.1} distance={3.5} color={NEON} />
      <Microphone reduced={reduced} />
    </Canvas>
  );
}
