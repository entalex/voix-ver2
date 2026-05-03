import { useRef, useEffect } from "react";

const ParticleWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let mobile = false;

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
      mobile = w < 640;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time.current += 0.0065;
      const t = time.current;
      const centerY = h * 0.5;
      const horizonThickness = mobile ? 10 : 14;

      const bg = ctx.createLinearGradient(0, 0, w, 0);
      bg.addColorStop(0, "#f4f1ea");
      bg.addColorStop(0.5, "#f2efeb");
      bg.addColorStop(0.72, "#def4f6");
      bg.addColorStop(0.88, "#c8d6fb");
      bg.addColorStop(1, "#b99be8");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const rightGlow = ctx.createRadialGradient(w * 0.76, h * 0.55, 0, w * 0.76, h * 0.55, w * 0.36);
      rightGlow.addColorStop(0, "rgba(255, 219, 112, 0.55)");
      rightGlow.addColorStop(0.2, "rgba(255, 140, 196, 0.18)");
      rightGlow.addColorStop(0.5, "rgba(83, 177, 255, 0.16)");
      rightGlow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rightGlow;
      ctx.fillRect(0, 0, w, h);

      const panelStroke = "rgba(255,255,255,0.42)";
      ctx.lineWidth = 1;
      ctx.strokeStyle = panelStroke;
      const frameX = w * 0.06;
      const frameY = h * 0.08;
      const frameW = w * 0.88;
      const frameH = h * 0.84;
      ctx.beginPath();
      ctx.roundRect(frameX, frameY, frameW, frameH, 28);
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(w * 0.63, h * 0.13, w * 0.26, h * 0.72, 24);
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(w * 0.73, h * 0.18, w * 0.12, h * 0.62, 20);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.moveTo(w * 0.5, 0);
      ctx.lineTo(w * 0.5, h);
      ctx.stroke();

      const scroll = t * 0.028;
      const smoothEnvelope = (xNorm: number, center: number, width: number, strength: number) =>
        Math.exp(-Math.pow((xNorm - center) / width, 2)) * strength;

      const baseWave = (xNorm: number, layer: number) => {
        const xs = xNorm - scroll;
        const leftMass = smoothEnvelope(xNorm, 0.18, 0.1, 0.9);
        const leftMid = smoothEnvelope(xNorm, 0.34, 0.08, 0.55);
        const leftTail = smoothEnvelope(xNorm, 0.45, 0.06, 0.28);
        const rightOne = smoothEnvelope(xNorm, 0.58, 0.05, 0.46);
        const rightTwo = smoothEnvelope(xNorm, 0.72, 0.08, 0.34);
        const rightThree = smoothEnvelope(xNorm, 0.83, 0.12, 0.62);

        const leftSignal =
          (Math.sin(xs * 38 + layer * 0.045 + t * 0.55) * leftMass +
            Math.sin(xs * 64 - layer * 0.035 + t * 0.42) * leftMid +
            Math.sin(xs * 92 + layer * 0.025 + t * 0.35) * leftTail) *
          0.92;

        const leftChaos =
          (Math.sin(xs * 180 + layer * 0.18 + t * 1.15) +
            Math.sin(xs * 235 - layer * 0.08 - t * 0.9) * 0.75 +
            Math.sin(xs * 310 + layer * 0.1 + t * 1.45) * 0.5) *
          smoothEnvelope(xNorm, 0.16, 0.09, 0.09);

        const rightSignal =
          Math.sin(xs * 26 + t * 0.52 + layer * 0.03) * rightOne +
          Math.sin(xs * 20 - t * 0.38 + layer * 0.035) * rightTwo +
          Math.sin(xs * 14 + t * 0.3 + layer * 0.022) * rightThree;

        return leftSignal + leftChaos + rightSignal;
      };

      const layerSpread = (xNorm: number) => {
        const left = smoothEnvelope(xNorm, 0.18, 0.11, 1.55) + smoothEnvelope(xNorm, 0.36, 0.08, 0.9);
        const right = smoothEnvelope(xNorm, 0.59, 0.05, 1.15) + smoothEnvelope(xNorm, 0.73, 0.08, 1.1) + smoothEnvelope(xNorm, 0.84, 0.13, 1.75);
        return left + right + 0.05;
      };

      const drawRibbon = (mirror: 1 | -1) => {
        const layers = mobile ? 22 : 34;
        const stepX = mobile ? 3.2 : 2.25;

        for (let l = 0; l < layers; l++) {
          const offsetRatio = (l - (layers - 1) / 2) / ((layers - 1) / 2);
          ctx.beginPath();

          for (let x = 0; x <= w; x += stepX) {
            const xn = x / w;
            const y =
              centerY +
              mirror *
                (baseWave(xn, l) * h * 0.22 + offsetRatio * layerSpread(xn) * (mobile ? 18 : 24));

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          const grad = ctx.createLinearGradient(0, 0, w, 0);
          const alpha = 0.16 + (1 - Math.abs(offsetRatio)) * 0.3;
          grad.addColorStop(0, `rgba(80, 101, 103, ${alpha * 0.9})`);
          grad.addColorStop(0.17, `rgba(66, 76, 79, ${alpha * 0.78})`);
          grad.addColorStop(0.48, `rgba(110, 112, 116, ${alpha * 0.34})`);
          grad.addColorStop(0.57, `rgba(219, 91, 205, ${alpha * 0.9})`);
          grad.addColorStop(0.7, `rgba(78, 120, 247, ${alpha})`);
          grad.addColorStop(0.86, `rgba(84, 228, 245, ${alpha * 0.95})`);
          grad.addColorStop(1, `rgba(213, 131, 231, ${alpha * 0.86})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = mirror === 1 ? 1.1 : 0.95;
          ctx.stroke();
        }
      };

      drawRibbon(1);
      ctx.globalAlpha = 0.72;
      drawRibbon(-1);
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.strokeStyle = "rgba(10, 16, 20, 0.68)";
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      for (let x = 0; x <= w * 0.48; x += 1.4) {
        const xn = x / w;
        const y = centerY + baseWave(xn, 0) * h * 0.18;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.46)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(w * 0.79, h * 0.23);
      ctx.bezierCurveTo(w * 0.91, h * 0.3, w * 0.97, h * 0.1, w * 1.04, h * 0.2);
      ctx.moveTo(w * 0.84, h * 0.57);
      ctx.bezierCurveTo(w * 0.94, h * 0.5, w * 1.02, h * 0.4, w * 1.08, h * 0.46);
      ctx.moveTo(w * 0.87, h * 0.78);
      ctx.bezierCurveTo(w * 0.95, h * 0.9, w * 1.02, h * 0.82, w * 1.08, h * 0.92);
      ctx.stroke();
      ctx.restore();

      const horizon = ctx.createLinearGradient(0, centerY - horizonThickness, w, centerY + horizonThickness);
      horizon.addColorStop(0, "rgba(37, 42, 44, 0.86)");
      horizon.addColorStop(0.22, "rgba(137, 190, 203, 0.92)");
      horizon.addColorStop(0.56, "rgba(126, 237, 255, 0.98)");
      horizon.addColorStop(0.8, "rgba(184, 107, 244, 0.92)");
      horizon.addColorStop(1, "rgba(245, 219, 251, 0.8)");
      ctx.fillStyle = horizon;
      ctx.fillRect(0, centerY - horizonThickness / 2, w, horizonThickness);

      const bloom = ctx.createLinearGradient(0, 0, w, 0);
      bloom.addColorStop(0, "rgba(255,255,255,0)");
      bloom.addColorStop(0.52, "rgba(192, 244, 255, 0.75)");
      bloom.addColorStop(0.7, "rgba(136, 220, 255, 0.95)");
      bloom.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, centerY - 2, w, 4);

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
