import { useRef, useEffect } from "react";

const PRIMARY = "#41506C";
const AMBER = "#F1A900";
const LINE_COLOR_BASE = [65, 80, 108]; // RGB of PRIMARY
const CONNECTION_DIST = 55;
const PARTICLE_COUNT = 350;

interface Dot {
  x: number;
  y: number;
  baseX: number;
  radius: number;
  isAmber: boolean;
  waveIndex: number; // which vertical slice
  tOffset: number;   // random phase offset
}

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const time = useRef(0);
  const dots = useRef<Dot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const buildDots = () => {
      const arr: Dot[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const baseX = Math.random() * (w + 60) - 30;
        arr.push({
          x: baseX,
          y: 0,
          baseX,
          radius: 1.8 + Math.random() * 1.8,
          isAmber: Math.random() < 0.1,
          waveIndex: i,
          tOffset: Math.random() * Math.PI * 2,
        });
      }
      dots.current = arr;
    };

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
      buildDots();
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time.current += 0.006;
      const t = time.current;
      const centerY = h * 0.5;
      const pts = dots.current;

      // Compute waveform envelope and position each dot
      for (const p of pts) {
        // Scroll x slowly left-to-right
        const scrollX = p.baseX + t * 30;
        p.x = ((scrollX % (w + 60)) + (w + 60)) % (w + 60) - 30;

        // Sound waveform envelope: amplitude varies across x
        const nx = p.x / w; // 0..1
        const envelope =
          Math.sin(nx * Math.PI * 3.5 + t * 0.8) * 0.7 +
          Math.sin(nx * Math.PI * 5.2 + t * 0.5) * 0.5 +
          Math.sin(nx * Math.PI * 1.8 + t * 1.2) * 0.4;

        const maxAmp = Math.abs(envelope) * h * 0.22 + h * 0.03;

        // Each dot gets a y within the envelope
        const localPhase = p.tOffset + nx * 8 + t * 0.4;
        const ySpread = (Math.sin(localPhase) * 0.6 + Math.sin(localPhase * 2.3) * 0.4);
        p.y = centerY + ySpread * maxAmp;
      }

      // Draw connections
      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECTION_DIST * CONNECTION_DIST) {
            const dist = Math.sqrt(d2);
            const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.strokeStyle = `rgba(${LINE_COLOR_BASE[0]},${LINE_COLOR_BASE[1]},${LINE_COLOR_BASE[2]},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isAmber ? AMBER : PRIMARY;
        ctx.globalAlpha = p.isAmber ? 0.85 : 0.6;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default ParticleWave;
