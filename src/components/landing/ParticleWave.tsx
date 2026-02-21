import { useRef, useEffect, useCallback } from "react";

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const time = useRef(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    time.current += 0.003;
    const t = time.current;
    const cy = h / 2;

    // --- Dot field (background halftone dots) ---
    const dotSpacing = 18;
    const dotRows = Math.ceil(h / dotSpacing);
    const dotCols = Math.ceil(w / dotSpacing);
    for (let r = 0; r < dotRows; r++) {
      for (let c = 0; c < dotCols; c++) {
        const x = c * dotSpacing + (r % 2 === 0 ? 0 : dotSpacing / 2);
        const y = r * dotSpacing;
        // Fade dots based on distance from center wave
        const distFromCenter = Math.abs(y - cy);
        const maxDist = h * 0.38;
        if (distFromCenter > maxDist) continue;
        const fade = 1 - distFromCenter / maxDist;
        const waveInfluence =
          Math.sin(x * 0.012 + t * 1.5) * 20 +
          Math.sin(x * 0.008 + t * 0.8) * 15;
        const adjustedDist = Math.abs(y - cy - waveInfluence);
        const fade2 = Math.max(0, 1 - adjustedDist / maxDist);
        const alpha = fade * fade2 * 0.35;
        if (alpha < 0.02) continue;
        const radius = 1.2 + fade2 * 1.0;
        // Color gradient from blue-purple (left) to teal (right)
        const ratio = x / w;
        const red = Math.round(120 + ratio * (-50));
        const green = Math.round(140 + ratio * 60);
        const blue = Math.round(200 + ratio * (-40));
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        ctx.fill();
      }
    }

    // --- Smooth flowing wave lines ---
    const waveConfigs = [
      { amp: 45, freq: 0.0065, speed: 0.7, color: [100, 130, 190], width: 1.8, phaseOff: 0 },
      { amp: 38, freq: 0.0075, speed: 0.9, color: [110, 160, 200], width: 1.5, phaseOff: 1.2 },
      { amp: 50, freq: 0.006, speed: 0.5, color: [80, 120, 180], width: 2.0, phaseOff: 2.5 },
      { amp: 35, freq: 0.008, speed: 1.1, color: [90, 170, 190], width: 1.3, phaseOff: 3.8 },
      { amp: 42, freq: 0.007, speed: 0.6, color: [70, 150, 170], width: 1.6, phaseOff: 5.0 },
      { amp: 30, freq: 0.009, speed: 1.3, color: [130, 180, 200], width: 1.1, phaseOff: 0.8 },
    ];

    // Draw each wave as a set of closely spaced lines for ribbon effect
    for (const wave of waveConfigs) {
      for (let offset = -3; offset <= 3; offset++) {
        ctx.beginPath();
        const ribbonAlpha = 0.15 - Math.abs(offset) * 0.025;
        if (ribbonAlpha <= 0) continue;
        for (let x = 0; x <= w; x += 2) {
          const baseWave = Math.sin(x * wave.freq + t * wave.speed + wave.phaseOff) * wave.amp;
          const harmonic = Math.sin(x * wave.freq * 2.3 + t * wave.speed * 0.7 + wave.phaseOff + 1.5) * wave.amp * 0.3;
          const y = cy + baseWave + harmonic + offset * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        // Gradient color shift across x
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        const [r, g, b] = wave.color;
        grad.addColorStop(0, `rgba(${r - 20}, ${g - 20}, ${b + 20}, ${ribbonAlpha})`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${ribbonAlpha * 1.2})`);
        grad.addColorStop(1, `rgba(${r + 30}, ${g + 30}, ${b - 30}, ${ribbonAlpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = wave.width * (1 - Math.abs(offset) * 0.15);
        ctx.stroke();
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      draw(ctx, w, h);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};

export default ParticleWave;
