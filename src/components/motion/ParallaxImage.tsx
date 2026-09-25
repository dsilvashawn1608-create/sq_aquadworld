"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import type { ImageAsset } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/use-motion";

type Props = {
  image: ImageAsset;
  sizes: string;
  /** Sizing, aspect ratio and radius for the frame. */
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Vertical travel in % of the image height (max ~9). Different values on neighbours create depth. */
  range?: number;
  objectPosition?: string;
};

/** Image that drifts slower than the page inside a clipped frame. */
export default function ParallaxImage({ image, sizes, className, imgClassName, priority, range = 7, objectPosition = "50% 50%" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, () => {
    const el = ref.current;
    const inner = el?.querySelector<HTMLElement>("[data-px]");
    if (!el || !inner) return;
    const r = Math.min(range, 9);
    gsap.fromTo(
      inner,
      { yPercent: -r },
      { yPercent: r, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } }
    );
  });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div data-px="" className="absolute inset-x-0 will-change-transform" style={{ top: "-12%", bottom: "-12%" }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imgClassName)}
          style={{ objectPosition }}
        />
      </div>
    </div>
  );
}
