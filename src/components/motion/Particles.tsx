"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; r: number; vy: number; sway: number; phase: number; a: number };

/**
 * A handful of slow rising bubbles on a single 2D canvas. Pauses when off-screen or when the tab is hidden,
 * caps device-pixel-ratio, and does not run at all for reduced motion.
 */
export default function Particles({ count = 26, mobileCount = 12 }: { count?: number; mobileCount?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const n = window.innerWidth < 768 ? mobileCount : count;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = false;
    let particles: Particle[] = [];

    const spawn = (initial: boolean): Particle => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 12,
      r: 0.7 + Math.random() * 1.9,
      vy: 0.12 + Math.random() * 0.34,
      sway: 6 + Math.random() * 14,
      phase: Math.random() * Math.PI * 2,
      a: 0.12 + Math.random() * 0.26,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: n }, () => spawn(true));
    };

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y -= p.vy;
        if (p.y < -12) Object.assign(p, spawn(false));
        const x = p.x + Math.sin(t / 1800 + p.phase) * p.sway;
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190,242,250,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    const onVis = () => (document.hidden ? stop() : start());
    const ro = new ResizeObserver(resize);

    io.observe(canvas);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVis);
    resize();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [count, mobileCount]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
