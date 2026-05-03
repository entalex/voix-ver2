import { useRef, useEffect } from "react";

// Color palette inspired by the reference: deep navy bg, glowing cyan core,
// magenta accents on the chaotic left, bright cyan calm right.
const BG_TOP = "#070b1a";
const BG_BOTTOM = "#0d1530";

interface Particle {
  x: number;
  y: number;
  r: number;
  hue: number; // 0..1 -> magenta..cyan blend
  alpha: number;
  twinkle: number;
}

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const time = useRef(0);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let mobile = false;

    const buildParticles = () => {
      mobile = w < 600;
      const count = mobile ? 140 : 240;
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random(),
          y: Math.random(),
          r: Math.random() * (mobile ? 1.4 : 1.8) + 0.3,
          hue: Math.random(),
          alpha: 0.2 + Math.random() * 0.8,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
      particles.current = arr;
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
      buildParticles();
    };

    resize();
    window.addEventListener("resize", resize);

    // Color helpers — magenta at left to cyan at right
    const hueColor = (hue: number, alpha: number) => {
      // hue 0 -> magenta (#c84cff), hue 1 -> cyan (#5ef0ff)
      const r = Math.round(200 - hue * 120);
      const g = Math.round(80 + hue * 160);
      const b = Math.round(255);
      return `rgba(${r},${g},${b},${alpha})`;
    };

    const draw = () => {
      time.current += 0.006;
      const t = time.current;
      // Horizontal drift speed — makes the whole pattern slide left→right
      const drift = t * 0.05;

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, BG_TOP);
      bg.addColorStop(1, BG_BOTTOM);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const centerY = h * 0.5;

      // Soft horizontal glow band along the wave's calm middle
      const glow = ctx.createRadialGradient(w * 0.5, centerY, 0, w * 0.5, centerY, w * 0.55);
      glow.addColorStop(0, "rgba(120, 200, 255, 0.18)");
      glow.addColorStop(0.4, "rgba(80, 140, 255, 0.06)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Wave function — chaotic left, calm middle, growing crest right
      const waveY = (xNorm: number, layer: number) => {
        // Envelope: chaotic amplitude on far left and right, low in middle
        const leftChaos = Math.exp(-Math.pow((xNorm - 0.08) / 0.22, 2));
        const rightCrest = Math.exp(-Math.pow((xNorm - 0.85) / 0.18, 2));
        const calmCore = 0.18 * (1 - leftChaos - rightCrest * 0.6);

        // Same shape as before — phases shift only via `drift`, so the whole
        // pattern slides horizontally left→right without changing its look.
        const xs = xNorm - drift;

        const main =
          Math.sin(xs * Math.PI * 2.2 + layer * 0.04) *
          (calmCore + rightCrest * 0.55);

        const chaos =
          (Math.sin(xs * 60 + layer * 0.6) * 0.5 +
            Math.sin(xs * 95 + layer * 0.9) * 0.35 +
            Math.sin(xs * 140 + layer * 0.3) * 0.25) *
          leftChaos *
          0.55;

        const ripple =
          Math.sin(xs * 35 + layer * 0.5) * rightCrest * 0.18;

        return centerY + (main + chaos + ripple) * h;
      };

      // Draw stacked thin lines forming a ribbon (the "many parallel curves" look)
      const layers = mobile ? 28 : 44;
      const stepX = mobile ? 4 : 2.5;
      ctx.lineWidth = mobile ? 0.6 : 0.55;

      for (let l = 0; l < layers; l++) {
        const layerOffset = (l - layers / 2) * (mobile ? 0.9 : 1.0);
        // Color across the canvas: shift cyan->magenta by layer slightly for depth
        ctx.beginPath();
        for (let x = 0; x <= w; x += stepX) {
          const xn = x / w;
          const y = waveY(xn, l) + layerOffset * (0.4 + Math.exp(-Math.pow((xn - 0.85) / 0.18, 2)) * 1.6 + Math.exp(-Math.pow((xn - 0.08) / 0.22, 2)) * 1.2);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        // Color: hue based on x average (left magenta, right cyan). Use gradient stroke.
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        const layerAlpha = 0.10 + (1 - Math.abs(l - layers / 2) / (layers / 2)) * 0.35;
        grad.addColorStop(0.0, `rgba(200, 90, 255, ${layerAlpha * 0.9})`);
        grad.addColorStop(0.25, `rgba(140, 120, 255, ${layerAlpha * 0.7})`);
        grad.addColorStop(0.5, `rgba(120, 200, 255, ${layerAlpha * 0.85})`);
        grad.addColorStop(1.0, `rgba(110, 230, 255, ${layerAlpha})`);
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      // Bright center highlight line
      ctx.beginPath();
      for (let x = 0; x <= w; x += stepX) {
        const xn = x / w;
        const y = waveY(xn, layers / 2);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(220, 245, 255, 0.85)";
      ctx.lineWidth = 1.1;
      ctx.shadowColor = "rgba(140, 220, 255, 0.9)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Particles — drifting glowing dots, denser near the wave
      for (const p of particles.current) {
        // Slow drift
        p.x += 0.0008;
        if (p.x > 1.05) p.x = -0.05;
        const px = p.x * w;

        // Pull y toward wave area with vertical spread
        const baseY = waveY(p.x, 0);
        const spread = h * 0.45;
        const py = baseY + (p.y - 0.5) * spread;

        const tw = 0.5 + 0.5 * Math.sin(t * 2 + p.twinkle);
        const a = p.alpha * (0.4 + tw * 0.6);
        // Hue: left side gets magenta bias
        const localHue = Math.min(1, Math.max(0, p.x * 0.9 + p.hue * 0.2));
        ctx.fillStyle = hueColor(localHue, a);
        ctx.shadowColor = hueColor(localHue, a * 0.9);
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

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
