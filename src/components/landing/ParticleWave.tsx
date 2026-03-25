import { useRef, useEffect, useCallback } from "react";

const PRIMARY = "#41506C";
const AMBER = "#F1A900";
const WAVE_COUNT = 5;
const DOTS_PER_WAVE = 80;

interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  yOffset: number;
  dotRadius: number;
  opacity: number;
}

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const time = useRef(0);
  const amberIndices = useRef<Set<number>>(new Set());

  // Pre-select ~8% of all dots as amber
  useEffect(() => {
    const set = new Set<number>();
    const total = WAVE_COUNT * DOTS_PER_WAVE;
    const count = Math.floor(total * 0.08);
    while (set.size < count) {
      set.add(Math.floor(Math.random() * total));
    }
    amberIndices.current = set;
  }, []);

  const getWaveConfigs = useCallback((h: number): WaveConfig[] => {
    const center = h * 0.5;
    const spread = h * 0.12;
    return [
      { amplitude: h * 0.08, frequency: 0.012, speed: 0.6, yOffset: center - spread * 2, dotRadius: 2.2, opacity: 0.45 },
      { amplitude: h * 0.11, frequency: 0.009, speed: 0.45, yOffset: center - spread, dotRadius: 2.8, opacity: 0.55 },
      { amplitude: h * 0.14, frequency: 0.007, speed: 0.35, yOffset: center, dotRadius: 3.2, opacity: 0.6 },
      { amplitude: h * 0.10, frequency: 0.010, speed: 0.5, yOffset: center + spread, dotRadius: 2.6, opacity: 0.5 },
      { amplitude: h * 0.07, frequency: 0.013, speed: 0.65, yOffset: center + spread * 2, dotRadius: 2.0, opacity: 0.4 },
    ];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

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
      time.current += 0.012;
      const t = time.current;
      const waves = getWaveConfigs(h);

      let globalIdx = 0;

      for (let wi = 0; wi < waves.length; wi++) {
        const wave = waves[wi];
        const spacing = (w + 40) / DOTS_PER_WAVE;

        for (let i = 0; i < DOTS_PER_WAVE; i++) {
          // Dots flow left to right by shifting x with time
          const rawX = i * spacing - 20 + t * wave.speed * 60;
          // Wrap within canvas width with buffer
          const x = ((rawX % (w + 40)) + (w + 40)) % (w + 40) - 20;

          const y =
            wave.yOffset +
            Math.sin(x * wave.frequency + t * wave.speed * 2) * wave.amplitude +
            Math.sin(x * wave.frequency * 1.8 + t * wave.speed * 1.3) * wave.amplitude * 0.3;

          const isAmber = amberIndices.current.has(globalIdx);
          const color = isAmber ? AMBER : PRIMARY;
          const alpha = isAmber ? wave.opacity + 0.25 : wave.opacity;
          const radius = isAmber ? wave.dotRadius * 1.15 : wave.dotRadius;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha;
          ctx.fill();

          globalIdx++;
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [getWaveConfigs]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default ParticleWave;
