import { useRef, useEffect } from "react";

const NAVY = "#41506C";
const AMBER = "#F1A900";
const MOUSE_RADIUS = 150;
const MOUSE_PUSH = 60;
const RESTORE_SPEED = 0.04;
const CONNECTION_DIST = 90;

interface WaveParticle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  displaceX: number;
  displaceY: number;
  size: number;
  isAmber: boolean;
  phase: number;
  waveIndex: number;
}

interface WaveDef {
  amplitude: number;
  frequency: number;
  speed: number;
  yOffset: number; // fraction of height (0.35, 0.5, 0.65)
  dotCount: number;
  color: string;
  lineOpacity: number;
}

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<WaveParticle[]>([]);
  const dimRef = useRef({ w: 0, h: 0 });
  const wavesRef = useRef<WaveDef[]>([]);
  const timeRef = useRef(0);

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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimRef.current = { w: rect.width, h: rect.height };
      initParticles(rect.width, rect.height);
    };

    const initParticles = (w: number, h: number) => {
      const isMobile = w < 640;
      const baseDots = isMobile ? 40 : 80;

      const waves: WaveDef[] = [
        {
          amplitude: h * 0.08,
          frequency: 0.008,
          speed: 0.6,
          yOffset: 0.3,
          dotCount: baseDots,
          color: NAVY,
          lineOpacity: 0.1,
        },
        {
          amplitude: h * 0.12,
          frequency: 0.005,
          speed: 0.4,
          yOffset: 0.5,
          dotCount: Math.round(baseDots * 1.3),
          color: NAVY,
          lineOpacity: 0.12,
        },
        {
          amplitude: h * 0.06,
          frequency: 0.012,
          speed: 0.8,
          yOffset: 0.7,
          dotCount: baseDots,
          color: NAVY,
          lineOpacity: 0.08,
        },
      ];
      wavesRef.current = waves;

      const particles: WaveParticle[] = [];
      for (let wi = 0; wi < waves.length; wi++) {
        const wave = waves[wi];
        for (let i = 0; i < wave.dotCount; i++) {
          const xProgress = i / (wave.dotCount - 1);
          const jitterX = (Math.random() - 0.5) * 15;
          const jitterY = (Math.random() - 0.5) * 10;
          const baseX = xProgress * w + jitterX;
          const r = Math.random();
          particles.push({
            baseX,
            baseY: 0, // computed each frame
            x: baseX,
            y: 0,
            displaceX: 0,
            displaceY: 0,
            size: r > 0.8 ? 1.8 + Math.random() * 1.5 : 0.8 + Math.random() * 1,
            isAmber: r > 0.78,
            phase: jitterY,
            waveIndex: wi,
          });
        }
      }
      particlesRef.current = particles;
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    // Touch support
    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };
    const onTouchEnd = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    const draw = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const { w, h } = dimRef.current;
      const waves = wavesRef.current;
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // Update particle base positions along their wave
      for (const p of particles) {
        const wave = waves[p.waveIndex];
        const centerY = h * wave.yOffset;
        // Layered sine for organic feel
        const waveY =
          Math.sin(p.baseX * wave.frequency + t * wave.speed) * wave.amplitude +
          Math.sin(p.baseX * wave.frequency * 2.3 + t * wave.speed * 0.7 + 1.5) * wave.amplitude * 0.3 +
          Math.sin(p.baseX * wave.frequency * 0.5 + t * wave.speed * 1.3 + 3.0) * wave.amplitude * 0.15;

        p.baseY = centerY + waveY + p.phase;

        // Mouse disruption — push away
        const dx = mx - (p.baseX + p.displaceX);
        const dy = my - (p.baseY + p.displaceY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS);
          p.displaceX -= (dx / dist) * force * MOUSE_PUSH * 0.05;
          p.displaceY -= (dy / dist) * force * MOUSE_PUSH * 0.05;
        }

        // Restore toward 0
        p.displaceX *= (1 - RESTORE_SPEED);
        p.displaceY *= (1 - RESTORE_SPEED);

        p.x = p.baseX + p.displaceX;
        p.y = p.baseY + p.displaceY;
      }

      // Draw wave curves (smooth lines)
      for (let wi = 0; wi < waves.length; wi++) {
        const wave = waves[wi];
        const centerY = h * wave.yOffset;
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.lineOpacity;
        ctx.lineWidth = 1;

        for (let x = 0; x <= w; x += 3) {
          const waveY =
            Math.sin(x * wave.frequency + t * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 2.3 + t * wave.speed * 0.7 + 1.5) * wave.amplitude * 0.3 +
            Math.sin(x * wave.frequency * 0.5 + t * wave.speed * 1.3 + 3.0) * wave.amplitude * 0.15;
          const y = centerY + waveY;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw connections between nearby particles (spider web effect)
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        const pa = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const pb = particles[j];
          const dx = pa.x - pb.x;
          const dy = pa.y - pb.y;
          const d = dx * dx + dy * dy;
          if (d < CONNECTION_DIST * CONNECTION_DIST) {
            const dist = Math.sqrt(d);
            let alpha = (1 - dist / CONNECTION_DIST) * 0.12;
            // Brighter near mouse
            const mda = Math.sqrt((mx - pa.x) ** 2 + (my - pa.y) ** 2);
            if (mda < MOUSE_RADIUS) alpha *= 2;
            ctx.globalAlpha = Math.min(alpha, 0.2);
            ctx.strokeStyle = NAVY;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        if (p.isAmber) {
          const glow = (Math.sin(t * 3 + p.phase) + 1) * 0.5;
          ctx.fillStyle = AMBER;
          ctx.globalAlpha = 0.5 + glow * 0.4;
          ctx.shadowColor = AMBER;
          ctx.shadowBlur = 4 + glow * 6;
        } else {
          ctx.fillStyle = NAVY;
          ctx.globalAlpha = 0.4;
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
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
