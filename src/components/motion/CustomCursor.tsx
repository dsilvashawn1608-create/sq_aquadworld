"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A soft aqua glow that trails the pointer, plus a small dot that grows on links and shows a label
 * (e.g. "View") over anything marked data-cursor="View". The native cursor is never hidden.
 * Fine pointers only; disabled for reduced motion.
 */
export default function CustomCursor() {
  const glow = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const g = glow.current;
    const r = ring.current;
    const l = label.current;
    if (!g || !r || !l) return;

    gsap.set([g, r], { xPercent: -50, yPercent: -50 });
    const gx = gsap.quickTo(g, "x", { duration: 0.9, ease: "power3" });
    const gy = gsap.quickTo(g, "y", { duration: 0.9, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.35, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.35, ease: "power3" });

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      gsap.to([g, r], { opacity: 1, duration: 0.5 });
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      show();
      gx(e.clientX);
      gy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const labelled = t?.closest?.("[data-cursor]");
      const interactive = t?.closest?.("a, button, summary, input, select, textarea, label");
      if (labelled) {
        l.textContent = labelled.getAttribute("data-cursor") ?? "";
        r.dataset.state = "label";
      } else if (interactive) {
        l.textContent = "";
        r.dataset.state = "link";
      } else {
        l.textContent = "";
        r.dataset.state = "idle";
      }
    };
    const leave = () => {
      shown = false;
      gsap.to([g, r], { opacity: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div
        ref={glow}
        className="fixed left-0 top-0 z-[89] h-[440px] w-[440px] rounded-full opacity-0"
        style={{ background: "radial-gradient(closest-side, rgba(0,184,217,0.17), rgba(0,184,217,0))" }}
      />
      <div
        ref={ring}
        data-state="idle"
        className="fixed left-0 top-0 z-[91] flex h-2.5 w-2.5 items-center justify-center rounded-full border border-transparent bg-glow opacity-0 transition-[width,height,background-color,border-color] duration-300 ease-expo data-[state=label]:h-[88px] data-[state=label]:w-[88px] data-[state=label]:bg-aqua data-[state=link]:h-9 data-[state=link]:w-9 data-[state=link]:border-glow data-[state=link]:bg-transparent"
      >
        <span ref={label} className="text-[0.8rem] font-semibold text-abyss" />
      </div>
    </div>
  );
}
