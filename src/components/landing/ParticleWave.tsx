import { useRef, useEffect, useCallback } from "react";

const PRIMARY = "#41506C";
const AMBER = "#F1A900";
const DOT_COUNT = 80;
const DOT_RADIUS = 2;

interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  color: string;
  opacity: number;
  dotSize: number;
}

const WAVES: WaveConfig[] = [
  { amplitude: 28, frequency: 0.012, speed: 0.8, phase: 0, color: PRIMARY, opacity: 0.5, dotSize: DOT_RADIUS },
  { amplitude: 20, frequency: 0.016, speed: 1.1, phase: 2, color: PRIMARY, opacity: 0.35, dotSize: DOT_RADIUS * 0.8 },
  { amplitude: 14, frequency: 0.022, speed: 1.5, phase: 4, color: AMBER, opacity: 0.45, dotSize: DOT_RADIUS * 0.9 },
];

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const time = useRef(0);

  const getY = useCallback((x: number, t: number, wave: WaveConfig) => {
    const main = Math.sin(x * wave.frequency + t * wave.speed + wave.phase) * wave.amplitude;
    const harmonic = Math.sin(x * wave.frequency * 2.3 + t * wave.speed * 0.7 + wave.phase + 1) * wave.amplitude * 0.18;
    return main + harmonic;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

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
      time.current += 0.016;
      const t = time.current;
      const centerY = h * 0.5;

      for (const wave of WAVES) {
        const spacing = w / (DOT_COUNT - 1);

        // Draw connecting line
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity * 0.3;
        ctx.lineWidth = 1;
        for (let i = 0; i < DOT_COUNT; i++) {
          const x = i * spacing;
          const y = centerY + getY(x, t, wave);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw dots
        ctx.globalAlpha = wave.opacity;
        for (let i = 0; i < DOT_COUNT; i++) {
          const x = i * spacing;
          const y = centerY + getY(x, t, wave);
          ctx.beginPath();
          ctx.arc(x, y, wave.dotSize, 0, Math.PI * 2);
          ctx.fillStyle = wave.color;
          ctx.fill();
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
  }, [getY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default ParticleWave;
