"use client";

/**
 * Scène 3D « avion de ligne stylisé » (Canvas react-three-fiber) —
 * recréation de l'asset Spline communautaire « 3D Airplane »
 * (d720491f-c849-4a57-b9d1-2ab6e9a5b01a) désigné par le propriétaire
 * (page Résultats, à droite de « Un parcours réel »).
 *
 * Livery fidèle à la référence : fuselage supérieur MINT (#4ECDC4),
 * ventre NOIR séparé par un liseré ROUGE, ailes en flèche gris anthracite,
 * nacelles noires à anneau d'entrée rouge, dérive noire au chevron
 * blanc-bleu-rouge, hublots sombres, matériaux mats (roughness ~0.7).
 *
 * Orientation (instruction propriétaire) : légèrement oblique, montant
 * du bas-gauche vers le haut-droite — le nez pointe vers la droite et
 * la droite, rotation.z positive.
 *
 * Perf : même discipline que la scène micro — chargée dynamiquement
 * (ssr:false), montage à l'approche du viewport, frameloop coupé hors
 * écran, géométries primitives uniquement, pas de post-processing.
 * prefers-reduced-motion : rendu statique.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/* — Palette (livery de la référence Spline) — */
const MINT = "#4ECDC4";
const BLACK = "#141416";
const GREY_WING = "#3a3a3f";
const RED = "#ff0000";
const WHITE = "#f5f5f5";
const BLUE = "#1f4fd8";

/** Environnement studio (réflexions douces) — PMREM une fois. */
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

/** Texture halo douce (ombres de contact / lueurs). */
function useGlowTexture(): THREE.Texture {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(0.55, "rgba(0,0,0,0.22)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Nacelle moteur : cylindre noir + anneau d'entrée rouge + soufflante
 *  grise (qui tourne discrètement). */
function Engine({
  position,
  fan,
}: {
  position: [number, number, number];
  fan: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group position={position}>
      {/* Nacelle */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.135, 0.15, 0.42, 24]} />
        <meshStandardMaterial color={BLACK} roughness={0.55} metalness={0.25} />
      </mesh>
      {/* Anneau d'entrée rouge */}
      <mesh position={[-0.215, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.132, 0.02, 10, 32]} />
        <meshStandardMaterial
          color={RED}
          emissive={RED}
          emissiveIntensity={0.35}
          roughness={0.4}
        />
      </mesh>
      {/* Soufflante (rotation) */}
      <group ref={fan} position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.115, 0.115, 0.02, 20]} />
          <meshStandardMaterial color="#9aa0a6" roughness={0.35} metalness={0.7} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i * Math.PI) / 2]}
            position={[0.012, 0, 0]}
          >
            <boxGeometry args={[0.02, 0.21, 0.045]} />
            <meshStandardMaterial color="#6b7076" roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
      </group>
      {/* Cône d'échappement */}
      <mesh position={[0.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.16, 20]} />
        <meshStandardMaterial color="#222226" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

/** L'avion complet — livery mint/noir/rouge, ailes en flèche,
 *  dérive à chevron tricolore, hublots, flottement + parallaxe. */
