"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/use-motion";

type Props = {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
  radiusFrom?: number;
  radiusTo?: number;
  start?: string;
  end?: string;
};

/** Scrubbed scale + corner-radius change: a frame that opens up as it arrives (mirrors the hero contracting away). */
export default function ScaleOnScroll({
  children,
  className,
  from = 0.88,
  to = 1,
  radiusFrom = 40,
  radiusTo = 0,
  start = "top bottom",
  end = "top 25%",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, () => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { scale: from, borderRadius: radiusFrom },
      { scale: to, borderRadius: radiusTo, ease: "none", scrollTrigger: { trigger: el, start, end, scrub: 0.6 } }
    );
  });

  return (
    <div ref={ref} className={cn("overflow-hidden will-change-transform", className)}>
      {children}
    </div>
  );
}
