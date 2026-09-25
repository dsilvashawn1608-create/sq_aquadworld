"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/use-motion";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate every descendant marked `data-reveal-item` (staggered) instead of the wrapper itself. */
  items?: boolean;
  y?: number;
  delay?: number;
  stagger?: number;
  start?: string;
};

/** Quiet entrance for a block of content. Use sparingly: headings and key statements get TextReveal instead. */
export default function ScrollReveal({
  children,
  as: Tag = "div",
  className,
  items = false,
  y = 28,
  delay = 0,
  stagger = 0.09,
  start = "top 88%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, () => {
    const el = ref.current;
    if (!el) return;
    const targets = items ? Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-item]")) : [el];
    if (!targets.length) return;
    gsap.fromTo(
      targets,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration: 1.1, delay, stagger, ease: "expo.out", scrollTrigger: { trigger: el, start, once: true } }
    );
  });

  return (
    <Tag ref={ref as never} className={className} {...(items ? {} : { "data-reveal": "" })}>
      {children}
    </Tag>
  );
}
