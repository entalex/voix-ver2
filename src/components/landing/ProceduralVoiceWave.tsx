import { useEffect, useRef } from "react";

/**
 * Procedural voice-wave animation inspired by Milkinside's
 * "Procedural Voice wave" shot. A horizontal flowing ribbon made of
 * many stacked sine layers with shifting color gradient, sitting on
 * a soft glow horizon line.
 */
const ProceduralVoiceWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

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

    let t = 0;

    // Smooth pseudo-noise via summed sines
    const noise = (x: number, time: number, seed: number) =>
      Math.sin(x * 1.8 + time * 0.9 + seed) * 0.55 +
      Math.sin(x * 3.7 - time * 0.6 + seed * 1.3) * 0.3 +
      Math.sin(x * 7.3 + time * 1.4 + seed * 0.7) * 0.15;

    const draw = () => {
      t += 0.012;

      // Background — deep gradient
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#070b18");
      bg.addColorStop(0.5, "#0b1226");
      bg.addColorStop(1, "#120a26");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Soft radial glow centered
      const glow = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.6
      );
      glow.addColorStop(0, "rgba(99, 102, 241, 0.18)");
      glow.addColorStop(0.45, "rgba(56, 189, 248, 0.07)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const cy = h * 0.5;
      const layers = 70;

      // Envelope: fat in middle, tapering at ends
      const envelope = (xn: number) => {
        const e = Math.sin(xn * Math.PI); // 0..1..0
        return Math.pow(e, 1.4);
      };

      ctx.globalCompositeOperation = "lighter";

      for (let l = 0; l < layers; l++) {
        const lt = l / (layers - 1); // 0..1
        const offset = (lt - 0.5) * 2; // -1..1

        ctx.beginPath();
        const step = 2;
        for (let x = 0; x <= w; x += step) {
          const xn = x / w;
          const env = envelope(xn);

          // Per-layer phase shift gives the ribbon thickness
          const n = noise(xn * 4 + offset * 0.4, t + lt * 0.6, lt * 6.2);

          // Vertical displacement: shared base wave + per-layer spread
          const base = Math.sin(xn * 6.2 - t * 1.6 + offset * 0.8) * 0.6;
          const amp = h * 0.34 * env;

          const y = cy + (base + n * 0.7) * amp + offset * env * h * 0.18;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Horizontal color gradient — magenta → violet → cyan
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        const a = 0.05 + (1 - Math.abs(offset)) * 0.18;
        grad.addColorStop(0, `rgba(236, 72, 153, ${a * 0.85})`); // pink
        grad.addColorStop(0.35, `rgba(168, 85, 247, ${a})`); // violet
        grad.addColorStop(0.65, `rgba(99, 102, 241, ${a})`); // indigo
        grad.addColorStop(1, `rgba(34, 211, 238, ${a * 0.95})`); // cyan
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";

      // Bright center horizon line (the "voice" core)
      const horizon = ctx.createLinearGradient(0, 0, w, 0);
      horizon.addColorStop(0, "rgba(236, 72, 153, 0)");
      horizon.addColorStop(0.2, "rgba(236, 72, 153, 0.7)");
      horizon.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
      horizon.addColorStop(0.8, "rgba(34, 211, 238, 0.7)");
      horizon.addColorStop(1, "rgba(34, 211, 238, 0)");

      ctx.beginPath();
      const step2 = 2;
      for (let x = 0; x <= w; x += step2) {
        const xn = x / w;
        const env = envelope(xn);
        const base = Math.sin(xn * 6.2 - t * 1.6) * 0.6;
        const n = noise(xn * 4, t, 0) * 0.4;
        const y = cy + (base + n) * h * 0.18 * env;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = horizon;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = "rgba(165, 180, 252, 0.9)";
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0;

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

export default ProceduralVoiceWave;