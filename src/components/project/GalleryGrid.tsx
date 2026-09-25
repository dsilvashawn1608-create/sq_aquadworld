"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import ImageReveal from "@/components/motion/ImageReveal";
import { cn } from "@/lib/cn";
import type { ImageAsset } from "@/lib/content";
import Lightbox from "./Lightbox";

export type GalleryItem = {
  image: ImageAsset;
  /** Column span classes (12-column grid), e.g. "md:col-span-5". */
  span?: string;
  /** Aspect ratio classes for the tile. */
  aspect?: string;
  sizes?: string;
};

/** Large-tile gallery with rounded corners, slow hover zoom, and a lightbox with keyboard and swipe support. */
export default function GalleryGrid({ items, className }: { items: GalleryItem[]; className?: string }) {
  const [current, setCurrent] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setCurrent(null);
    opener.current?.focus();
  }, []);

  return (
    <>
      <ul className={cn("grid grid-cols-12 gap-4 md:gap-6", className)}>
        {items.map((it, i) => (
          <li key={`${it.image.id}-${i}`} className={cn("col-span-12", it.span)}>
            <ImageReveal className={cn("rounded-[var(--radius-card)] bg-deep", it.aspect ?? "aspect-[4/3]")}>
              <button
                type="button"
                data-cursor="Open"
                aria-label={`View larger: ${it.image.alt}`}
                className="group relative block h-full w-full"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  opener.current = e.currentTarget;
                  setCurrent(i);
                }}
              >
                <Image
                  src={it.image.src}
                  alt=""
                  fill
                  sizes={it.sizes ?? "(min-width: 1024px) 50vw, 92vw"}
                  className="object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.05]"
                />
              </button>
            </ImageReveal>
          </li>
        ))}
      </ul>

      {current !== null ? <Lightbox images={items.map((i) => i.image)} index={current} onClose={close} onChange={setCurrent} /> : null}
    </>
  );
}
