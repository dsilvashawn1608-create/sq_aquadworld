import Link from "next/link";
import { collectPending } from "@/lib/pending";
import { isDraft } from "@/lib/site";

/** Only in draft mode: a small reminder that placeholders are showing, linking to the full checklist. */
export default function DraftBanner() {
  if (!isDraft) return null;
  const required = collectPending().filter((i) => i.required).length;
  return (
    <Link
      href="/pending/"
      className="fixed bottom-20 left-4 z-30 rounded-full border border-glow/40 bg-abyss/85 px-4 py-2 text-[0.8rem] font-medium text-glow backdrop-blur-md md:bottom-4"
    >
      Draft mode: {required} items need client data
    </Link>
  );
}
