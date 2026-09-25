"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/use-motion";

type Props = { children: ReactNode; className?: string; delay?: number };

/** Masked "rising water level" reveal with a slow inner settle. Give the wrapper its size and radius via className. */
export default function ImageReveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, () => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelector<HTMLElement>("[data-ir-inner]");
    const tl = gsap.timeline({ delay, scrollTrigger: { trigger: el, start: "top 86%", once: true } });
    tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" }, 0);
    if (inner) tl.fromTo(inner, { scale: 1.28 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0);
  });

  return (
    <div ref={ref} data-image-reveal="" className={cn("relative overflow-hidden", className)}>
      <div data-ir-inner="" className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
