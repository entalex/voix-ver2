import { useEffect, useRef } from "react";

/**
 * Particle voice-wave animation inspired by Lalit / theosm "Magic Audio AI"
 * Dribbble shot. Thousands of small magenta/violet particles flowing in
 * curl-noise-like wave fields on a deep black background.
 */
const ProceduralVoiceWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      hue: number; // 0..1 → magenta..violet
    };

    let particles: P[] = [];
    let target = 0;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = rect.width;
      h = rect.height;
      target = Math.floor((w * h) / 900); // density
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    // Curl-noise-ish flow field via summed sines
    const flow = (x: number, y: number, time: number) => {
      const nx = x * 0.0042;
      const ny = y * 0.0075;
      const a =
        Math.sin(nx * 1.7 + time * 0.6) +
        Math.cos(ny * 2.1 - time * 0.45) * 0.8 +
        Math.sin((nx + ny) * 1.3 + time * 0.3) * 0.5;
      const b =
        Math.cos(nx * 2.3 - time * 0.5) +
        Math.sin(ny * 1.6 + time * 0.7) * 0.8 +
        Math.cos((nx - ny) * 1.4 + time * 0.4) * 0.5;
      const angle = a * Math.PI + b * 0.6;
      return angle;
    };

    const spawn = (): P => {
      // Bias spawn toward the central horizontal band
      const cy = h * 0.5;
      const spread = h * 0.32;
      const y = cy + (Math.random() - 0.5) * 2 * spread * Math.pow(Math.random(), 0.6);
      const x = Math.random() * w;
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 120 + Math.random() * 220,
        size: Math.random() < 0.85 ? 0.7 + Math.random() * 0.9 : 1.6 + Math.random() * 1.2,
        hue: Math.random(),
      };
    };

    const draw = () => {
      t += 0.006;

      // Trailing fade for soft motion blur
      ctx.fillStyle = "rgba(5, 2, 12, 0.22)";
      ctx.fillRect(0, 0, w, h);

      // Spawn up to target
      while (particles.length < target) particles.push(spawn());

      ctx.globalCompositeOperation = "lighter";

      const cy = h * 0.5;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const angle = flow(p.x, p.y - cy, t);
        const speed = 1.05 + Math.sin(t * 0.4 + p.hue * 6.28) * 0.25;
        p.vx = p.vx * 0.92 + Math.cos(angle) * speed * 0.55;
        p.vy = p.vy * 0.92 + Math.sin(angle) * speed * 0.4;

        // Gentle vertical pull toward the band center
        p.vy += ((cy - p.y) / h) * 0.08;

        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        const fade = Math.sin(lifeRatio * Math.PI); // 0..1..0

        // Color: magenta → violet → pink
        const r = 220 + Math.floor(p.hue * 35);
        const g = 30 + Math.floor((1 - p.hue) * 40);
        const b = 180 + Math.floor(p.hue * 60);
        const alpha = fade * (0.55 + Math.random() * 0.25);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (
          p.life >= p.maxLife ||
          p.x < -20 ||
          p.x > w + 20 ||
          p.y < -40 ||
          p.y > h + 40
        ) {
          particles[i] = spawn();
        }
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(draw);
    };

    // Initial black wash
    ctx.fillStyle = "#05020c";
    ctx.fillRect(0, 0, w, h);

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
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

export default ProceduralVoiceWave;
