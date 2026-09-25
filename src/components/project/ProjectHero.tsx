"use client";

import Image from "next/image";
import { useRef } from "react";
import Atmosphere from "@/components/motion/Atmosphere";
import TextReveal from "@/components/motion/TextReveal";
import { cn } from "@/lib/cn";
import type { ImageAsset } from "@/lib/content";
import { categoryLabel } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { useMotion } from "@/lib/use-motion";

type Props = {
  image: ImageAsset;
  title: string;
  titleIsPlaceholder: boolean;
  category: string;
  location: string | null;
  year: string | null;
};

/** Case-study opening: the final photograph "opens" from a slight zoom, then scales and drifts as you scroll away. */
export default function ProjectHero({ image, title, titleIsPlaceholder, category, location, year }: Props) {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const media = el.querySelector<HTMLElement>("[data-ph-media]");
    const inner = el.querySelector<HTMLElement>("[data-ph-img]");
    const content = el.querySelector<HTMLElement>("[data-ph-content]");
    if (!media || !inner || !content) return;

    gsap.fromTo(inner, { scale: 1.15 }, { scale: 1, duration: 2.6, ease: "expo.out" });
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 } })
      .to(media, { scale: 1.14, yPercent: 8, ease: "none", duration: 1 }, 0)
      .to(content, { yPercent: -12, opacity: 0, ease: "none", duration: 0.6 }, 0.05);
  });

  return (
    <section ref={root} aria-label="Project introduction" className="relative h-[82svh] min-h-[560px] overflow-hidden bg-abyss">
      <div data-ph-media="" className="absolute inset-0 will-change-transform">
        <div data-ph-img="" className="absolute inset-0 will-change-transform">
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-abyss via-abyss/35 to-abyss/25" />
      <Atmosphere caustics={false} particles={10} />

      <div data-ph-content="" className="wrap relative z-10 flex h-full flex-col justify-end pb-[clamp(2.5rem,8svh,5rem)] pt-32">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-white/25 bg-abyss/40 px-4 py-1.5 font-medium backdrop-blur-md">{categoryLabel(category)}</span>
          {location ? <span className="text-foam/80">{location}</span> : null}
          {year ? <span className="text-foam/80">{year}</span> : null}
        </div>
        <TextReveal as="h1" trigger="load" delay={0.5} className={cn("t-statement max-w-[16ch]", titleIsPlaceholder && "text-glow")} text={title} />
      </div>
    </section>
  );
}
