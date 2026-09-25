import { cn } from "@/lib/cn";
import Particles from "./Particles";

type Props = {
  className?: string;
  rays?: boolean;
  caustics?: boolean;
  /** One barely-visible fish silhouette drifting across. Hero only. */
  fish?: boolean;
  fishTop?: string;
  /** Number of rising bubbles (0 disables the canvas). */
  particles?: number;
};

/**
 * The underwater layer: light rays, slow caustic shimmer, a few bubbles and (optionally) one fish silhouette.
 * Everything is decorative (aria-hidden, pointer-events none) and used only in the hero, final CTA and footer.
 */
export default function Atmosphere({ className, rays = true, caustics = true, fish = false, fishTop = "58%", particles = 0 }: Props) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {rays && <div className="atmo-rays" />}
      {caustics && <div className="atmo-caustics" />}
      {fish && (
        <svg className="atmo-fish" style={{ top: fishTop }} viewBox="0 0 44 24" fill="currentColor">
          <path d="M2 12C8 4 18 3 27 9l13-7v20l-13-7C18 21 8 20 2 12Z" />
        </svg>
      )}
      {particles > 0 && <Particles count={particles} mobileCount={Math.ceil(particles / 2)} />}
    </div>
  );
}
