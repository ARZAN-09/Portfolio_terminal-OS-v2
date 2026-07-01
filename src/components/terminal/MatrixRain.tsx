"use client";

import { useEffect, useRef } from "react";
import { useShell } from "@/lib/shell/store";

const CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEF";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setMode = useShell((s) => s.setMode);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = new Array(columns).fill(1);

    const onResize = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(1);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const exit = () => setMode("shell");
    // Delay attaching exit listeners so the key/click that triggered matrix
    // (and any Playwright/IME follow-up events) completes first.
    const attachTimer = setTimeout(() => {
      window.addEventListener("keydown", exit);
      window.addEventListener("click", exit);
    }, 120);

    return () => {
      clearTimeout(attachTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", exit);
      window.removeEventListener("click", exit);
    };
  }, [setMode]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 text-center pointer-events-none">
        <div className="text-term-accent text-glow text-2xl font-bold mb-2">Wake up, Neo…</div>
        <div className="text-term-muted text-sm">press any key or click to exit the Matrix</div>
      </div>
    </div>
  );
}