function Airplane({ reduced }: { reduced: boolean }) {
  const glow = useGlowTexture();
  const group = useRef<THREE.Group>(null);
  const fans = useRef<(THREE.Group | null)[]>([]);
  const sway = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (reduced || !group.current) return;
    const t = state.clock.elapsedTime;

    /* Flottement lent : l'avion plane, très légère assiette dynamique */
    group.current.position.y = Math.sin(t * 0.8) * 0.06;
    group.current.rotation.x = Math.sin(t * 0.55) * 0.02;

    /* Parallaxe pointeur : le buste suit doucement la souris */
    const targetY = state.pointer.x * 0.16;
    const targetX = state.pointer.y * 0.07;
    sway.current.y += (targetY - sway.current.y) * Math.min(1, delta * 3);
    sway.current.x += (targetX - sway.current.x) * Math.min(1, delta * 3);
    group.current.rotation.y = -0.42 + sway.current.y;
    group.current.rotation.x += sway.current.x;

    /* Souffiantes : rotation discrète */
    for (const f of fans.current) {
      if (f) f.rotation.y += delta * 5.5;
    }
  });

  /* Hublots : petite rangée sombre de chaque côté */
  const windows = useMemo(() => {
    const list: [number, number, number][] = [];
    for (let i = 0; i < 9; i++) {
      const x = -1.15 + i * 0.24;
      list.push([x, 0.1, 0.405]); // bâbord
      list.push([x, 0.1, -0.405]); // tribord
    }
    return list;
  }, []);

  return (
    <group
      ref={group}
      /* Oblique ascendant (instruction propriétaire) : nez vers la
         droite, légèrement cabré — bas-gauche vers haut-droite. */
      rotation={[0, -0.42, 0.14]}
    >
      {/* — Fuselage : tube mint + ventre noir + liseré rouge — */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 3.3, 28]} />
        <meshStandardMaterial color={MINT} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Ventre noir : demi-tube décalé vers le bas */}
      <mesh position={[0, -0.135, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.315, 0.315, 3.32, 28, 1, false, Math.PI, Math.PI]} />
        <meshStandardMaterial color={BLACK} roughness={0.65} metalness={0.1} />
      </mesh>
      {/* Liseré rouge à la jonction mint/noir */}
      <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.383, 0.383, 3.34, 28, 1, false, Math.PI + 0.18, Math.PI - 0.36]} />
        <meshStandardMaterial color={RED} roughness={0.45} />
      </mesh>

      {/* Nez : sphère mint aplatie + pointe */}
      <mesh position={[1.68, 0.02, 0]} scale={[1.35, 1, 1]}>
        <sphereGeometry args={[0.38, 24, 18]} />
        <meshStandardMaterial color={MINT} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Verrière cockpit */}
      <mesh position={[1.52, 0.22, 0]} scale={[1.6, 0.5, 0.9]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color="#101018" roughness={0.15} metalness={0.4} />
      </mesh>

      {/* Queue : cône effilé vers le haut */}
      <mesh position={[-1.85, 0.1, 0]} rotation={[0, 0, Math.PI / 2 + 0.08]}>
        <coneGeometry args={[0.36, 0.62, 24]} />
        <meshStandardMaterial color={MINT} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Hublots : petits disques sombres encastrés */}
      {windows.map((p, i) => (
        <mesh key={i} position={p} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 0.02, 10]} />
          <meshStandardMaterial color="#181820" roughness={0.25} metalness={0.35} />
        </mesh>
      ))}

      {/* — Ailes en flèche (gris anthracite), traversantes — */}
      <mesh position={[-0.18, -0.09, 0.62]} rotation={[0.06, -0.42, 0.06]}>
        <boxGeometry args={[1.05, 0.05, 1.5]} />
        <meshStandardMaterial color={GREY_WING} roughness={0.6} metalness={0.15} />
      </mesh>
      <mesh position={[-0.18, -0.09, -0.62]} rotation={[-0.06, 0.42, -0.06]}>
        <boxGeometry args={[1.05, 0.05, 1.5]} />
        <meshStandardMaterial color={GREY_WING} roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Saumons d'aile (pointes) */}
      <mesh position={[-0.5, -0.07, 1.3]} rotation={[0.06, -0.42, 0.06]}>
        <boxGeometry args={[0.5, 0.04, 0.3]} />
        <meshStandardMaterial color={BLACK} roughness={0.55} />
      </mesh>
      <mesh position={[-0.5, -0.07, -1.3]} rotation={[-0.06, 0.42, -0.06]}>
        <boxGeometry args={[0.5, 0.04, 0.3]} />
        <meshStandardMaterial color={BLACK} roughness={0.55} />
      </mesh>

      {/* Moteurs sous les ailes (soufflantes pilotées par refs) */}
      <EngineRef position={[0.22, -0.3, 0.86]} fans={fans} idx={0} />
      <EngineRef position={[0.22, -0.3, -0.86]} fans={fans} idx={1} />

      {/* — Empennage horizontal — */}
      <mesh position={[-1.98, 0.16, 0.42]} rotation={[0, -0.35, 0.05]}>
        <boxGeometry args={[0.5, 0.04, 0.85]} />
        <meshStandardMaterial color={GREY_WING} roughness={0.6} />
      </mesh>
      <mesh position={[-1.98, 0.16, -0.42]} rotation={[0, 0.35, -0.05]}>
        <boxGeometry args={[0.5, 0.04, 0.85]} />
        <meshStandardMaterial color={GREY_WING} roughness={0.6} />
      </mesh>

      {/* — Dérive verticale noire + chevron blanc-bleu-rouge — */}
      <group position={[-2.02, 0.55, 0]} rotation={[0, 0, -0.22]}>
        <mesh>
          <boxGeometry args={[0.55, 0.95, 0.05]} />
          <meshStandardMaterial color={BLACK} roughness={0.6} />
        </mesh>
        {/* Chevron diagonal : trois bandes parallèles */}
        <group rotation={[0, 0, 0.5]}>
          <mesh position={[0.02, 0.12, 0.031]}>
            <boxGeometry args={[0.5, 0.09, 0.012]} />
            <meshStandardMaterial color={WHITE} roughness={0.5} />
          </mesh>
          <mesh position={[-0.02, 0.12, 0.031]}>
            <boxGeometry args={[0.5, 0.09, 0.012]} />
            <meshStandardMaterial color={BLUE} roughness={0.5} />
          </mesh>
          <mesh position={[-0.06, 0.12, 0.031]}>
            <boxGeometry args={[0.5, 0.09, 0.012]} />
            <meshStandardMaterial color={RED} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* — Ombre de contact douce (disque dégradé sous l'avion) —
          Task 29 (instruction propriétaire) : l'ombre était COUPÉE en
          bas du cadre (son bas dépassait NDC −1) — remontée (y −1.55 →
          −1.35), légèrement resserrée (échelle y 1.15 → 1.05) et le
          regard de la caméra descend d'un cran (lookAt y 0.1 → −0.1)
          pour que l'OMBRE ENTIÈRE respire dans le cadre. — */}
      <sprite position={[0, -1.35, 0.3]} scale={[3.6, 1.05, 1]} center={[0.5, 0.5]}>
        <spriteMaterial
          map={glow}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

/** Enveloppe Engine avec ref soufflante pilotée par le parent. */
function EngineRef({
  position,
  fans,
  idx,
}: {
  position: [number, number, number];
  fans: React.RefObject<(THREE.Group | null)[]>;
  idx: number;
}) {
  const fan = useRef<THREE.Group>(null);
  useEffect(() => {
    if (fans.current) fans.current[idx] = fan.current;
  });
  return <Engine position={position} fan={fan} />;
}

/** Canvas racine — caméra 3/4 avant, ACES, DPR borné, frameloop à la
 *  demande si reduced / hors écran. */
export default function AirplaneCanvas({
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
      camera={{ position: [2.6, 0.9, 6.4], fov: 32, near: 0.1, far: 40 }}
      onCreated={({ camera }) => camera.lookAt(0, -0.1, 0)}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <StudioEnvironment />
      <ambientLight intensity={0.75} />
      <directionalLight position={[-4, 6, 5]} intensity={1.25} color="#ffffff" />
      <directionalLight position={[5, 2.5, -4]} intensity={0.4} color="#dfe6ff" />
      <Airplane reduced={reduced} />
    </Canvas>
  );
}
