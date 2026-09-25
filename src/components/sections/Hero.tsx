"use client";

import Image from "next/image";
import { useRef } from "react";
import Atmosphere from "@/components/motion/Atmosphere";
import TextReveal from "@/components/motion/TextReveal";
import Button from "@/components/ui/Button";
import { img } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { ENQUIRE_HREF, site } from "@/lib/site";
import { useMotion } from "@/lib/use-motion";

const hero = img("heroLongTank");

/**
 * ~70% of the first viewport. On load the photograph settles from a slight zoom while the statement rises.
 * On scroll the image scales and drifts, the copy lifts away, the ocean gradient rises, and the whole frame
 * narrows with rounded corners, handing over to the story section below.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, () => {
    const el = root.current;
    if (!el) return;
    const frame = el.querySelector<HTMLElement>("[data-hero-frame]");
    const media = el.querySelector<HTMLElement>("[data-hero-media]");
    const image = el.querySelector<HTMLElement>("[data-hero-img]");
    const content = el.querySelector<HTMLElement>("[data-hero-content]");
    const veil = el.querySelector<HTMLElement>("[data-hero-veil]");
    const intro = el.querySelectorAll<HTMLElement>("[data-hero-intro]");
    if (!frame || !media || !image || !content || !veil) return;

    gsap.fromTo(image, { scale: 1.16 }, { scale: 1, duration: 2.8, ease: "expo.out" });
    gsap.fromTo(intro, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12, delay: 0.9, ease: "expo.out" });

    gsap
      .timeline({ scrollTrigger: { trigger: frame, start: "top top", end: "bottom top", scrub: 0.6 } })
      .to(media, { scale: 1.16, yPercent: 9, ease: "none", duration: 1 }, 0)
      .to(content, { yPercent: -16, opacity: 0, ease: "none", duration: 0.55 }, 0.05)
      .to(veil, { opacity: 1, ease: "none", duration: 0.7 }, 0.3)
      .to(frame, { clipPath: "inset(0% 4% 0% 4% round 0px 0px 40px 40px)", ease: "none", duration: 0.6 }, 0.4);
  });

  return (
    <section ref={root} aria-label="Introduction" className="relative">
      <div data-hero-frame="" className="relative h-[70svh] min-h-[540px] overflow-hidden bg-abyss">
        <div data-hero-media="" className="absolute inset-0 will-change-transform">
          <div data-hero-img="" className="absolute inset-0 will-change-transform">
            <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "50% 62%" }} />
          </div>
        </div>

        {/* Tonal overlays: dark at the base for legibility, deep-ocean tint from the lower left */}
        <div className="absolute inset-0 bg-linear-to-t from-abyss via-abyss/50 to-abyss/30" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 15% 100%, rgba(10,61,98,0.6), transparent 60%)" }} />

        <Atmosphere fish fishTop="46%" particles={22} />
        <div data-hero-veil="" className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-abyss to-transparent opacity-0" />

        <div data-hero-content="" className="wrap relative z-10 flex h-full flex-col justify-end pb-[clamp(2.25rem,7svh,4.5rem)] pt-28">
          <h1>
            <span data-hero-intro="" className="flex items-center gap-3 text-[clamp(1rem,0.9rem_+_0.5vw,1.3rem)] font-medium text-foam">
              <span aria-hidden="true" className="h-px w-8 bg-glow" />
              {site.brand.name}
            </span>
            <TextReveal as="span" trigger="load" delay={0.5} className="t-hero mt-4 block max-w-[58rem]" text={site.brand.statement} />
          </h1>
          <p data-hero-intro="" className="mt-5 text-[clamp(0.95rem,0.85rem_+_0.5vw,1.2rem)] text-foam/80">
            {site.brand.supporting}
          </p>
          <div data-hero-intro="" className="mt-7 flex flex-wrap gap-3">
            <Button href="/projects/" magnetic>
              View Portfolio
            </Button>
            <Button href={ENQUIRE_HREF} variant="glass">
              Get Free Consultation
            </Button>
          </div>
        </div>

        <div aria-hidden="true" className="absolute bottom-8 right-[var(--gutter)] z-10 hidden h-16 w-px overflow-hidden bg-white/15 md:block">
          <span className="scroll-cue block h-full w-full bg-glow" />
        </div>
      </div>
    </section>
  );
}
