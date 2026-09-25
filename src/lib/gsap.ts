import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Single place where GSAP plugins are registered. Import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"
 * from client components only.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const w = window as unknown as { __motionBooted?: boolean; __motionInit?: boolean };
  w.__motionBooted = true; // tells the inline boot script that motion is running (see layout.tsx)

  if (!w.__motionInit) {
    w.__motionInit = true;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Keep the "hidden until animated" CSS in sync if the user flips the OS setting mid-session.
    mq.addEventListener("change", () => document.documentElement.classList.toggle("motion-ok", !mq.matches));
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
}

export { gsap, ScrollTrigger, useGSAP };
