import { useRef, useEffect, useCallback } from "react";

const NAVY = "#41506C";
const AMBER = "#F1A900";
const WAVE_COUNT = 12;
const PARTICLE_COUNT = 300;

// Simple seeded pseudo-random for procedural generation
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

// Layered noise function (poor man's Perlin)
const noise = (x: number, t: number, seed: number): number => {
  const s = seed;
  return (
    Math.sin(x * 0.008 + t * 0.4 + s) * 0.5 +
    Math.sin(x * 0.015 + t * 0.25 + s * 2.3) * 0.3 +
    Math.sin(x * 0.003 + t * 0.6 + s * 0.7) * 0.15 +
    Math.sin(x * 0.025 + t * 0.15 + s * 3.1) * 0.05
  );
};

interface WaveDef {
  amplitude: number;
  phaseSpeed: number;
  seed: number;
  opacity: number;
  lineWidth: number;
  color: string;
}

interface Particle {
  waveIndex: number;
  xProgress: number; // 0-1 along wave
  speed: number;
  size: number;
  isAmber: boolean;
  glowPhase: number;
  jitter: number;
}

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const wavesRef = useRef<WaveDef[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const initRef = useRef(false);

  const initWaves = useCallback(() => {
    const baseSeed = Date.now();
    const waves: WaveDef[] = [];
    for (let i = 0; i < WAVE_COUNT; i++) {
      const r = seededRandom(baseSeed + i);
      const r2 = seededRandom(baseSeed + i + 100);
      const isAccent = i >= WAVE_COUNT - 3;
      waves.push({
        amplitude: 18 + r * 30,
        phaseSpeed: 0.3 + r2 * 0.5,
        seed: r * 100,
        opacity: isAccent ? 0.12 + r * 0.15 : 0.06 + r * 0.18,
        lineWidth: isAccent ? 1 : 0.6 + r * 0.8,
        color: isAccent ? AMBER : NAVY,
      });
    }
    wavesRef.current = waves;

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r1 = seededRandom(baseSeed + i + 500);
      const r2 = seededRandom(baseSeed + i + 600);
      const r3 = seededRandom(baseSeed + i + 700);
      const isAmber = r3 > 0.75;
      particles.push({
        waveIndex: Math.floor(r1 * WAVE_COUNT),
        xProgress: r2,
        speed: 0.0003 + r1 * 0.0008,
        size: isAmber ? 1.2 + r3 * 1.5 : 0.6 + r2 * 1.2,
        isAmber,
        glowPhase: r3 * Math.PI * 2,
        jitter: (r1 - 0.5) * 6,
      });
    }
    particlesRef.current = particles;
  }, []);

  const getWaveY = useCallback(
    (x: number, t: number, wave: WaveDef): number => {
      return noise(x, t * wave.phaseSpeed, wave.seed) * wave.amplitude;
    },
    []
  );

  useEffect(() => {
    if (!initRef.current) {
      initWaves();
      initRef.current = true;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = rect.width;
      h = rect.height;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.016;
      const t = timeRef.current;
      const centerY = h * 0.5;
      const waves = wavesRef.current;
      const particles = particlesRef.current;
      const step = 3;

      // Draw waves
      for (const wave of waves) {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity;
        ctx.lineWidth = wave.lineWidth;

        for (let x = 0; x <= w; x += step) {
          const y = centerY + getWaveY(x, t, wave);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Bloom layer — redraw accent waves with blur
      ctx.save();
      ctx.filter = "blur(6px)";
      for (let i = WAVE_COUNT - 3; i < WAVE_COUNT; i++) {
        const wave = waves[i];
        if (!wave) continue;
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity * 0.5;
        ctx.lineWidth = wave.lineWidth + 2;
        for (let x = 0; x <= w; x += step) {
          const y = centerY + getWaveY(x, t, wave);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Draw particles
      for (const p of particles) {
        const wave = waves[p.waveIndex];
        if (!wave) continue;

        // Move particle along wave
        p.xProgress += p.speed;
        if (p.xProgress > 1) p.xProgress -= 1;

        const px = p.xProgress * w;
        const py =
          centerY + getWaveY(px, t, wave) + p.jitter * Math.sin(t * 2 + p.glowPhase);

        const glowCycle = (Math.sin(t * 3 + p.glowPhase) + 1) * 0.5;

        if (p.isAmber) {
          // Amber sparkle with glow
          const alpha = 0.4 + glowCycle * 0.6;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = AMBER;
          ctx.shadowColor = AMBER;
          ctx.shadowBlur = 4 + glowCycle * 8;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.globalAlpha = 0.25 + glowCycle * 0.25;
          ctx.fillStyle = NAVY;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [getWaveY, initWaves]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default ParticleWave;
