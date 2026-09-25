import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import { collectPending } from "@/lib/pending";
import { isDraft } from "@/lib/site";

export const metadata: Metadata = {
  title: "Client data checklist",
  robots: { index: false, follow: false },
};

/** Internal checklist (draft mode only) of every item still awaiting client information. */
export default function PendingPage() {
  if (!isDraft) notFound();

  const items = collectPending();
  const groups = Array.from(new Set(items.map((i) => i.group)));
  const required = items.filter((i) => i.required).length;

  return (
    <>
      <PageHeader title="Client data checklist" lede={`${required} required and ${items.length - required} optional items are still open. Edit src/content/*.json to fill them in.`} />
      <section className="pb-[clamp(6rem,12vw,11rem)]">
        <div className="wrap max-w-4xl space-y-14">
          {groups.map((g) => (
            <div key={g}>
              <h2 className="t-h3">{g}</h2>
              <ul className="mt-5 divide-y divide-white/12 border-y border-white/12">
                {items
                  .filter((i) => i.group === g)
                  .map((i) => (
                    <li key={i.label} className="flex gap-4 py-3.5">
                      <span
                        className={`mt-0.5 h-fit shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${i.required ? "border-[#ff9c93]/60 text-[#ff9c93]" : "border-white/25 text-foam/60"}`}
                      >
                        {i.required ? "Required" : "Optional"}
                      </span>
                      <span className="text-foam/85">{i.label}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
