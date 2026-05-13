import { useEffect, useRef } from "react";

/**
 * Remix of the Milkinside "Procedural Voice wave" with Deyae
 * Cherkaoui's "Abstract Waveforms" — light backdrop, ribbon-like
 * white & amber strands that start as a chaotic bundle on the left
 * and resolve into parallel lines on the right.
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

    // Strand definitions — ~36 ribbons, mix of white & amber
    const STRAND_COUNT = 38;
    type Strand = {
      base: number;   // -1..1 final y offset (parallel position on right)
      color: "white" | "amber";
      seed: number;
      width: number;
      phase: number;
    };
    const strands: Strand[] = Array.from({ length: STRAND_COUNT }, (_, i) => {
      const t01 = i / (STRAND_COUNT - 1);
      return {
        base: (t01 - 0.5) * 2,
        // alternate, with a few extra amber accents
        color: i % 3 === 1 ? "amber" : "white",
        seed: i * 1.37,
        width: 0.9 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const draw = () => {
      t += 0.012;

      // ===== Background — soft studio gray (Abstract Waveforms vibe) =====
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#eef0f3");
      bg.addColorStop(0.55, "#e3e6ea");
      bg.addColorStop(1, "#d6dade");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle floor shadow under the bundle
      const floor = ctx.createRadialGradient(
        w * 0.55,
        h * 0.78,
        0,
        w * 0.55,
        h * 0.78,
        Math.max(w, h) * 0.55
      );
      floor.addColorStop(0, "rgba(40, 50, 70, 0.12)");
      floor.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = floor;
      ctx.fillRect(0, 0, w, h);

      const cy = h * 0.5;

      // Chaos envelope: 1 = fully chaotic (left), 0 = perfectly parallel (right)
      const chaos = (xn: number) => {
        // Bunched/wavy on the left ~0..0.45, smooth on the right
        const e = 1 - Math.min(1, Math.max(0, (xn - 0.05) / 0.55));
        return Math.pow(e, 1.3);
      };

      // Voice-wave shared modulation — the "remixed" procedural voice
      const voice = (xn: number, time: number, seed: number) => {
        const base = Math.sin(xn * 5.4 - time * 1.4 + seed) * 0.55;
        return base + noise(xn * 3.2 + seed * 0.3, time, seed) * 0.6;
      };

      // Strand spread on the right side (parallel ribbon stack)
      const spreadY = h * 0.32;

      // Draw two passes — shadow underlay then strand — to add depth
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < strands.length; i++) {
          const s = strands[i];
          ctx.beginPath();
          const step = 2;
          for (let x = 0; x <= w; x += step) {
            const xn = x / w;
            const c = chaos(xn);

            // Parallel target line on the right
            const parallelY = cy + s.base * spreadY * 0.9;

            // Chaotic bundle origin on the left — converges near (0.05w, cy)
            const bundleY =
              cy +
              voice(xn * 1.2, t + s.phase, s.seed) * h * 0.28 * c +
              s.base * 6 * c; // tiny separation inside bundle

            // Blend chaos -> parallel
            const y = bundleY * c + parallelY * (1 - c);

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          if (pass === 0) {
            // Soft shadow underlay
            ctx.strokeStyle = "rgba(40, 48, 66, 0.10)";
            ctx.lineWidth = s.width + 2.4;
          } else {
            // Color: white strands or amber accents
            if (s.color === "amber") {
              const grad = ctx.createLinearGradient(0, 0, w, 0);
              grad.addColorStop(0, "rgba(241, 169, 0, 0.95)");
              grad.addColorStop(0.6, "rgba(255, 184, 28, 1)");
              grad.addColorStop(1, "rgba(231, 138, 0, 0.95)");
              ctx.strokeStyle = grad;
            } else {
              ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
            }
            ctx.lineWidth = s.width;
          }
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      // Faint center horizon glow — a quiet nod to the original voice-wave core
      const horizon = ctx.createLinearGradient(0, 0, w, 0);
      horizon.addColorStop(0, "rgba(241, 169, 0, 0)");
      horizon.addColorStop(0.5, "rgba(241, 169, 0, 0.18)");
      horizon.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = horizon;
      ctx.fillRect(0, cy - 0.5, w, 1);

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