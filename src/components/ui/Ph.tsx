import { cn } from "@/lib/cn";
import { isDraft } from "@/lib/site";

/**
 * Visible placeholder for information the client has not supplied yet.
 * Renders nothing outside draft mode, so a production build never shows [BRACKETS].
 */
export function Ph({ label, className }: { label: string; className?: string }) {
  if (!isDraft) return null;
  return (
    <span className={cn("ph", className)} title="Awaiting client information">
      [{label}]
    </span>
  );
}
