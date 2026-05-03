import { useEffect, useRef } from "react";

const NoiseToInsight = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
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

    // Pre-generate particles
    type P = { x: number; y: number; r: number; seed: number; side: "L" | "R" };
    const particles: P[] = [];
    for (let i = 0; i < 220; i++) {
      particles.push({
        x: Math.random() * 0.45,
        y: Math.random(),
        r: Math.random() * 2 + 0.4,
        seed: Math.random() * 1000,
        side: "L",
      });
    }
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: 0.55 + Math.random() * 0.45,
        y: Math.random(),
        r: Math.random() * 2 + 0.4,
        seed: Math.random() * 1000,
        side: "R",
      });
    }

    let t = 0;

    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);

      const cy = h * 0.5;

      // ============ LEFT: chaotic purple noise waves ============
      const leftLayers = 26;
      for (let l = 0; l < leftLayers; l++) {
        const off = (l - leftLayers / 2) / leftLayers;
        ctx.beginPath();
        for (let x = 0; x <= w * 0.5; x += 2) {
          const xn = x / w;
          // Envelope: peaks around xn=0.05..0.25, fades toward 0.5
          const env = Math.exp(-Math.pow((xn - 0.13) / 0.11, 2));
          const tail = Math.exp(-Math.pow((xn - 0.32) / 0.08, 2)) * 0.5;
          const amp = (env + tail) * h * 0.32;

          const y =
            cy +
            (Math.sin(xn * 60 + t * 2.2 + l * 0.25) * 0.6 +
              Math.sin(xn * 110 - t * 1.7 + l * 0.18) * 0.45 +
              Math.sin(xn * 180 + t * 2.9 + l * 0.32) * 0.3) *
              amp +
            off * 8;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const alpha = 0.08 + (1 - Math.abs(off) * 2) * 0.18;
        const grad = ctx.createLinearGradient(0, 0, w * 0.5, 0);
        grad.addColorStop(0, `rgba(88, 28, 135, ${alpha})`); // deep purple
        grad.addColorStop(0.5, `rgba(124, 58, 237, ${alpha * 0.9})`);
        grad.addColorStop(1, `rgba(59, 130, 246, ${alpha * 0.4})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      // ============ RIGHT: smooth blue insight waves ============
      const rightLayers = 28;
      for (let l = 0; l < rightLayers; l++) {
        const off = (l - rightLayers / 2) / rightLayers;
        ctx.beginPath();
        for (let x = w * 0.5; x <= w; x += 2) {
          const xn = x / w;
          const env = Math.exp(-Math.pow((xn - 0.78) / 0.18, 2));
          const amp = env * h * 0.28;

          const y =
            cy +
            Math.sin(xn * 14 + t * 1.4 + l * 0.05) * amp +
            Math.sin(xn * 22 - t * 1.0 + l * 0.04) * amp * 0.3 +
            off * 14;

          if (x === w * 0.5) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const alpha = 0.08 + (1 - Math.abs(off) * 2) * 0.22;
        const grad = ctx.createLinearGradient(w * 0.5, 0, w, 0);
        grad.addColorStop(0, `rgba(96, 165, 250, ${alpha * 0.5})`);
        grad.addColorStop(0.5, `rgba(56, 189, 248, ${alpha})`);
        grad.addColorStop(1, `rgba(34, 211, 238, ${alpha * 0.95})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ============ Node dots on right wave ============
      const nodeCount = 6;
      for (let i = 0; i < nodeCount; i++) {
        const xn = 0.6 + (i / (nodeCount - 1)) * 0.36;
        const x = xn * w;
        const env = Math.exp(-Math.pow((xn - 0.78) / 0.18, 2));
        const amp = env * h * 0.28;
        const y = cy + Math.sin(xn * 14 + t * 1.4) * amp;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.95)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
        ctx.fill();
      }

      // ============ Particles (drift right slowly, fade across midline) ============
      for (const p of particles) {
        // animate
        const drift = (t * 0.015 + p.seed * 0.001) % 1;
        const xn =
          p.side === "L"
            ? (p.x + drift * 0.15) % 0.5
            : p.x + Math.sin(t * 0.5 + p.seed) * 0.005;
        const yn = p.y + Math.sin(t * 1.1 + p.seed) * 0.01;
        const x = xn * w;
        const y = yn * h;

        let color: string;
        let alpha: number;
        if (xn < 0.45) {
          // purple particles, fade as they approach center
          alpha = 0.5 * (1 - xn / 0.5);
          color = `rgba(124, 58, 237, ${alpha})`;
        } else {
          alpha = 0.45;
          color = `rgba(56, 189, 248, ${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      // ============ Center bridge glow ============
      const bridge = ctx.createLinearGradient(w * 0.42, 0, w * 0.6, 0);
      bridge.addColorStop(0, "rgba(124, 58, 237, 0)");
      bridge.addColorStop(0.5, "rgba(96, 165, 250, 0.15)");
      bridge.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = bridge;
      ctx.fillRect(w * 0.42, cy - 30, w * 0.18, 60);

      rafRef.current = requestAnimationFrame(draw);
    };

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

export default NoiseToInsight;