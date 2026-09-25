"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import ImageReveal from "@/components/motion/ImageReveal";
import TextReveal from "@/components/motion/TextReveal";
import { cn } from "@/lib/cn";
import { img, processSteps } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/lib/use-motion";

/**
 * Consultation → Design → Build → Installation → Maintenance.
 * Desktop: a sticky stage inside a tall track. The vertical line fills with scroll, the current step opens, and its
 * photograph rises over the previous one like a water level. (Scrolling back lowers it again.)
 * Mobile: a normal vertical list with each step's photograph inline.
 * This is the only pinned section on the home page.
 */
export default function ProcessTimeline() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const last = useRef(0);
  const n = processSteps.length;

  useMotion(root, ({ desktop }) => {
    const el = root.current;
    const track = el?.querySelector<HTMLElement>("[data-proc-track]");
    const fill = el?.querySelector<HTMLElement>("[data-proc-fill]");
    if (!el || !track || !fill) return;

    ScrollTrigger.create({
      trigger: track,
      start: desktop ? "top top" : "top 65%",
      end: desktop ? "bottom bottom" : "bottom 65%",
      onUpdate: (self: { progress: number }) => {
        gsap.set(fill, { scaleY: self.progress });
        const i = Math.min(n - 1, Math.floor(self.progress * n));
        if (i !== last.current) {
          last.current = i;
          setActive(i);
        }
      },
    });
  });

  return (
    <section id="process" ref={root} aria-label="Our process" className="relative">
      <div data-proc-track="" className="relative py-24 lg:h-[520svh] lg:py-0">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center">
          <div className="wrap grid w-full gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <TextReveal as="h2" className="t-h2" text="From first conversation to lasting care" />

              <ol className="relative mt-12 space-y-3">
                <span aria-hidden="true" className="absolute bottom-3 left-[15px] top-3 w-px bg-white/12" />
                <span
                  data-proc-fill=""
                  aria-hidden="true"
                  className="absolute bottom-3 left-[15px] top-3 w-px origin-top scale-y-0 bg-linear-to-b from-glow to-emerald"
                />
                {processSteps.map((s, i) => {
                  const on = i === active;
                  const image = img(s.image);
                  return (
                    <li key={s.id} className="relative pl-14" aria-current={on ? "step" : undefined}>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full border text-sm font-semibold transition-colors duration-500",
                          i <= active ? "border-glow bg-abyss text-glow" : "border-white/20 bg-abyss text-foam/50"
                        )}
                      >
                        {i + 1}
                      </span>
                      <h3 className={cn("t-h3 transition-colors duration-500", on ? "text-foam" : "text-foam/45")}>{s.title}</h3>
                      <div
                        data-on={on}
                        className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-700 ease-expo lg:grid-rows-[0fr] lg:opacity-0 lg:data-[on=true]:grid-rows-[1fr] lg:data-[on=true]:opacity-100"
                      >
                        <div className="overflow-hidden">
                          <p className="story mt-3 max-w-[40ch] text-[1.05rem]">{s.text}</p>
                          <div className="mt-5 lg:hidden">
                            <ImageReveal className="aspect-[4/3] rounded-[var(--radius-card)]">
                              <Image src={image.src} alt="" fill sizes="92vw" className="object-cover" />
                            </ImageReveal>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="hidden lg:col-span-7 lg:block" aria-hidden="true">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-deep">
                {processSteps.map((s, i) => {
                  const image = img(s.image);
                  return (
                    <div key={s.id} className="proc-img absolute inset-0" data-on={i <= active} style={{ zIndex: i }}>
                      <Image src={image.src} alt="" fill sizes="(min-width: 1024px) 55vw, 0px" className="object-cover" />
                    </div>
                  );
                })}
                <div className="absolute inset-0 z-10 bg-linear-to-t from-abyss/70 via-transparent to-transparent" />
                <p className="absolute bottom-6 left-7 z-10 text-lg font-semibold">
                  {active + 1} / {n}
                  <span className="ml-3 text-foam/70">{processSteps[active]?.title}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
