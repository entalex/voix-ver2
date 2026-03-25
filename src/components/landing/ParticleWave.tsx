import { useRef, useEffect } from "react";

const NAVY = "#41506C";
const AMBER = "#F1A900";
const DARK = "#2a3444";
const LINE_COLOR = [120, 130, 145];
const CONNECTION_DIST = 48;
const PARTICLE_COUNT = 600;
const AMBER_RATIO = 0.28;
const WAVE_SPEED = 0.004;

interface Dot {
  x: number;
  y: number;
  basePhase: number;
  radius: number;
  color: string;
  bandOffset: number; // offset within the wave band thickness
  opacity: number;
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
        const rand = Math.random();
        let color: string;
        if (rand < AMBER_RATIO) {
          color = AMBER;
        } else if (rand < AMBER_RATIO + 0.35) {
          color = NAVY;
        } else {
          color = DARK;
        }

        arr.push({
          x: 0,
          y: 0,
          basePhase: (i / PARTICLE_COUNT) * Math.PI * 2 * 5 + Math.random() * 0.8,
          radius: 1.5 + Math.random() * 2.2,
          color,
          bandOffset: (Math.random() - 0.5) * 2, // -1 to 1
          opacity: 0.55 + Math.random() * 0.45,
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
      time.current += WAVE_SPEED;
      const t = time.current;
      const centerY = h * 0.5;
      const pts = dots.current;
      const extendW = w + 80;

      // Position each dot along the wave
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        // Distribute dots across width, scrolling rightward
        const rawX = (i / pts.length) * extendW + t * 60;
        p.x = ((rawX % extendW) + extendW) % extendW - 40;

        const nx = p.x / w; // 0..1 normalized x

        // Main wave: composite of sine waves for organic shape
        const wave1 = Math.sin(nx * Math.PI * 4.5 + t * 1.2) * 0.6;
        const wave2 = Math.sin(nx * Math.PI * 3.0 + t * 0.7 + 1.0) * 0.4;
        const wave3 = Math.sin(nx * Math.PI * 6.0 + t * 1.8 + 2.5) * 0.25;
        const mainWave = wave1 + wave2 + wave3;

        // Amplitude envelope - larger in center, tapering at edges
        const edgeFade = Math.sin(nx * Math.PI);
        const amplitude = h * 0.32 * edgeFade;

        // Band thickness - how wide the ribbon is at this point
        const thickness = h * 0.06 + Math.abs(mainWave) * h * 0.04;

        // Position within the band
        p.y = centerY + mainWave * amplitude + p.bandOffset * thickness;
      }

      // Draw connections - the mesh network
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          if (dx > CONNECTION_DIST || dx < -CONNECTION_DIST) continue;
          const dy = pts[i].y - pts[j].y;
          if (dy > CONNECTION_DIST || dy < -CONNECTION_DIST) continue;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECTION_DIST * CONNECTION_DIST) {
            const dist = Math.sqrt(d2);
            const alpha = (1 - dist / CONNECTION_DIST) * 0.18;
            ctx.strokeStyle = `rgba(${LINE_COLOR[0]},${LINE_COLOR[1]},${LINE_COLOR[2]},${alpha})`;
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
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
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
