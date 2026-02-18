import { useRef, useEffect } from "react";

const NAVY = "#41506C";
const AMBER = "#F1A900";
const PARTICLE_COUNT = 600;
const CONNECTION_DIST = 120;
const MOUSE_RADIUS = 180;
const MOUSE_STRENGTH = 0.04;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  isAmber: boolean;
  phase: number;
}

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const dimRef = useRef({ w: 0, h: 0 });

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
      dimRef.current = { w, h };
    };

    const initParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const r = Math.random();
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0.15 + Math.random() * 0.35,
          vy: 0,
          size: r > 0.75 ? 1.5 + Math.random() * 1.5 : 0.8 + Math.random() * 1,
          isAmber: r > 0.8,
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    resize();
    initParticles();
    window.addEventListener("resize", () => { resize(); initParticles(); });

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    let time = 0;

    const draw = () => {
      time += 0.016;
      const particles = particlesRef.current;
      const { w, h } = dimRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // Update positions
      for (const p of particles) {
        // Sinusoidal vertical drift
        p.vy = Math.sin(time * 0.5 + p.phase) * 0.3;

        // Mouse attraction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
          p.x += dx * force;
          p.y += dy * force;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap horizontally
        if (p.x > w + 10) { p.x = -10; p.y = Math.random() * h; }
        // Soft vertical bounds
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      // Draw connections (spatial grid for perf)
      const cellSize = CONNECTION_DIST;
      const cols = Math.ceil(w / cellSize) + 1;
      const rows = Math.ceil(h / cellSize) + 1;
      const grid: number[][] = new Array(cols * rows);
      for (let i = 0; i < grid.length; i++) grid[i] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
          grid[cy * cols + cx].push(i);
        }
      }

      ctx.strokeStyle = NAVY;
      ctx.lineWidth = 0.5;

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const cell = grid[cy * cols + cx];
          // Check current + neighbor cells
          for (let ncx = cx; ncx <= cx + 1 && ncx < cols; ncx++) {
            for (let ncy = cy - 1; ncy <= cy + 1 && ncy < rows; ncy++) {
              if (ncy < 0) continue;
              const nCell = grid[ncy * cols + ncx];
              const isSame = ncx === cx && ncy === cy;
              for (let a = 0; a < cell.length; a++) {
                const pa = particles[cell[a]];
                const startB = isSame ? a + 1 : 0;
                for (let b = startB; b < nCell.length; b++) {
                  const pb = particles[nCell[b]];
                  const dx = pa.x - pb.x;
                  const dy = pa.y - pb.y;
                  const d = dx * dx + dy * dy;
                  if (d < CONNECTION_DIST * CONNECTION_DIST) {
                    const dist = Math.sqrt(d);
                    let alpha = (1 - dist / CONNECTION_DIST) * 0.15;
                    // Denser near mouse
                    const mda = Math.sqrt((mx - pa.x) ** 2 + (my - pa.y) ** 2);
                    const mdb = Math.sqrt((mx - pb.x) ** 2 + (my - pb.y) ** 2);
                    if (mda < MOUSE_RADIUS || mdb < MOUSE_RADIUS) {
                      alpha *= 2.5;
                    }
                    ctx.globalAlpha = Math.min(alpha, 0.25);
                    ctx.beginPath();
                    ctx.moveTo(pa.x, pa.y);
                    ctx.lineTo(pb.x, pb.y);
                    ctx.stroke();
                  }
                }
              }
            }
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const md = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
        const nearMouse = md < MOUSE_RADIUS;

        if (p.isAmber) {
          ctx.fillStyle = AMBER;
          ctx.globalAlpha = nearMouse ? 0.9 : 0.5 + Math.sin(time * 3 + p.phase) * 0.2;
          ctx.shadowColor = AMBER;
          ctx.shadowBlur = nearMouse ? 8 : 3;
        } else {
          ctx.fillStyle = NAVY;
          ctx.globalAlpha = nearMouse ? 0.6 : 0.35;
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, nearMouse ? p.size * 1.4 : p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "auto" }}
    />
  );
};

export default ParticleWave;
