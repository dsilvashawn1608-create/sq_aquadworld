"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { ImageAsset } from "@/lib/content";

type Props = {
  images: ImageAsset[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

/** Full-screen viewer: arrow keys, Escape, focus trap, swipe left/right on touch screens. */
export default function Lightbox({ images, index, onClose, onChange }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const image = images[index];
  const count = images.length;

  const prev = useCallback(() => onChange((index - 1 + count) % count), [index, count, onChange]);
  const next = useCallback(() => onChange((index + 1) % count), [index, count, onChange]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Tab") {
        const order = [closeRef.current, prevRef.current, nextRef.current].filter(Boolean) as HTMLElement[];
        const i = order.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        const step = e.shiftKey ? -1 : 1;
        order[(i + step + order.length) % order.length]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[120] flex flex-col bg-abyss/95 backdrop-blur-xl" onClick={onClose}>
      <div className="flex items-center justify-between p-4 md:p-6" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <p aria-live="polite" className="text-sm text-foam/70">
          {index + 1} / {count}
        </p>
        <button ref={closeRef} type="button" className="btn btn-glass btn-sm" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="relative min-h-0 flex-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Image key={image.id} src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain p-2 md:p-8" priority />
      </div>

      {count > 1 ? (
        <div className="flex items-center justify-between p-4 md:p-6" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <button ref={prevRef} type="button" className="btn btn-glass btn-sm" onClick={prev} aria-label="Previous image">
            Previous
          </button>
          <button ref={nextRef} type="button" className="btn btn-glass btn-sm" onClick={next} aria-label="Next image">
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
