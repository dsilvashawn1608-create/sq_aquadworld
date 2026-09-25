"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Phase = "idle" | "covering" | "covered";

/**
 * A quick dark-ocean liquid wipe between pages (~0.5s cover + ~0.6s reveal), no loading screen.
 * Internal link clicks are intercepted, the panel covers the page, the route changes underneath,
 * then the panel lifts away. Skipped entirely for reduced motion, modified clicks and same-page links.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const phase = useRef<Phase>("idle");
  const safety = useRef<number | undefined>(undefined);

  const reveal = useCallback(() => {
    const el = panel.current;
    if (!el) return;
    window.clearTimeout(safety.current);
    gsap.to(el, {
      yPercent: -100,
      duration: 0.65,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(el, { display: "none", yPercent: 100 });
        phase.current = "idle";
        ScrollTrigger.refresh();
      },
    });
  }, []);

  // New route committed: lift the panel.
  useEffect(() => {
    if (phase.current === "covered") reveal();
  }, [pathname, reveal]);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    gsap.set(el, { display: "none", yPercent: 100 });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const cover = (href: string) => {
      phase.current = "covering";
      gsap.set(el, { display: "block", yPercent: 100 });
      gsap.to(el, {
        yPercent: 0,
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: () => {
          phase.current = "covered";
          router.push(href);
          // If the navigation never lands (network error), never leave the user stuck behind the panel.
          safety.current = window.setTimeout(reveal, 3500);
        },
      });
    };

    const onClick = (e: MouseEvent) => {
      if (reduce.matches || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // hash / query on the same page: let the browser handle it
      e.preventDefault();
      e.stopPropagation(); // runs in the capture phase, so Next's own Link handler never fires
      if (phase.current !== "idle") return;
      cover(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(safety.current);
    };
  }, [router, reveal]);

  return (
    <div ref={panel} aria-hidden="true" className="pointer-events-auto fixed inset-0 z-[100] hidden">
      <svg className="absolute left-0 top-0 h-[60px] w-full -translate-y-[59px] text-trench" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path fill="currentColor" d="M0 60V30C170 6 340 0 520 16s360 32 540 14 270-24 380-16v46Z" />
      </svg>
      <div className="absolute inset-0 bg-linear-to-b from-trench via-deep to-abyss" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 45% at 50% 55%, rgba(0,184,217,0.16), transparent)" }} />
      <svg className="absolute bottom-0 left-0 h-[60px] w-full translate-y-[59px] text-abyss" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path fill="currentColor" d="M0 0v30c170 24 340 30 520 14s360-32 540-14 270 24 380 16V0Z" />
      </svg>
    </div>
  );
}
