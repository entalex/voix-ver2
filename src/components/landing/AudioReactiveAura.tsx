import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * 2026 Premium Voice-Intelligence Shader
 * Electric Cyan (#40E0FF) + Neon Wasabi (#7FFF00)
 */
const AuraMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 0,
    uColor: new THREE.Color("#40E0FF"),
    uAccentColor: new THREE.Color("#7FFF00"),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying float vDistortion;
    uniform float uTime;
    uniform float uIntensity;

    void main() {
      vUv = uv;
      float distortion = sin(position.x * 8.0 + uTime) * cos(position.z * 8.0 + uTime) * uIntensity;
      vDistortion = distortion;
      vec3 newPosition = position + normal * distortion * 0.25;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying float vDistortion;
    uniform vec3 uColor;
    uniform vec3 uAccentColor;

    void main() {
      float glow = pow(0.6 - distance(vUv, vec2(0.5)), 4.0) * 12.0;
      vec3 baseColor = mix(uColor, uAccentColor, vDistortion);
      gl_FragColor = vec4(baseColor, glow * 0.9);
    }
  `
);

extend({ AuraMaterial });

// Extend JSX for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      auraMaterial: any;
    }
  }
}

const AuraSphere = ({ isListening }: { isListening: boolean }) => {
  const materialRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
      const targetIntensity = isListening ? 0.8 : 0.2;
      materialRef.current.uIntensity = THREE.MathUtils.lerp(
        materialRef.current.uIntensity,
        targetIntensity + Math.sin(clock.getElapsedTime() * 2) * 0.1,
        0.1
      );
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1.8, 64, 64]} />
      <auraMaterial ref={materialRef} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

const AudioReactiveAura = () => {
  const [isListening, setIsListening] = useState(false);

  return (
    <div
      className="relative w-full aspect-square max-w-[400px] mx-auto cursor-pointer"
      onClick={() => setIsListening((prev) => !prev)}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#40E0FF" />
        <pointLight position={[-5, -5, -3]} intensity={0.4} color="#7FFF00" />
        <Suspense fallback={null}>
          <AuraSphere isListening={isListening} />
        </Suspense>
      </Canvas>

      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle at center, hsla(187,100%,63%,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
};

export default AudioReactiveAura;