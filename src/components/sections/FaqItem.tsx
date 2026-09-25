"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Accessible accordion row: real button, aria-expanded, animated height via grid rows. */
export default function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="border-b border-white/12">
      <h3>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-6 py-6 text-left text-[clamp(1.1rem,1rem_+_0.6vw,1.5rem)] font-semibold tracking-tight"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={() => setOpen((v) => !v)}
        >
          {question}
          <span
            aria-hidden="true"
            className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 transition-transform duration-500 ease-expo", open && "rotate-45 border-glow text-glow")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M7 1v12M1 7h12" />
            </svg>
          </span>
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} data-open={open} className="acc-panel">
        <div>
          <div className="story pb-7 pr-12 text-[1.05rem]">{children}</div>
        </div>
      </div>
    </div>
  );
}
