import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NAVY = new THREE.Color("#41506C");
const AMBER = new THREE.Color("#F1A900");
const GLOW_BLUE = new THREE.Color("#7BA3D4");
const BRIGHT_AMBER = new THREE.Color("#FFD060");

const COLS = 140;
const ROWS = 50;
const SPACING = 0.15;
const AMBER_RATIO = 0.06;

const WAVES = [
  { amp: 0.3, freqX: 0.7, freqZ: 0.35, speed: 0.5, phaseX: 0, phaseZ: 0 },
  { amp: 0.22, freqX: 1.1, freqZ: 0.6, speed: 0.75, phaseX: 2.0, phaseZ: 1.2 },
  { amp: 0.14, freqX: 1.6, freqZ: 1.0, speed: 1.2, phaseX: 4.0, phaseZ: 2.8 },
];

const WaveParticles = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mouseWorld = useRef(new THREE.Vector3(-999, 0, -999));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const planeRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = COLS * ROWS;

  const { basePositions, isAmber, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const amber = new Uint8Array(count);
    const s = new Float32Array(count);
    const halfW = (COLS - 1) * SPACING * 0.5;
    const halfD = (ROWS - 1) * SPACING * 0.5;

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const idx = i * COLS + j;
        positions[idx * 3] = j * SPACING - halfW;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = i * SPACING - halfD;
        amber[idx] = Math.random() < AMBER_RATIO ? 1 : 0;
        s[idx] = Math.random() * 100;
      }
    }
    return { basePositions: positions, isAmber: amber, seeds: s };
  }, [count]);

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const color = isAmber[i] ? AMBER : NAVY;
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
    }
    return c;
  }, [count, isAmber]);

  const onPointerMove = useCallback((e: any) => {
    if (!planeRef.current) return;
    const ndc = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(ndc, camera);
    const intersects = raycaster.intersectObject(planeRef.current);
    if (intersects.length > 0) {
      mouseWorld.current.copy(intersects[0].point);
    }
  }, [camera, raycaster]);

  const onPointerLeave = useCallback(() => {
    mouseWorld.current.set(-999, 0, -999);
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const mx = mouseWorld.current.x;
    const mz = mouseWorld.current.z;
    const colorAttr = meshRef.current.instanceColor;

    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const bz = basePositions[i * 3 + 2];
      const seed = seeds[i];

      // Sum 3 waves
      let y = 0;
      for (const w of WAVES) {
        y += w.amp * Math.sin(bx * w.freqX + w.phaseX + t * w.speed)
                    * Math.cos(bz * w.freqZ + w.phaseZ + t * w.speed * 0.6);
      }

      // Micro-jitter for organic feel
      y += Math.sin(t * 2.5 + seed) * 0.015;

      // Mouse disruption — ripple effect
      const dx = bx - mx;
      const dz = bz - mz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const mouseRadius = 3.5;
      if (dist < mouseRadius) {
        const force = (1 - dist / mouseRadius) * (1 - dist / mouseRadius);
        y += force * 1.0 * Math.sin(t * 5 + dist * 3);
      }

      dummy.position.set(bx, y, bz);

      // Scale: larger at peaks, amber slightly bigger
      const heightFactor = 0.5 + Math.abs(y) * 1.2;
      const baseScale = isAmber[i] ? 0.055 : 0.03;
      dummy.scale.setScalar(baseScale * heightFactor);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Dynamic colors
      if (colorAttr) {
        if (isAmber[i]) {
          const glow = 0.7 + Math.sin(t * 4 + seed) * 0.3;
          colorAttr.setXYZ(i,
            AMBER.r + (BRIGHT_AMBER.r - AMBER.r) * glow,
            AMBER.g + (BRIGHT_AMBER.g - AMBER.g) * glow,
            AMBER.b + (BRIGHT_AMBER.b - AMBER.b) * glow
          );
        } else {
          const brightness = 0.3 + Math.abs(y) * 1.5;
          const b = Math.min(brightness, 1);
          colorAttr.setXYZ(i,
            NAVY.r + (GLOW_BLUE.r - NAVY.r) * b,
            NAVY.g + (GLOW_BLUE.g - NAVY.g) * b,
            NAVY.b + (GLOW_BLUE.b - NAVY.b) * b
          );
        }
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (colorAttr) colorAttr.needsUpdate = true;
  });

  return (
    <group onPointerMove={onPointerMove as any} onPointerLeave={onPointerLeave as any}>
      {/* Invisible plane for raycasting mouse position */}
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} visible={false}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>

      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 4]} />
        <meshBasicMaterial toneMapped={false} />
        <instancedBufferAttribute
          attach="instanceColor"
          args={[colors, 3]}
        />
      </instancedMesh>
    </group>
  );
};

const ParticleWave = () => {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: "auto" }}>
      <Canvas
        camera={{
          position: [0, 4, 6.5],
          fov: 48,
          near: 0.1,
          far: 100,
        }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <WaveParticles />
      </Canvas>
    </div>
  );
};

export default ParticleWave;
