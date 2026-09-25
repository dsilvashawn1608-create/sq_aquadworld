"use client";

import { Fragment, useRef, type ElementType } from "react";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/use-motion";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** "scroll" reveals when the heading enters the viewport; "load" plays immediately (hero). */
  trigger?: "scroll" | "load";
  delay?: number;
  stagger?: number;
  start?: string;
};

/**
 * Masked word-by-word heading reveal. The real text stays in the DOM for screen readers and search engines
 * (sr-only copy); the animated words are aria-hidden.
 */
export default function TextReveal({ text, as: Tag = "h2", className, trigger = "scroll", delay = 0, stagger = 0.05, start = "top 88%" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useMotion(ref, () => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(".tr-word");
    gsap.fromTo(
      targets,
      { yPercent: 118 },
      {
        yPercent: 0,
        duration: 1.2,
        delay,
        stagger,
        ease: "expo.out",
        ...(trigger === "scroll" ? { scrollTrigger: { trigger: el, start, once: true } } : {}),
      }
    );
  });

  return (
    <Tag ref={ref as never} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="tr-mask" aria-hidden="true">
            <span className="tr-word">{w}</span>
          </span>{" "}
        </Fragment>
      ))}
    </Tag>
  );
}
