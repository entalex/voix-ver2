import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  isAmber: boolean;
  phase1: number;
  phase2: number;
  phase3: number;
}

const PRIMARY = "#41506C";
const AMBER = "#F1A900";
const PARTICLE_COUNT = 180;
const CONNECTION_DIST = 110;
const MOUSE_RADIUS = 160;
const MOUSE_FORCE = 8;

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);
  const time = useRef(0);

  const initParticles = useCallback((w: number, h: number) => {
    const pts: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * w;
      const baseY = h * 0.25 + Math.random() * h * 0.5;
      pts.push({
        x,
        y: baseY,
        baseY,
        vx: 0,
        vy: 0,
        radius: 1.2 + Math.random() * 2,
        isAmber: Math.random() < 0.12,
        phase1: Math.random() * Math.PI * 2,
        phase2: Math.random() * Math.PI * 2,
        phase3: Math.random() * Math.PI * 2,
      });
    }
    particles.current = pts;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);
      time.current += 0.006;
      const t = time.current;
      const pts = particles.current;

      // Update positions — ocean-like wave motion
      for (const p of pts) {
        const wave1 = Math.sin(p.x * 0.006 + t * 1.0 + p.phase1) * 35;
        const wave2 = Math.sin(p.x * 0.01 + t * 0.6 + p.phase2) * 22;
        const wave3 = Math.cos(p.x * 0.004 + t * 1.4 + p.phase3) * 15;
        const wave4 = Math.sin(p.x * 0.015 + t * 2.0 + p.phase1 * 0.5) * 8;
        const targetY = p.baseY + wave1 + wave2 + wave3 + wave4;

        // Horizontal drift for flowing feel
        const driftX = Math.sin(t * 0.3 + p.phase2) * 0.15;

        // Mouse repulsion — stronger scatter
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) ** 1.5 * MOUSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Slow, gentle return to harmony
        p.vy += (targetY - p.y) * 0.02;
        p.vx += driftX;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap horizontally
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = dx * dx + dy * dy;
          if (d < CONNECTION_DIST * CONNECTION_DIST) {
            const alpha = 1 - Math.sqrt(d) / CONNECTION_DIST;
            ctx.strokeStyle = `rgba(65, 80, 108, ${alpha * 0.08})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isAmber ? AMBER : PRIMARY;
        ctx.globalAlpha = p.isAmber ? 0.9 : 0.7;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "auto" }}
    />
  );
};

export default ParticleWave;
