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

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.4; // slow pixel drift
      const shift = timeRef.current;
      const cy = h * 0.5;

      // --- 1. Static dot grid background ---
      const spacing = 14;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const maxDistY = h * 0.42;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          const distY = Math.abs(y - cy);
          if (distY > maxDistY) continue;
          const fade = 1 - (distY / maxDistY);
          const alpha = fade * fade * 0.28;
          if (alpha < 0.015) continue;

          // blue-purple on left → teal on right
          const ratio = x / w;
          const cr = Math.round(140 - ratio * 40);   // 140→100
          const cg = Math.round(160 + ratio * 50);   // 160→210
          const cb = Math.round(210 - ratio * 30);   // 210→180

          ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- 2. Three ribbon waves ---
      const waves = [
        { lines: 28, amp: 40, freq: 0.0045, speed: 0.0008, yOff: -8,  colorStart: [110, 130, 200], colorEnd: [80, 180, 190], baseAlpha: 0.12 },
        { lines: 24, amp: 48, freq: 0.005,  speed: 0.0006, yOff: 5,   colorStart: [90, 150, 210],  colorEnd: [60, 190, 180], baseAlpha: 0.10 },
        { lines: 20, amp: 35, freq: 0.0055, speed: 0.001,  yOff: 0,   colorStart: [130, 150, 200], colorEnd: [100, 200, 195], baseAlpha: 0.11 },
      ];

      for (const wave of waves) {
        for (let l = 0; l < wave.lines; l++) {
          const ribbonPos = (l / (wave.lines - 1)) - 0.5; // -0.5 to 0.5
          const lineAlpha = wave.baseAlpha * (1 - Math.abs(ribbonPos) * 1.4);
          if (lineAlpha <= 0) continue;

          ctx.beginPath();
          const step = 4;
          for (let x = 0; x <= w; x += step) {
            const phase = shift * wave.speed;
            const mainWave = Math.sin(x * wave.freq + phase + l * 0.04) * wave.amp;
            const harmonic = Math.sin(x * wave.freq * 1.8 + phase * 1.3 + 2.0 + l * 0.02) * wave.amp * 0.25;
            const y = cy + wave.yOff + mainWave + harmonic + ribbonPos * 12;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          const grad = ctx.createLinearGradient(0, 0, w, 0);
          const [r1, g1, b1] = wave.colorStart;
          const [r2, g2, b2] = wave.colorEnd;
          grad.addColorStop(0, `rgba(${r1},${g1},${b1},${lineAlpha})`);
          grad.addColorStop(1, `rgba(${r2},${g2},${b2},${lineAlpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
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
