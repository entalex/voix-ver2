import { useRef, useEffect } from "react";

const NAVY = "#41506C";
const AMBER = "#F1A900";
const DARK = "#2a3444";
const LINE_COLOR = [120, 130, 145];
const AMBER_RATIO = 0.28;
const WAVE_SPEED = 0.007;

interface Dot {
  x: number;
  y: number;
  radius: number;
  color: string;
  bandOffset: number;
  opacity: number;
  phaseOffset: number;
}

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const time = useRef(0);
  const dots = useRef<Dot[]>([]);
  const isMobile = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const buildDots = () => {
      isMobile.current = w < 600;
      const count = isMobile.current ? 375 : 600;
      const arr: Dot[] = [];
      for (let i = 0; i < count; i++) {
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
          radius: isMobile.current ? 1.8 + Math.random() * 1.5 : 1.5 + Math.random() * 2.2,
          color,
          bandOffset: (Math.random() - 0.5) * 2,
          opacity: 0.55 + Math.random() * 0.45,
          phaseOffset: Math.random() * Math.PI * 2,
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
      const mobile = isMobile.current;
      const connDist = mobile ? 65 : 48;
      const extendW = w + 80;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        // Distribute and scroll right
        const rawX = (i / pts.length) * extendW + t * 80;
        p.x = ((rawX % extendW) + extendW) % extendW - 40;

        const nx = p.x / w;

        // Composite wave with varying frequencies for unique shape (lower freq = wider waves)
        const wave1 = Math.sin(nx * Math.PI * 1.3 + t * 1.2) * 0.55;
        const wave2 = Math.sin(nx * Math.PI * 0.8 + t * 0.9 + 1.0) * 0.35;
        const wave3 = Math.sin(nx * Math.PI * 2.0 + t * 2.0 + 2.5) * 0.15;
        const wave4 = Math.sin(nx * Math.PI * 0.45 + t * 0.5 + p.phaseOffset * 0.3) * 0.2;
        const mainWave = wave1 + wave2 + wave3 + wave4;

        // Edge fade
        const edgeFade = Math.pow(Math.sin(Math.max(0, Math.min(1, nx)) * Math.PI), 0.4);
        const amplitude = h * (mobile ? 0.28 : 0.32) * edgeFade;

        // Band thickness
        const thickness = h * (mobile ? 0.04 : 0.055) + Math.abs(mainWave) * h * 0.03;

        p.y = centerY + mainWave * amplitude + p.bandOffset * thickness;
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          if (dx > connDist || dx < -connDist) continue;
          const dy = pts[i].y - pts[j].y;
          if (dy > connDist || dy < -connDist) continue;
          const d2 = dx * dx + dy * dy;
          if (d2 < connDist * connDist) {
            const dist = Math.sqrt(d2);
            const alpha = (1 - dist / connDist) * (mobile ? 0.016 : 0.16);
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
