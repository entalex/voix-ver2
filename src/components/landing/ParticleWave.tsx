import { useRef, useEffect } from "react";

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

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

    // --- STATIC DOT GRID (drawn once per frame, never changes) ---
    const drawDots = () => {
      const spacingX = 12;
      const spacingY = 12;
      const cols = Math.ceil(w / spacingX) + 1;
      const rows = Math.ceil(h / spacingY) + 1;
      const dotRadius = 1.2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacingX;
          const y = r * spacingY;
          const ratio = x / w;
          // Left: light blue (170,200,230) → Right: soft teal (130,200,190)
          const dr = Math.round(170 - ratio * 40);
          const dg = Math.round(200 + ratio * 0);
          const db = Math.round(230 - ratio * 40);
          ctx.fillStyle = `rgba(${dr},${dg},${db},0.15)`;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // --- THREE WAVE RIBBONS ---
    // Each wave: different frequency, amplitude, phase, vertical offset
    // They MUST cross each other visibly
    const waveConfigs = [
      {
        freq: 0.008,
        amp: 55,
        yOffset: -15,
        phaseOffset: 0,
        speed: 1,
        linesCount: 30,
        lineSpread: 14, // total ribbon width in px
        colorStart: [100, 110, 180], // blue-purple
        colorEnd: [120, 140, 200],
        alpha: 0.08,
      },
      {
        freq: 0.006,
        amp: 45,
        yOffset: 10,
        phaseOffset: 2.0,
        speed: 0.75,
        linesCount: 26,
        lineSpread: 12,
        colorStart: [80, 150, 190], // blue-teal
        colorEnd: [90, 170, 200],
        alpha: 0.07,
      },
      {
        freq: 0.01,
        amp: 38,
        yOffset: 5,
        phaseOffset: 4.2,
        speed: 1.3,
        linesCount: 22,
        lineSpread: 10,
        colorStart: [60, 170, 170], // teal
        colorEnd: [80, 190, 185],
        alpha: 0.065,
      },
    ];

    const getWaveY = (
      x: number,
      freq: number,
      amp: number,
      phase: number,
      yOff: number,
      cy: number,
    ) => {
      // Main sine + harmonic for organic shape
      return (
        cy +
        yOff +
        Math.sin(x * freq + phase) * amp +
        Math.sin(x * freq * 2.1 + phase * 1.4 + 1.0) * amp * 0.2 +
        Math.sin(x * freq * 0.5 + phase * 0.6 + 3.0) * amp * 0.15
      );
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.008; // very slow phase shift
      const t = timeRef.current;
      const cy = h * 0.5;

      // 1. Draw dot grid
      drawDots();

      // 2. Draw 3 wave ribbons
      for (const wave of waveConfigs) {
        const phase = t * wave.speed + wave.phaseOffset;
        const halfSpread = wave.lineSpread / 2;

        for (let l = 0; l < wave.linesCount; l++) {
          const ribbonT = l / (wave.linesCount - 1); // 0..1
          const offset = (ribbonT - 0.5) * wave.lineSpread; // -halfSpread..halfSpread

          // Alpha: strongest at center of ribbon, fades at edges
          const edgeDist = Math.abs(offset) / halfSpread; // 0..1
          const lineAlpha = wave.alpha * (1 - edgeDist * edgeDist);
          if (lineAlpha < 0.005) continue;

          ctx.beginPath();
          for (let x = 0; x <= w; x += 3) {
            const y =
              getWaveY(x, wave.freq, wave.amp, phase, wave.yOffset, cy) + offset;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          const [r1, g1, b1] = wave.colorStart;
          const [r2, g2, b2] = wave.colorEnd;
          const grad = ctx.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0, `rgba(${r1},${g1},${b1},${lineAlpha})`);
          grad.addColorStop(1, `rgba(${r2},${g2},${b2},${lineAlpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default ParticleWave;
