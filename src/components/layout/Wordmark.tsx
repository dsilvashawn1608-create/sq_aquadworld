import { cn } from "@/lib/cn";

/** Text wordmark with a small water glyph. Replace with the real logo once the client supplies one. */
export default function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 shrink-0 text-glow" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="16" cy="16" r="14" opacity="0.35" />
        <path d="M6 18c3-4 6-4 10 0s7 4 10 0" />
        <path d="M9 12.5c2-2.5 4-2.5 7 0s5 2.5 7 0" opacity="0.6" />
        <circle cx="20.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[0.72rem] font-medium text-foam/65">Steve Fernandes</span>
        <span className="mt-1 text-[1.15rem] font-bold tracking-tight">Aqua World</span>
      </span>
    </span>
  );
}
