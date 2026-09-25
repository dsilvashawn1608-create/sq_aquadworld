import type { RefObject } from "react";
import { gsap, useGSAP } from "./gsap";

export type MotionEnv = { desktop: boolean };

/**
 * Runs `setup` only when the user has NOT asked for reduced motion, and re-runs it when the
 * viewport crosses the desktop breakpoint. Everything created inside is reverted automatically.
 * Content is visible by default in CSS, so reduced-motion users simply skip the animation.
 */
export function useMotion(
  scope: RefObject<Element | null>,
  setup: (env: MotionEnv) => void | (() => void),
  deps: unknown[] = []
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 1024px)",
        },
        (ctx: { conditions?: Record<string, boolean> }) => {
          const c = ctx.conditions ?? {};
          if (!c.motion) return;
          return setup({ desktop: Boolean(c.desktop) });
        }
      );
      return () => mm.revert();
    },
    { scope, dependencies: deps, revertOnUpdate: true }
  );
}
